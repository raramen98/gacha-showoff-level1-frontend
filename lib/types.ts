export type Rarity = 'common' | 'rare' | 'secret';

export interface Series {
  id: number;
  ip_name: string;
  name: string;
  price: number;
  release_date: string;
  created_at: string;
  post_count?: number;
  secret_count?: number;
}

export interface Post {
  id: number;
  series_id: number | null; // 시리즈는 고르지 않아도 된다
  nickname: string;
  character_name: string;
  rarity: Rarity;
  comment: string;
  created_at: string; // 업로드 날짜 = 등록 시각 (자동)
  image_url: string | null; // 가상 데이터는 사진이 없어서 null
  ip_name: string | null;
  series_name: string | null;
  series_price: number | null;
}

export interface SeriesDetail extends Series {
  rarity_counts: Record<Rarity, number>;
  posts: Post[];
}

export type FieldErrors = Record<string, string>;
