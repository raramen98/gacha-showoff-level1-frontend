// 기획서 7. 규칙 — 백엔드(backend/src/common/validation.ts, posts.service.ts)와 같은 규칙·같은 문장을 쓴다
import type { FieldErrors } from './types';

export const charLength = (value: string) => [...value].length;


export function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export interface PostFormValues {
  image: File | null;
  series_id: string; // 고르지 않아도 됨
  nickname: string;
  character_name: string;
  rarity: string;
  comment: string;
}

export function validatePost(values: PostFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const nickname = values.nickname.trim();
  const characterName = values.character_name.trim();

  if (!values.image || values.image.size === 0) errors.image = '사진을 올려 주세요';
  else if (values.image.size > MAX_IMAGE_BYTES) errors.image = '사진은 5MB 이하로 올려 주세요';
  else if (!IMAGE_TYPES.includes(values.image.type)) errors.image = '사진은 JPG, PNG, WEBP, GIF 파일만 올릴 수 있어요';

  if (!nickname) errors.nickname = '닉네임을 적어 주세요';
  else if (charLength(nickname) < 2 || charLength(nickname) > 12) errors.nickname = '닉네임은 2~12자로 적어 주세요';

  if (!characterName) errors.character_name = '캐릭터 이름을 적어 주세요';
  else if (charLength(characterName) > 50) errors.character_name = '캐릭터 이름은 50자 이내로 적어 주세요';

  if (!values.rarity) errors.rarity = '레어도를 골라 주세요';
  else if (!['common', 'rare', 'secret'].includes(values.rarity))
    errors.rarity = '레어도는 일반, 레어, 시크릿 중에서 하나만 골라 주세요';

  if (charLength(values.comment.trim()) > 100) errors.comment = '한마디는 100자 이내로 적어 주세요';

  return errors;
}

export interface SeriesFormValues {
  ip_name: string;
  name: string;
  price: string;
  release_date: string;
}

export function validateSeries(values: SeriesFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const ipName = values.ip_name.trim();
  const name = values.name.trim();
  const price = values.price.trim();
  const releaseDate = values.release_date.trim();

  if (!ipName) errors.ip_name = '작품 이름을 적어 주세요';
  else if (charLength(ipName) > 30) errors.ip_name = '작품 이름은 30자 이내로 적어 주세요';

  if (!name) errors.name = '시리즈 이름을 적어 주세요';
  else if (charLength(name) > 60) errors.name = '시리즈 이름은 60자 이내로 적어 주세요';

  if (!price) errors.price = '1회 가격을 적어 주세요';
  else if (!/^\d+$/.test(price) || Number(price) > 1_000_000)
    errors.price = '1회 가격은 0~1,000,000 사이의 숫자로 적어 주세요 (예: 5000)';

  if (!releaseDate) errors.release_date = '출시일을 적어 주세요';
  else if (!isRealDate(releaseDate)) errors.release_date = '출시일을 올바르게 적어 주세요 (예: 2026-09-01)';

  return errors;
}
