import Icon from './Icon';

// Pastel feature tiles: [{ icon, tone: teal|sky|gold|mint, title, text }]
export function Tiles({ items, cols = 4 }) {
  return (
    <div className={cols === 2 ? 'tiles tiles-2' : 'tiles'}>
      {items.map((f) => (
        <div key={f.title} className={`tile tone-${f.tone ?? 'teal'}`}>
          <span className="tile-icon"><Icon name={f.icon} size={24} /></span>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Steps({ steps }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={s.text}>
          <span className="step-icon"><Icon name={s.icon} size={22} /></span>
          <div><small>Step {i + 1}</small>{s.text}</div>
        </li>
      ))}
    </ol>
  );
}

export function Checks({ items }) {
  return (
    <ul className="checks">
      {items.map((b) => (
        <li key={b}><span className="check-dot"><Icon name="Check" size={14} /></span>{b}</li>
      ))}
    </ul>
  );
}
