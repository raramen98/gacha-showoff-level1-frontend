import type { Post } from '@/lib/types';
import PostCard from './PostCard';

export default function PostGrid({ posts, showSeries = true, emptyText }: { posts: Post[]; showSeries?: boolean; emptyText: string }) {
  if (posts.length === 0) return <p className="empty">{emptyText}</p>;
  return (
    <div className="grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} showSeries={showSeries} />
      ))}
    </div>
  );
}
