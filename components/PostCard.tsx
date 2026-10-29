import Link from 'next/link';
import { imageSrc } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { ipStyle, ipTheme } from '@/lib/ip';
import type { Post } from '@/lib/types';
import RarityBadge from './RarityBadge';

export default function PostCard({ post, showSeries = true }: { post: Post; showSeries?: boolean }) {
  const theme = ipTheme(post.ip_name);
  return (
    <Link href={`/posts/${post.id}`} className={`card post-card${post.rarity === 'secret' ? ' is-secret' : ''}`} style={ipStyle(post.ip_name)}>
      <div className={`post-card-top${post.image_url ? ' has-image' : ''}`}>
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc(post.image_url)} alt={`${post.character_name} 사진`} loading="lazy" />
        ) : (
          <span className="post-card-emoji" aria-hidden>
            {theme.emoji}
          </span>
        )}
        <RarityBadge rarity={post.rarity} />
      </div>
      <div className="post-card-body">
        <h3 className="post-card-character">{post.character_name}</h3>
        {showSeries && (
          <p className="post-card-series">
            {post.series_name ? (
              <>
                <span className="ip-label">{post.ip_name}</span> · {post.series_name}
              </>
            ) : (
              '시리즈 선택 안 함'
            )}
          </p>
        )}
        {post.comment && <p className="post-card-comment">“{post.comment}”</p>}
        <p className="post-card-meta">
          <span>@{post.nickname}</span>
          <span>{formatDate(post.created_at)} 업로드</span>
        </p>
      </div>
    </Link>
  );
}
