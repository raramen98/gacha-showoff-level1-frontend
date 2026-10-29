import Link from 'next/link';
import SeriesForm from '@/components/SeriesForm';
import { apiGet } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/format';
import { ipStyle, ipTheme } from '@/lib/ip';
import type { Series } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function SeriesListPage() {
  const series = await apiGet<Series[]>('/series');
  const groups = new Map<string, Series[]>();
  for (const s of series) groups.set(s.ip_name, [...(groups.get(s.ip_name) ?? []), s]);

  return (
    <>
      <h1 className="page-title">📚 가챠 시리즈</h1>
      <p className="page-desc">작품별 가챠 시리즈를 모아 봤어요. 시리즈를 누르면 그 시리즈로 올라온 자랑만 볼 수 있어요.</p>

      <details className="panel" id="new-series">
        <summary>+ 새 시리즈 등록하기</summary>
        <p className="muted">자랑하고 싶은 시리즈가 목록에 없으면 먼저 등록해 주세요.</p>
        <SeriesForm />
      </details>

      {[...groups.entries()].map(([ipName, list]) => (
        <section key={ipName} className="ip-section" style={ipStyle(ipName)}>
          <h2 className="ip-heading">
            <span aria-hidden>{ipTheme(ipName).emoji}</span> {ipName}
          </h2>
          <div className="grid">
            {list.map((s) => (
              <Link key={s.id} href={`/series/${s.id}`} className="card series-card">
                <h3>{s.name}</h3>
                <p className="series-card-meta">
                  {formatPrice(s.price)} · {formatDate(s.release_date)} 출시
                </p>
                <p className="series-card-stats">
                  <span>자랑 {s.post_count ?? 0}개</span>
                  <span className="text-secret">★ 시크릿 {s.secret_count ?? 0}개</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {series.length === 0 && <p className="empty">아직 등록된 시리즈가 없어요.</p>}
    </>
  );
}
