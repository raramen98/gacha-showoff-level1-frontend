/** 작품(IP)마다 정해진 색과 이모지 — 캐릭터 이미지 대신 카드를 꾸민다 */
export interface IpTheme {
  emoji: string;
  color: string; // 진한 색 (글자·테두리)
  soft: string; // 연한 배경색
}

export const IP_THEMES: Record<string, IpTheme> = {
  산리오: { emoji: '🎀', color: '#e8578f', soft: '#ffe4ef' },
  포켓몬: { emoji: '⚡', color: '#c99400', soft: '#fff4c2' },
  주술회전: { emoji: '🌀', color: '#6d4fe0', soft: '#ece6ff' },
  나루토: { emoji: '🍥', color: '#e2700b', soft: '#ffe8d2' },
  '진격의 거인': { emoji: '🗡️', color: '#7b6248', soft: '#efe7dd' },
  디즈니: { emoji: '🏰', color: '#2f6fdb', soft: '#e1ecff' },
};

const DEFAULT_THEME: IpTheme = { emoji: '🎁', color: '#5d6478', soft: '#eceef4' };

export const KNOWN_IPS = Object.keys(IP_THEMES);

export function ipTheme(ipName?: string | null): IpTheme {
  return (ipName && IP_THEMES[ipName]) || DEFAULT_THEME;
}

/** style 속성에 넣을 CSS 변수 */
export function ipStyle(ipName?: string | null): React.CSSProperties {
  const theme = ipTheme(ipName);
  return { '--ip': theme.color, '--ip-soft': theme.soft } as React.CSSProperties;
}
