export default function ChannelPicker({ email, whatsapp }) {
  return (
    <fieldset className="channels span-2">
      <legend>Also send to active members via</legend>
      <label className="check"><input type="checkbox" name="channels" value="email" disabled={!email} /> Email {!email && <small className="muted">(not configured)</small>}</label>
      <label className="check"><input type="checkbox" name="channels" value="whatsapp" disabled={!whatsapp} /> WhatsApp {!whatsapp && <small className="muted">(not configured)</small>}</label>
      <label>Only members in area (optional)<input name="area" placeholder="e.g. Madhapur. Leave blank for all" maxLength={120} /></label>
    </fieldset>
  );
}
