import { AREAS } from '@/lib/areas';
export default function ChannelPicker({ email, whatsapp }) {
  return (
    <fieldset className="channels span-2">
      <legend>Also send to active members via</legend>
      <label className="check"><input type="checkbox" name="channels" value="email" disabled={!email} /> Email {!email && <small className="muted">(not configured)</small>}</label>
      <label className="check"><input type="checkbox" name="channels" value="whatsapp" disabled={!whatsapp} /> WhatsApp {!whatsapp && <small className="muted">(not configured)</small>}</label>
      <label>Send to members in
        <select name="area" defaultValue="">
          <option value="">All areas</option>
          {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>
    </fieldset>
  );
}
