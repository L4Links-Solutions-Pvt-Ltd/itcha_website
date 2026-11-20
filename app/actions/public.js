'use server';
import { db, hasDb } from '@/lib/db';
import { clean, cleanMultiline, isEmail, tenDigitPhone, toInt } from '@/lib/validate';
import { HOSTEL_TYPES, site } from '@/lib/site';
import { notifyOffice } from '@/lib/notify';

const fail = (error, values) => ({ ok: false, error, values });

export async function applyForMembership(_prev, formData) {
  const v = Object.fromEntries(['owner_name', 'phone', 'email', 'hostel_name', 'hostel_type', 'area', 'address', 'beds', 'branches', 'tier'].map((k) => [k, formData.get(k) ?? '']));
  if (formData.get('website')) return { ok: true }; // honeypot: bots fill hidden fields

  const owner_name = clean(v.owner_name, 120);
  const phone = tenDigitPhone(v.phone);
  const email = clean(v.email, 160).toLowerCase();
  const hostel_name = clean(v.hostel_name, 160);
  const hostel_type = HOSTEL_TYPES.some((t) => t.id === v.hostel_type) ? v.hostel_type : null;
  const area = clean(v.area, 120);
  const address = clean(v.address, 400);
  const beds = v.beds ? toInt(v.beds, { min: 1, max: 5000 }) : null;
  const branches = toInt(v.branches || '1', { min: 1, max: 100 });
  const tier = site.membership.tiers.some((t) => t.id === v.tier) ? v.tier : site.membership.tiers[0].id;

  if (owner_name.length < 2) return fail('Please enter your name.', v);
  if (!phone) return fail('Please enter a valid 10-digit mobile number.', v);
  if (email && !isEmail(email)) return fail('Please enter a valid email address, or leave it blank.', v);
  if (hostel_name.length < 2) return fail('Please enter your hostel name.', v);
  if (!hostel_type) return fail('Please choose the hostel type.', v);
  if (area.length < 2) return fail('Please enter the area / locality.', v);
  if (v.beds && !beds) return fail('Number of beds should be a number.', v);
  if (!branches) return fail('Number of branches should be between 1 and 100.', v);
  if (formData.get('consent') !== 'on') return fail('Please confirm you agree to follow the association rules.', v);
  if (!hasDb()) return fail('Applications are not open yet. Please contact the association office.', v);

  try {
    const sql = db();
    const dup = await sql`SELECT id FROM members WHERE phone = ${phone} AND lower(hostel_name) = lower(${hostel_name})
                          AND status IN ('pending','approved') LIMIT 1`;
    if (dup.length) {
      return { ok: true, duplicate: true };
    }
    await sql`INSERT INTO members (owner_name, phone, email, hostel_name, hostel_type, area, address, beds, branches, tier)
              VALUES (${owner_name}, ${phone}, ${email || null}, ${hostel_name}, ${hostel_type}, ${area}, ${address || null}, ${beds}, ${branches}, ${tier})`;
  } catch (e) {
    console.error('[apply]', e);
    return fail('Something went wrong saving your application. Please try again in a minute.', v);
  }
  await notifyOffice(`New ITCHA membership application: ${hostel_name}`, [
    ['Name', owner_name], ['Phone', phone], ['Email', email || '-'], ['Hostel', hostel_name], ['Area', area], ['Beds', beds ?? '-'], ['Tier', tier],
  ]);
  return { ok: true };
}

export async function sendEnquiry(_prev, formData) {
  const v = Object.fromEntries(['name', 'phone', 'email', 'message'].map((k) => [k, formData.get(k) ?? '']));
  if (formData.get('website')) return { ok: true };
  const name = clean(v.name, 120);
  const phone = tenDigitPhone(v.phone);
  const email = clean(v.email, 160).toLowerCase();
  const message = cleanMultiline(v.message, 3000);
  if (name.length < 2) return fail('Please enter your name.', v);
  if (!phone) return fail('Please enter a valid 10-digit mobile number.', v);
  if (email && !isEmail(email)) return fail('Please enter a valid email address, or leave it blank.', v);
  if (message.length < 5) return fail('Please write a short message.', v);
  if (!hasDb()) return fail('Messages cannot be received right now. Please call the association office.', v);
  try {
    await db()`INSERT INTO enquiries (name, phone, email, message) VALUES (${name}, ${phone}, ${email || null}, ${message})`;
  } catch (e) {
    console.error('[enquiry]', e);
    return fail('Something went wrong. Please try again in a minute.', v);
  }
  await notifyOffice(`New message on itcha.org from ${name}`, [['Name', name], ['Phone', phone], ['Email', email || '-'], ['Message', message]]);
  return { ok: true };
}
