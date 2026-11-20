import 'server-only';
import { esc } from './validate';
import { site } from './site';

export const channels = {
  email: () => Boolean(process.env.ZEPTO_API_KEY && process.env.EMAIL_FROM_ADDRESS),
  whatsapp: () => Boolean(process.env.INTERAKT_API_KEY && process.env.INTERAKT_NOTICE_TEMPLATE),
};

async function withTimeout(fn, ms = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fn(ctrl.signal);
  } finally {
    clearTimeout(t);
  }
}

export async function sendEmail({ to, subject, html }) {
  if (!channels.email()) return { ok: false, error: 'email not configured' };
  try {
    const r = await withTimeout((signal) =>
      fetch('https://api.zeptomail.in/v1.1/email', {
        method: 'POST',
        headers: {
          Authorization: process.env.ZEPTO_API_KEY.startsWith('Zoho-enczapikey')
            ? process.env.ZEPTO_API_KEY
            : `Zoho-enczapikey ${process.env.ZEPTO_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          from: { address: process.env.EMAIL_FROM_ADDRESS, name: process.env.EMAIL_FROM_NAME || site.shortName },
          to: (Array.isArray(to) ? to : [to]).map((address) => ({ email_address: { address } })),
          subject,
          htmlbody: html,
        }),
        signal,
      }),
    );
    if (!r.ok) return { ok: false, error: `zeptomail ${r.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export async function sendWhatsAppNotice({ phone, name, title }) {
  if (!channels.whatsapp()) return { ok: false, error: 'whatsapp not configured' };
  try {
    const r = await withTimeout((signal) =>
      fetch('https://api.interakt.ai/v1/public/message/', {
        method: 'POST',
        headers: { Authorization: `Basic ${process.env.INTERAKT_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: '+91',
          phoneNumber: phone,
          callbackData: 'itcha-notice',
          type: 'Template',
          template: {
            name: process.env.INTERAKT_NOTICE_TEMPLATE,
            languageCode: process.env.INTERAKT_TEMPLATE_LANG || 'en',
            bodyValues: [name, title],
          },
        }),
        signal,
      }),
    );
    const body = await r.json().catch(() => ({}));
    if (!r.ok || body.result === false) return { ok: false, error: body.message || `interakt ${r.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export function noticeEmailHtml({ name, title, body, url }) {
  const paras = esc(body).split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  return `<div style="font-family:Arial,sans-serif;max-width:600px;color:#1b2a3a">
    <p>Dear ${esc(name)},</p>
    <h2 style="color:#12355b">${esc(title)}</h2>
    ${paras}
    ${url ? `<p><a href="${esc(url)}">View on the ITCHA website</a></p>` : ''}
    <p style="color:#667;font-size:13px">${esc(site.name)}, ${esc(site.state)}</p>
  </div>`;
}

// Fire-and-forget heads-up to the office about a new application/enquiry. Never throws.
export async function notifyOffice(subject, rows) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!to || !channels.email()) return;
  const html = `<table style="font-family:Arial,sans-serif;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#667">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join('')}</table><p><a href="${esc(site.url)}/admin">Open the dashboard</a></p>`;
  await sendEmail({ to: to.split(',').map((s) => s.trim()).filter(Boolean), subject, html }).catch(() => {});
}
