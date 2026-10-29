'use client';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="message-page">
      <p className="message-emoji">🔌</p>
      <h1>데이터를 불러오지 못했어요</h1>
      <p className="muted">
        백엔드 서버가 잠에서 깨어나는 중일 수 있어요. 무료 서버라 첫 접속에 1분 가까이 걸릴 수 있으니, 잠시 후 다시 시도해 주세요.
      </p>
      <button type="button" className="button button-primary" onClick={() => reset()}>
        다시 시도
      </button>
    </div>
  );
}
