import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="message-page">
      <p className="message-emoji">🫙</p>
      <h1>찾는 페이지가 없어요</h1>
      <p className="muted">주소가 틀렸거나 지워진 글일 수 있어요.</p>
      <Link href="/" className="button button-primary">
        자랑 목록으로 가기
      </Link>
    </div>
  );
}
