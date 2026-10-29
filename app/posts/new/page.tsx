import PostForm from '@/components/PostForm';
import { apiGet } from '@/lib/api';
import type { Series } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ series_id?: string }> }) {
  const { series_id } = await searchParams;
  const series = await apiGet<Series[]>('/series');

  return (
    <div className="narrow">
      <h1 className="page-title">🎉 자랑 올리기</h1>
      <p className="page-desc">뽑은 캐릭터를 적어 주세요. <span className="required">*</span> 표시는 꼭 적어야 해요.</p>
      <PostForm series={series} initialSeriesId={series_id} />
    </div>
  );
}
