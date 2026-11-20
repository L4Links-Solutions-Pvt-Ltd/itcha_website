import { site } from '@/lib/site';

export default function Committee() {
  return (
    <div className="committee">
      {site.committee.map((p) => (
        <div key={p.name} className="person">
          <div className="avatar">
            {p.photo ? <img src={p.photo} alt="" /> : <span>{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>}
          </div>
          <strong>{p.name}</strong>
          <span className="muted">{p.role}</span>
        </div>
      ))}
    </div>
  );
}
