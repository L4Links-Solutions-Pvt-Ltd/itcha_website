const TZ = 'Asia/Kolkata';
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ }) : '';
export const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: TZ })
    : '';
export const fmtDay = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', timeZone: TZ });
export const fmtMonth = (d) => new Date(d).toLocaleDateString('en-IN', { month: 'short', timeZone: TZ });
export const CATEGORY_LABEL = { circular: 'Circular', meeting: 'Meeting notice', update: 'Update' };
