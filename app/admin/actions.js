'use server';
import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { audit, requireAdmin } from '@/lib/auth';
import { SESSION_COOKIE, SESSION_HOURS, signSession } from '@/lib/session';
import { clean, cleanMultiline, isEmail, tenDigitPhone, toInt } from '@/lib/validate';
import { HOSTEL_TYPES, site } from '@/lib/site';
import { channels, noticeEmailHtml, sendEmail, sendWhatsAppNotice } from '@/lib/notify';

const id = (formData) => {
  const n = toInt(formData.get('id'), { min: 1, max: 2 ** 31 - 1 });
  if (!n) throw new Error('Invalid id');
  return n;
};
const refreshPublic = () => {
  revalidatePath('/');
  revalidatePath('/notices');
  revalidatePath('/events');
};

/* ---------------- auth ---------------- */

let dummyHash;

export async function login(_prev, formData) {
  const email = clean(formData.get('email'), 160).toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.' };
  const sql = db();

  const [{ n }] = await sql`SELECT count(*)::int AS n FROM audit_log
                            WHERE action = 'login_failed' AND target = ${email} AND created_at > now() - interval '15 minutes'`;
  if (n >= 8) return { error: 'Too many failed attempts. Try again in 15 minutes.' };

  const rows = await sql`SELECT id, password_hash FROM admins WHERE email = ${email} AND active`;
  // Compare against a dummy hash when the user doesn't exist so timing doesn't reveal valid emails.
  dummyHash ??= await bcrypt.hash('not-a-real-password', 12);
  const hash = rows[0]?.password_hash ?? dummyHash;
  const ok = await bcrypt.compare(password, hash);
  if (!rows[0] || !ok) {
    const ip = (await headers()).get('x-forwarded-for')?.split(',')[0] ?? null;
    await audit(null, 'login_failed', email, { ip });
    return { error: 'Incorrect email or password.' };
  }
  const adminId = rows[0].id;
  await sql`UPDATE admins SET last_login_at = now() WHERE id = ${adminId}`;
  await audit(adminId, 'login', email);
  (await cookies()).set(SESSION_COOKIE, await signSession({ sub: String(adminId) }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  });
  redirect('/admin');
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/admin/login');
}

export async function changeOwnPassword(_prev, formData) {
  const admin = await requireAdmin();
  const current = String(formData.get('current') ?? '');
  const next = String(formData.get('next') ?? '');
  if (next.length < 10) return { error: 'New password must be at least 10 characters.' };
  const [row] = await db()`SELECT password_hash FROM admins WHERE id = ${admin.id}`;
  if (!(await bcrypt.compare(current, row.password_hash))) return { error: 'Current password is incorrect.' };
  await db()`UPDATE admins SET password_hash = ${await bcrypt.hash(next, 12)} WHERE id = ${admin.id}`;
  await audit(admin.id, 'password_changed', admin.email);
  return { ok: 'Password changed.' };
}

/* ---------------- memberships ---------------- */

async function welcomeMember(m) {
  if (!m.email || !channels.email()) return;
  await sendEmail({
    to: m.email,
    subject: `Welcome to ${site.shortName}: membership ${m.membership_no}`,
    html: noticeEmailHtml({
      name: m.owner_name,
      title: 'Your membership is approved',
      body: `Your ${site.shortName} membership for ${m.hostel_name} has been approved.\n\nMembership number: ${m.membership_no}${
        m.valid_until ? `\nValid until: ${new Date(m.valid_until).toLocaleDateString('en-IN')}` : ''
      }\n\nYou will now receive association circulars and meeting notices.`,
      url: site.url,
    }),
  }).catch(() => {});
}

export async function approveMember(formData) {
  const admin = await requireAdmin();
  const memberId = id(formData);
  const rows = await db()`
    UPDATE members SET
      status = 'approved',
      membership_no = COALESCE(membership_no, 'ITCHA-' || lpad(id::text, 4, '0')),
      approved_at = now(),
      approved_by = ${admin.id},
      rejection_reason = NULL,
      valid_until = CASE WHEN tier = 'lifetime' THEN NULL ELSE COALESCE(valid_until, (now() AT TIME ZONE 'Asia/Kolkata')::date + interval '1 year')::date END
    WHERE id = ${memberId} AND status IN ('pending','rejected')
    RETURNING id, owner_name, email, hostel_name, membership_no, valid_until`;
  if (rows[0]) {
    await audit(admin.id, 'member_approved', String(memberId), { membership_no: rows[0].membership_no });
    await welcomeMember(rows[0]);
  }
  revalidatePath('/admin', 'layout');
}

