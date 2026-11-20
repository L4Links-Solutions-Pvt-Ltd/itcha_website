import Link from 'next/link';
import { CATEGORY_LABEL, fmtDate } from '@/lib/format';

export default function NoticeList({ notices, empty }) {
  if (!notices.length) return <p className="muted empty">{empty}</p>;
  return (
    <ul className="notice-list card">
      {notices.map((n) => (
        <li key={n.id}>
          <Link href={`/notices/${n.id}`}>
            <span className={`tag tag-${n.category}`}>{CATEGORY_LABEL[n.category]}</span>
            <strong>{n.title}</strong>
            <span className="muted">{fmtDate(n.created_at)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
