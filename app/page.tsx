import Link from 'next/link';
import PostGrid from '@/components/PostGrid';
import { apiGet } from '@/lib/api';
import { RARITY_LABEL } from '@/lib/format';
import { ipStyle, ipTheme } from '@/lib/ip';
import type { Post, Rarity } from '@/lib/types';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ ip?: string; rarity?: string }>;

function filterHref(ip?: string, rarity?: string) {
  const params = new URLSearchParams();
  if (ip) params.set('ip', ip);
  if (rarity) params.set('rarity', rarity);
  const query = params.toString();
  return query ? `/?${query}` : '/';
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { ip, rarity } = await searchParams;
  const posts = await apiGet<Post[]>('/posts');
  const ips = [...new Set(posts.flatMap((post) => (post.ip_name ? [post.ip_name] : [])))];
  const filtered = posts.filter((post) => (!ip || post.ip_name === ip) && (!rarity || post.rarity === rarity));
  const secretCount = posts.filter((post) => post.rarity === 'secret').length;

  return (
    <>
      <section className="hero">
        <div>
          <h1>오늘은 뭘 뽑았나요? 🎉</h1>
          <p>가챠에서 뽑은 캐릭터를 자랑하고, 뽑기 전에 다른 사람들은 뭘 뽑았는지 구경해 보세요.</p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>{posts.length}</strong>
            <span>자랑 글</span>
          </div>
          <div>
            <strong className="text-secret">{secretCount}</strong>
            <span>시크릿</span>
          </div>
          <div>
            <strong>{ips.length}</strong>
            <span>작품</span>
          </div>
        </div>
      </section>

      <div className="filters" aria-label="작품으로 골라 보기">
        <Link href={filterHref(undefined, rarity)} className={`chip${!ip ? ' active' : ''}`}>
          전체
        </Link>
        {ips.map((name) => (
          <Link key={name} href={filterHref(name, rarity)} className={`chip chip-ip${ip === name ? ' active' : ''}`} style={ipStyle(name)}>
            {ipTheme(name).emoji} {name}
          </Link>
        ))}
      </div>
      <div className="filters" aria-label="레어도로 골라 보기">
        <Link href={filterHref(ip, undefined)} className={`chip chip-small${!rarity ? ' active' : ''}`}>
          모든 레어도
        </Link>
        {(Object.keys(RARITY_LABEL) as Rarity[]).map((r) => (
          <Link key={r} href={filterHref(ip, r)} className={`chip chip-small chip-${r}${rarity === r ? ' active' : ''}`}>
            {RARITY_LABEL[r]}
          </Link>
        ))}
      </div>

      <PostGrid posts={filtered} emptyText="조건에 맞는 자랑 글이 아직 없어요. 첫 번째로 자랑해 보세요!" />
    </>
  );
}