export async function rejectMember(formData) {
  const admin = await requireAdmin();
  const memberId = id(formData);
  const reason = clean(formData.get('reason'), 300) || null;
  await db()`UPDATE members SET status = 'rejected', rejection_reason = ${reason} WHERE id = ${memberId} AND status = 'pending'`;
  await audit(admin.id, 'member_rejected', String(memberId), { reason });
  revalidatePath('/admin', 'layout');
}

export async function setMemberStatus(formData) {
  const admin = await requireAdmin();
  const memberId = id(formData);
  const status = formData.get('status');
  if (!['approved', 'suspended'].includes(status)) throw new Error('Invalid status');
  await db()`UPDATE members SET status = ${status} WHERE id = ${memberId} AND status IN ('approved','suspended')`;
  await audit(admin.id, `member_${status === 'approved' ? 'reactivated' : 'suspended'}`, String(memberId));
  revalidatePath('/admin', 'layout');
}

export async function renewMember(formData) {
  const admin = await requireAdmin();
  const memberId = id(formData);
  const rows = await db()`
    UPDATE members SET valid_until = (GREATEST(COALESCE(valid_until, CURRENT_DATE), (now() AT TIME ZONE 'Asia/Kolkata')::date) + interval '1 year')::date
    WHERE id = ${memberId} AND status = 'approved' AND tier <> 'lifetime' RETURNING valid_until`;
  if (rows[0]) await audit(admin.id, 'member_renewed', String(memberId), { valid_until: rows[0].valid_until });
  revalidatePath('/admin', 'layout');
}

function memberFields(formData) {
  const f = (k, max) => clean(formData.get(k), max);
  const phone = tenDigitPhone(formData.get('phone'));
  const email = f('email', 160).toLowerCase();
  const out = {
    owner_name: f('owner_name', 120),
    phone,
    email: email || null,
    hostel_name: f('hostel_name', 160),
    hostel_type: HOSTEL_TYPES.some((t) => t.id === formData.get('hostel_type')) ? formData.get('hostel_type') : 'boys',
    area: f('area', 120),
    address: f('address', 400) || null,
    beds: formData.get('beds') ? toInt(formData.get('beds'), { min: 1, max: 5000 }) : null,
    branches: toInt(formData.get('branches') || '1', { min: 1, max: 100 }) ?? 1,
    tier: site.membership.tiers.some((t) => t.id === formData.get('tier')) ? formData.get('tier') : site.membership.tiers[0].id,
    notes: cleanMultiline(formData.get('notes'), 2000) || null,
    valid_until: /^\d{4}-\d{2}-\d{2}$/.test(formData.get('valid_until') ?? '') ? formData.get('valid_until') : null,
  };
  if (out.owner_name.length < 2) return { error: 'Owner name is required.' };
  if (!phone) return { error: 'A valid 10-digit mobile number is required.' };
  if (out.email && !isEmail(out.email)) return { error: 'Email address is not valid.' };
  if (out.hostel_name.length < 2 || out.area.length < 2) return { error: 'Hostel name and area are required.' };
  return { data: out };
}

export async function addMember(_prev, formData) {
  const admin = await requireAdmin();
  const { data: d, error } = memberFields(formData);
  if (error) return { error };
  const [m] = await db()`
    INSERT INTO members (owner_name, phone, email, hostel_name, hostel_type, area, address, beds, branches, tier, notes, status, approved_at, approved_by, valid_until)
    VALUES (${d.owner_name}, ${d.phone}, ${d.email}, ${d.hostel_name}, ${d.hostel_type}, ${d.area}, ${d.address}, ${d.beds}, ${d.branches}, ${d.tier}, ${d.notes},
            'approved', now(), ${admin.id},
            ${d.tier === 'lifetime' ? null : d.valid_until}::date)
    RETURNING id`;
  const [row] = await db()`
    UPDATE members SET membership_no = 'ITCHA-' || lpad(id::text, 4, '0'),
      valid_until = CASE WHEN tier = 'lifetime' THEN NULL ELSE COALESCE(valid_until, ((now() AT TIME ZONE 'Asia/Kolkata')::date + interval '1 year')::date) END
    WHERE id = ${m.id} RETURNING id, owner_name, email, hostel_name, membership_no, valid_until`;
  await audit(admin.id, 'member_added', String(m.id), { membership_no: row.membership_no });
  await welcomeMember(row);
  revalidatePath('/admin', 'layout');
  redirect(`/admin/members/${m.id}`);
}

