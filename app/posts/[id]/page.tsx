import Link from 'next/link';
import RarityBadge from '@/components/RarityBadge';
import { apiGetOrNotFound, imageSrc } from '@/lib/api';
import { formatDate, formatDateTime, formatPrice } from '@/lib/format';
import { ipStyle, ipTheme } from '@/lib/ip';
import type { Post } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await apiGetOrNotFound<Post>(`/posts/${encodeURIComponent(id)}`);
  const theme = ipTheme(post.ip_name);

  return (
    <article className="detail" style={ipStyle(post.ip_name)}>
      <Link href="/" className="back-link">
        ← 자랑 목록으로
      </Link>

      <div className={`detail-hero${post.rarity === 'secret' ? ' is-secret' : ''}`}>
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="detail-image" src={imageSrc(post.image_url)} alt={`${post.character_name} 사진`} />
        ) : (
          <span className="detail-emoji" aria-hidden>
            {theme.emoji}
          </span>
        )}
        <RarityBadge rarity={post.rarity} large />
        <h1>{post.character_name}</h1>
        <p className="detail-sub">
          <strong>@{post.nickname}</strong> 님이 {formatDate(post.created_at)}에 올렸어요
        </p>
        {post.comment && <blockquote className="detail-comment">“{post.comment}”</blockquote>}
      </div>

      <dl className="info-list">
        <div>
          <dt>작품</dt>
          <dd>{post.ip_name ? `${theme.emoji} ${post.ip_name}` : <span className="muted">(시리즈 선택 안 함)</span>}</dd>
        </div>
        <div>
          <dt>시리즈</dt>
          <dd>
            {post.series_id ? (
              <Link href={`/series/${post.series_id}`}>{post.series_name} →</Link>
            ) : (
              <span className="muted">(선택 안 함)</span>
            )}
          </dd>
        </div>
        {post.series_price !== null && (
          <div>
            <dt>1회 가격</dt>
            <dd>{formatPrice(post.series_price)}</dd>
          </div>
        )}
        <div>
          <dt>캐릭터</dt>
          <dd>{post.character_name}</dd>
        </div>
        <div>
          <dt>레어도</dt>
          <dd>
            <RarityBadge rarity={post.rarity} />
          </dd>
        </div>
        <div>
          <dt>한마디</dt>
          <dd>{post.comment || <span className="muted">(남긴 말 없음)</span>}</dd>
        </div>
        <div>
          <dt>닉네임</dt>
          <dd>{post.nickname}</dd>
        </div>
        <div>
          <dt>업로드 날짜</dt>
          <dd>{formatDateTime(post.created_at)}</dd>
        </div>
      </dl>

      <div className="actions">
        {post.series_id ? (
          <>
            <Link href={`/series/${post.series_id}`} className="button">
              이 시리즈의 다른 자랑 보기
            </Link>
            <Link href={`/posts/new?series_id=${post.series_id}`} className="button button-primary">
              나도 이 시리즈 자랑하기
            </Link>
          </>
        ) : (
          <Link href="/posts/new" className="button button-primary">
            나도 자랑하기
          </Link>
        )}
      </div>
    </article>
  );
}
