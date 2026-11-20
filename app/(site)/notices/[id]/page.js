import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicNotice } from '@/lib/public-data';
import { CATEGORY_LABEL, fmtDate } from '@/lib/format';

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const n = await publicNotice(Number((await params).id) || 0);
  return { title: n?.title ?? 'Notice' };
}

export default async function NoticePage({ params }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const n = await publicNotice(id);
  if (!n) notFound();
  return (
    <section className="section">
      <div className="wrap narrow">
        <Link href="/notices">&larr; All notices</Link>
        <p className="mt"><span className={`tag tag-${n.category}`}>{CATEGORY_LABEL[n.category]}</span> <span className="muted">{fmtDate(n.created_at)}</span></p>
        <h1>{n.title}</h1>
        <div className="pre prose">{n.body}</div>
      </div>
    </section>
  );
}
