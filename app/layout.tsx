import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '뽑았다! · 갓챠 자랑 게시판',
  description: '가챠에서 뽑은 캐릭터를 작품·시리즈별로 자랑하고 구경하는 곳',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="logo">
              <span aria-hidden>🎰</span> 뽑았다!
            </Link>
            <nav className="nav">
              <Link href="/">자랑 목록</Link>
              <Link href="/series">시리즈</Link>
              <Link href="/posts/new" className="button button-primary button-small">
                + 자랑하기
              </Link>
            </nav>
          </div>
        </header>
        <main className="container main">{children}</main>
        <footer className="site-footer container">갓챠 자랑 게시판 · Level 1 · 캐릭터 이미지 없이 작품별 색과 이모지로 꾸몄어요</footer>
      </body>
    </html>
  );
}
