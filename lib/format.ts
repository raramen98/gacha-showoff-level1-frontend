import type { Rarity } from './types';

export const RARITY_LABEL: Record<Rarity, string> = {
  common: '일반',
  rare: '레어',
  secret: '시크릿',
};

/** "2026-10-20" 같은 날짜, 또는 등록 시각(한국 시간 기준 날짜로 바꿈)을 "2026. 10. 20."으로 */
export function formatDate(value: string) {
  if (value.length === 10) {
    const [y, m, d] = value.split('-');
    return `${y}. ${Number(m)}. ${Number(d)}.`;
  }
  return new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'medium' }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatPrice(value: number) {
  return `${value.toLocaleString('ko-KR')}원`;
}
