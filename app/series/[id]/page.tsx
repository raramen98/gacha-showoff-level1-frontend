import Link from 'next/link';
import PostGrid from '@/components/PostGrid';
import { apiGetOrNotFound } from '@/lib/api';
import { formatDate, formatPrice, RARITY_LABEL } from '@/lib/format';
import { ipStyle, ipTheme } from '@/lib/ip';
import type { Rarity, SeriesDetail } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const series = await apiGetOrNotFound<SeriesDetail>(`/series/${encodeURIComponent(id)}`);
  const theme = ipTheme(series.ip_name);
  const total = series.posts.length;
  const characters = [...new Set(series.posts.map((post) => post.character_name))];

  return (
    <div style={ipStyle(series.ip_name)}>
      <Link href="/series" className="back-link">
        ← 시리즈 목록으로
      </Link>

      <section className="series-hero">
        <span className="detail-emoji" aria-hidden>
          {theme.emoji}
        </span>
        <div>
          <p className="ip-label">{series.ip_name}</p>
          <h1>{series.name}</h1>
          <p className="detail-sub">
            1회 {formatPrice(series.price)} · {formatDate(series.release_date)} 출시
          </p>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">이 시리즈에서 나온 것들</h2>
        {total > 0 ? (
          <>
            <div className="rarity-bar" aria-hidden>
              {(Object.keys(RARITY_LABEL) as Rarity[]).map((rarity) =>
                series.rarity_counts[rarity] > 0 ? (
                  <span key={rarity} className={`rarity-bar-${rarity}`} style={{ flexGrow: series.rarity_counts[rarity] }} />
                ) : null,
              )}
            </div>
            <ul className="rarity-legend">
              {(Object.keys(RARITY_LABEL) as Rarity[]).map((rarity) => (
                <li key={rarity}>
                  <span className={`dot dot-${rarity}`} /> {RARITY_LABEL[rarity]} {series.rarity_counts[rarity]}개 (
                  {Math.round((series.rarity_counts[rarity] / total) * 100)}%)
                </li>
              ))}
            </ul>
            <p className="muted">지금까지 자랑된 캐릭터: {characters.join(', ')}</p>
          </>
        ) : (
          <p className="muted">아직 이 시리즈로 올라온 자랑이 없어요.</p>
        )}
      </section>

      <div className="section-head">
        <h2>자랑 글 {total}개</h2>
        <Link href={`/posts/new?series_id=${series.id}`} className="button button-primary button-small">
          + 이 시리즈 자랑하기
        </Link>
      </div>
      <PostGrid posts={series.posts} showSeries={false} emptyText="첫 번째 자랑의 주인공이 되어 보세요!" />
    </div>
  );
}
