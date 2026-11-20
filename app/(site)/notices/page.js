import { publicNotices } from '@/lib/public-data';
import NoticeList from '@/components/NoticeList';

export const metadata = { title: 'Notices' };
export const revalidate = 300;

export default async function Notices() {
  const notices = await publicNotices();
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Notices</p>
          <h1>Circulars, meeting notices and important updates</h1>
        </div>
      </section>
      <section className="section">
        <div className="wrap narrow">
          <NoticeList notices={notices} empty="No notices have been published yet." />
        </div>
      </section>
    </>
  );
}
