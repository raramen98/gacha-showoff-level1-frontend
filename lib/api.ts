import { notFound } from 'next/navigation';
import type { FieldErrors } from './types';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: FieldErrors = {},
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      cache: 'no-store',
      ...init,
      headers: typeof init?.body === 'string' ? { 'Content-Type': 'application/json', ...init?.headers } : init?.headers,
    });
  } catch {
    throw new ApiError(0, '백엔드 서버에 연결할 수 없어요. 백엔드가 켜져 있는지 확인해 주세요.');
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, body.message ?? '문제가 생겼어요. 잠시 후 다시 해 주세요.', body.errors);
  }
  return body as T;
}

export const apiGet = <T>(path: string) => request<T>(path);

export const apiPost = <T>(path: string, data: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(data) });

/** 사진처럼 파일이 들어가는 등록 — Content-Type은 브라우저가 알아서 정한다 */
export const apiPostForm = <T>(path: string, data: FormData) => request<T>(path, { method: 'POST', body: data });

/** 백엔드가 준 사진 주소(/posts/1/image)를 브라우저에서 열 수 있는 전체 주소로 */
export const imageSrc = (imageUrl: string) => `${API_URL}${imageUrl}`;

/** 서버 컴포넌트용: 404면 Next.js의 "찾을 수 없음" 화면을 보여 준다 */
export async function apiGetOrNotFound<T>(path: string): Promise<T> {
  try {
    return await apiGet<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}
