import { HOSTEL_TYPES, site } from '@/lib/site';
import { AREAS } from '@/lib/areas';

// The DB driver parses DATE columns as local-midnight Dates, so format with local getters (not toISOString).
const d = (v) => {
  if (!v) return '';
  const x = new Date(v);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};

export default function MemberFields({ m = {} }) {
  return (
    <div className="form-grid">
      <label>Owner name *<input name="owner_name" required defaultValue={m.owner_name} maxLength={120} /></label>
      <label>Mobile *<input name="phone" required defaultValue={m.phone} maxLength={16} inputMode="tel" /></label>
      <label>Email<input name="email" type="email" defaultValue={m.email ?? ''} maxLength={160} /></label>
      <label>Hostel name *<input name="hostel_name" required defaultValue={m.hostel_name} maxLength={160} /></label>
      <label>Hostel type
        <select name="hostel_type" defaultValue={m.hostel_type ?? 'boys'}>
          {HOSTEL_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </label>
      <label>Area *
        <select name="area" required defaultValue={m.area ?? ''}>
          <option value="" disabled>Choose area</option>
          {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          {m.area && !AREAS.includes(m.area) && <option value={m.area} disabled>{m.area} (old value, pick an area)</option>}
        </select>
      </label>
      <label>Beds<input name="beds" defaultValue={m.beds ?? ''} inputMode="numeric" /></label>
      <label>Branches<input name="branches" defaultValue={m.branches ?? 1} inputMode="numeric" /></label>
      <label>Membership type
        <select name="tier" defaultValue={m.tier ?? site.membership.tiers[0].id}>
          {site.membership.tiers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </label>
      <label>Valid until (annual)<input name="valid_until" type="date" defaultValue={d(m.valid_until)} /></label>
      <label className="span-2">Address<textarea name="address" rows={2} defaultValue={m.address ?? ''} maxLength={400} /></label>
      <label className="span-2">Internal notes (committee only)<textarea name="notes" rows={3} defaultValue={m.notes ?? ''} maxLength={2000} /></label>
    </div>
  );
}