export async function updateMember(_prev, formData) {
  const admin = await requireAdmin();
  const memberId = id(formData);
  const { data: d, error } = memberFields(formData);
  if (error) return { error };
  await db()`
    UPDATE members SET owner_name = ${d.owner_name}, phone = ${d.phone}, email = ${d.email}, hostel_name = ${d.hostel_name},
      hostel_type = ${d.hostel_type}, area = ${d.area}, address = ${d.address}, beds = ${d.beds}, branches = ${d.branches},
      tier = ${d.tier}, notes = ${d.notes},
      valid_until = CASE WHEN ${d.tier} = 'lifetime' THEN NULL ELSE COALESCE(${d.valid_until}::date, valid_until) END
    WHERE id = ${memberId}`;
  await audit(admin.id, 'member_updated', String(memberId));
  revalidatePath('/admin', 'layout');
  return { ok: 'Saved.' };
}

export async function deleteMember(formData) {
  const admin = await requireAdmin({ role: 'super_admin' });
  const memberId = id(formData);
  await db()`DELETE FROM members WHERE id = ${memberId}`;
  await audit(admin.id, 'member_deleted', String(memberId));
  revalidatePath('/admin', 'layout');
  redirect('/admin/members');
}

/* ---------------- notices & notifications ---------------- */

async function recipients(filter) {
  const sql = db();
  const area = clean(filter.area, 120);
  if (area) {
    return sql`SELECT id, owner_name, phone, email FROM members
               WHERE status = 'approved' AND (valid_until IS NULL OR valid_until >= CURRENT_DATE) AND area ILIKE ${'%' + area + '%'}`;
  }
  return sql`SELECT id, owner_name, phone, email FROM members
             WHERE status = 'approved' AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)`;
}

async function runPool(items, size, fn) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) {
        const item = items[i++];
        results.push(await fn(item));
      }
    }),
  );
  return results;
}

async function deliver(admin, notice, chosen, filter) {
  const list = await recipients(filter);
  const url = notice.audience === 'public' ? `${site.url}/notices/${notice.id}` : null;
  const summary = [];
  for (const channel of chosen) {
    const targets = list.filter((m) => (channel === 'email' ? m.email : m.phone));
    const results = await runPool(targets, 5, (m) =>
      channel === 'email'
        ? sendEmail({ to: m.email, subject: `${site.shortName}: ${notice.title}`, html: noticeEmailHtml({ name: m.owner_name, title: notice.title, body: notice.body, url }) })
        : sendWhatsAppNotice({ phone: m.phone, name: m.owner_name, title: notice.title }),
    );
    const sent = results.filter((r) => r.ok).length;
    const errors = [...new Set(results.filter((r) => !r.ok).map((r) => r.error))].slice(0, 5);
    await db()`INSERT INTO notification_logs (notice_id, channel, recipients, sent, failed, details, created_by)
               VALUES (${notice.id}, ${channel}, ${targets.length}, ${sent}, ${targets.length - sent},
                       ${JSON.stringify({ area: filter.area || null, errors })}, ${admin.id})`;
    summary.push(`${channel}: ${sent}/${targets.length} sent`);
  }
  return summary;
}

function chosenChannels(formData) {
  return ['email', 'whatsapp'].filter((c) => formData.getAll('channels').includes(c) && channels[c]());
}

export async function createNotice(_prev, formData) {
  const admin = await requireAdmin();
  const title = clean(formData.get('title'), 200);
  const body = cleanMultiline(formData.get('body'), 10000);
  const category = ['circular', 'meeting', 'update'].includes(formData.get('category')) ? formData.get('category') : 'update';
  const audience = formData.get('audience') === 'members' ? 'members' : 'public';
  if (title.length < 3 || body.length < 3) return { error: 'Title and message are required.' };
  const [notice] = await db()`INSERT INTO notices (title, body, category, audience, created_by)
                              VALUES (${title}, ${body}, ${category}, ${audience}, ${admin.id}) RETURNING *`;
  await audit(admin.id, 'notice_created', String(notice.id), { audience });
  const chosen = chosenChannels(formData);
  const summary = chosen.length ? await deliver(admin, notice, chosen, { area: formData.get('area') }) : [];
  refreshPublic();
  revalidatePath('/admin', 'layout');
  return {
    ok: `Notice saved${audience === 'public' ? ' and published on the website' : ' (members only, not on the website)'}.${summary.length ? ' ' + summary.join(', ') + '.' : ''}`,
  };
}

export async function resendNotice(_prev, formData) {
  const admin = await requireAdmin();
  const [notice] = await db()`SELECT * FROM notices WHERE id = ${id(formData)}`;
  if (!notice) return { error: 'Notice not found.' };
  const chosen = chosenChannels(formData);
  if (!chosen.length) return { error: 'Choose at least one configured channel.' };
  const summary = await deliver(admin, notice, chosen, { area: formData.get('area') });
  await audit(admin.id, 'notice_sent', String(notice.id), { summary });
  revalidatePath('/admin', 'layout');
  return { ok: summary.join(', ') };
}

export async function toggleNotice(formData) {
  const admin = await requireAdmin();
  const noticeId = id(formData);
  await db()`UPDATE notices SET published = NOT published WHERE id = ${noticeId}`;
  await audit(admin.id, 'notice_toggled', String(noticeId));
  refreshPublic();
  revalidatePath('/admin', 'layout');
}

export async function deleteNotice(formData) {
  const admin = await requireAdmin();
  const noticeId = id(formData);
  await db()`DELETE FROM notices WHERE id = ${noticeId}`;
  await audit(admin.id, 'notice_deleted', String(noticeId));
  refreshPublic();
  revalidatePath('/admin', 'layout');
}

/* ---------------- events ---------------- */

export async function createEvent(_prev, formData) {
  const admin = await requireAdmin();
  const title = clean(formData.get('title'), 200);
  const when = String(formData.get('starts_at') ?? '');
  const venue = clean(formData.get('venue'), 300) || null;
  const description = cleanMultiline(formData.get('description'), 5000) || null;
  if (title.length < 3) return { error: 'Title is required.' };
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(when)) return { error: 'Date and time are required.' };
  // The form's datetime-local value is IST wall-clock time.
  const startsAt = `${when}:00+05:30`;
  const [e] = await db()`INSERT INTO events (title, starts_at, venue, description) VALUES (${title}, ${startsAt}, ${venue}, ${description}) RETURNING id`;
  await audit(admin.id, 'event_created', String(e.id));
  refreshPublic();
  revalidatePath('/admin', 'layout');
  return { ok: 'Event added.' };
}

export async function toggleEvent(formData) {
  const admin = await requireAdmin();
  const eventId = id(formData);
  await db()`UPDATE events SET published = NOT published WHERE id = ${eventId}`;
  await audit(admin.id, 'event_toggled', String(eventId));
  refreshPublic();
  revalidatePath('/admin', 'layout');
}

export async function deleteEvent(formData) {
  const admin = await requireAdmin();
  const eventId = id(formData);
  await db()`DELETE FROM events WHERE id = ${eventId}`;
  await audit(admin.id, 'event_deleted', String(eventId));
  refreshPublic();
  revalidatePath('/admin', 'layout');
}

/* ---------------- enquiries ---------------- */

export async function toggleEnquiry(formData) {
  const admin = await requireAdmin();
  const enquiryId = id(formData);
  await db()`UPDATE enquiries SET status = CASE WHEN status = 'new' THEN 'closed' ELSE 'new' END WHERE id = ${enquiryId}`;
  await audit(admin.id, 'enquiry_toggled', String(enquiryId));
  revalidatePath('/admin', 'layout');
}

/* ---------------- admin users (super admin only) ---------------- */

export async function createAdmin(_prev, formData) {
  const admin = await requireAdmin({ role: 'super_admin' });
  const name = clean(formData.get('name'), 120);
  const email = clean(formData.get('email'), 160).toLowerCase();
  const password = String(formData.get('password') ?? '');
  const role = formData.get('role') === 'super_admin' ? 'super_admin' : 'committee';
  if (name.length < 2 || !isEmail(email)) return { error: 'Name and a valid email are required.' };
  if (password.length < 10) return { error: 'Password must be at least 10 characters.' };
  const exists = await db()`SELECT 1 FROM admins WHERE email = ${email}`;
  if (exists.length) return { error: 'An admin with this email already exists.' };
  await db()`INSERT INTO admins (name, email, password_hash, role) VALUES (${name}, ${email}, ${await bcrypt.hash(password, 12)}, ${role})`;
  await audit(admin.id, 'admin_created', email, { role });
  revalidatePath('/admin/admins');
  return { ok: `${name} can now sign in. Share the password with them privately.` };
}

export async function toggleAdmin(formData) {
  const admin = await requireAdmin({ role: 'super_admin' });
  const targetId = id(formData);
  if (targetId === admin.id) throw new Error('You cannot deactivate yourself');
  await db()`UPDATE admins SET active = NOT active WHERE id = ${targetId}`;
  await audit(admin.id, 'admin_toggled', String(targetId));
  revalidatePath('/admin/admins');
}

export async function resetAdminPassword(_prev, formData) {
  const admin = await requireAdmin({ role: 'super_admin' });
  const targetId = id(formData);
  const password = String(formData.get('password') ?? '');
  if (password.length < 10) return { error: 'Password must be at least 10 characters.' };
  await db()`UPDATE admins SET password_hash = ${await bcrypt.hash(password, 12)} WHERE id = ${targetId}`;
  await audit(admin.id, 'admin_password_reset', String(targetId));
  return { ok: 'Password reset.' };
}
