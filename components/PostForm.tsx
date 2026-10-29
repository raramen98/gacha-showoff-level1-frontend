'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { ApiError, apiPostForm } from '@/lib/api';
import { RARITY_LABEL } from '@/lib/format';
import { ipTheme } from '@/lib/ip';
import type { FieldErrors, Post, Rarity, Series } from '@/lib/types';
import { charLength, IMAGE_TYPES, PostFormValues, validatePost } from '@/lib/validation';
import FieldError from './FieldError';

const FIELD_ORDER: (keyof PostFormValues)[] = ['image', 'series_id', 'nickname', 'character_name', 'rarity', 'comment'];
const RARITY_HINT: Record<Rarity, string> = {
  common: '자주 나오는 기본 캐릭터',
  rare: '조금 귀한 캐릭터',
  secret: '거의 안 나오는 숨은 캐릭터',
};

export default function PostForm({ series, initialSeriesId }: { series: Series[]; initialSeriesId?: string }) {
  const router = useRouter();
  const [values, setValues] = useState<PostFormValues>({
    image: null,
    series_id: series.some((s) => String(s.id) === initialSeriesId) ? initialSeriesId! : '',
    nickname: '',
    character_name: '',
    rarity: '',
    comment: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const seriesByIp = useMemo(() => {
    const groups = new Map<string, Series[]>();
    for (const s of series) groups.set(s.ip_name, [...(groups.get(s.ip_name) ?? []), s]);
    return [...groups.entries()];
  }, [series]);

  // 고른 사진 미리 보기 (사진을 바꾸거나 화면을 떠나면 임시 주소를 정리)
  useEffect(() => {
    if (!values.image) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(values.image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [values.image]);

  function update<K extends keyof PostFormValues>(field: K, value: PostFormValues[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // 한 번 등록을 눌러 본 뒤에는 고칠 때마다 바로 다시 확인해 준다
    if (triedSubmit) setErrors(validatePost(next));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTriedSubmit(true);
    setServerMessage('');

    const found = validatePost(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('image', values.image!);
      data.append('series_id', values.series_id);
      data.append('nickname', values.nickname);
      data.append('character_name', values.character_name);
      data.append('rarity', values.rarity);
      data.append('comment', values.comment);
      const created = await apiPostForm<Post>('/posts', data);
      router.push(`/posts/${created.id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.errors ?? {});
        setServerMessage(error.message);
      } else {
        setServerMessage('등록하지 못했어요. 잠시 후 다시 해 주세요.');
      }
      setSubmitting(false);
    }
  }

  const describedBy = (field: string) => (errors[field] ? `error-${field}` : undefined);

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    // 같은 파일을 다시 골라도 바뀐 것으로 알 수 있게 비워 둔다
    update('image', event.target.files?.[0] ?? null);
    event.target.value = '';
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {serverMessage && (
        <div className="form-alert" role="alert">
          😢 {serverMessage}
        </div>
      )}

      <div className="field">
        <label htmlFor="field-image">
          사진 <span className="required">*</span>
        </label>
        <label className={`image-picker${previewUrl ? ' has-image' : ''}${errors.image ? ' is-invalid' : ''}`}>
          <input
            id="field-image"
            type="file"
            accept={IMAGE_TYPES.join(',')}
            onChange={handleImage}
            aria-invalid={!!errors.image}
            aria-describedby={describedBy('image')}
          />
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="올릴 사진 미리 보기" />
          ) : (
            <span className="image-picker-empty">
              <span aria-hidden>📸</span>
              <strong>뽑은 캐릭터 사진을 골라 주세요</strong>
              <small>JPG, PNG, WEBP, GIF · 5MB 이하</small>
            </span>
          )}
        </label>
        {values.image && (
          <p className="field-hint">
            {values.image.name} ·{' '}
            <button type="button" className="link-button" onClick={() => update('image', null)}>
              사진 빼기
            </button>
          </p>
        )}
        <FieldError id="error-image" message={errors.image} />
      </div>

      <div className="field">
        <label htmlFor="field-series_id">
          시리즈 <span className="optional">(선택)</span>
        </label>
        <select
          id="field-series_id"
          value={values.series_id}
          onChange={(e) => update('series_id', e.target.value)}
          aria-invalid={!!errors.series_id}
          aria-describedby={describedBy('series_id')}
        >
          <option value="">고르지 않음</option>
          {seriesByIp.map(([ipName, list]) => (
            <optgroup key={ipName} label={`${ipTheme(ipName).emoji} ${ipName}`}>
              {list.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <p className="field-hint">
          목록에 없으면 비워 두거나, <a href="/series#new-series">시리즈를 먼저 등록</a>해 주세요. 업로드 날짜는 자동으로 들어가요.
        </p>
        <FieldError id="error-series_id" message={errors.series_id} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="field-nickname">
            닉네임 <span className="required">*</span>
          </label>
          <input
            id="field-nickname"
            value={values.nickname}
            onChange={(e) => update('nickname', e.target.value)}
            placeholder="예: 피카덕후"
            autoComplete="nickname"
            aria-invalid={!!errors.nickname}
            aria-describedby={describedBy('nickname')}
          />
          <p className="field-hint">2~12자</p>
          <FieldError id="error-nickname" message={errors.nickname} />
        </div>

        <div className="field">
          <label htmlFor="field-character_name">
            뽑은 캐릭터 <span className="required">*</span>
          </label>
          <input
            id="field-character_name"
            value={values.character_name}
            onChange={(e) => update('character_name', e.target.value)}
            placeholder="예: 피카츄"
            aria-invalid={!!errors.character_name}
            aria-describedby={describedBy('character_name')}
          />
          <FieldError id="error-character_name" message={errors.character_name} />
        </div>
      </div>

      <fieldset className="field" aria-describedby={describedBy('rarity')}>
        <legend>
          레어도 <span className="required">*</span>
        </legend>
        <div className="rarity-options">
          {(Object.keys(RARITY_LABEL) as Rarity[]).map((rarity, index) => (
            <label key={rarity} className={`rarity-option rarity-option-${rarity}`}>
              <input
                id={index === 0 ? 'field-rarity' : undefined}
                type="radio"
                name="rarity"
                value={rarity}
                checked={values.rarity === rarity}
                onChange={(e) => update('rarity', e.target.value)}
              />
              <span className="rarity-option-box">
                <strong>{RARITY_LABEL[rarity]}</strong>
                <small>{RARITY_HINT[rarity]}</small>
              </span>
            </label>
          ))}
        </div>
        <FieldError id="error-rarity" message={errors.rarity} />
      </fieldset>

      <div className="field">
        <label htmlFor="field-comment">한마디</label>
        <textarea
          id="field-comment"
          rows={3}
          value={values.comment}
          onChange={(e) => update('comment', e.target.value)}
          placeholder="예: 3번 만에 시크릿!"
          aria-invalid={!!errors.comment}
          aria-describedby={describedBy('comment')}
        />
        <p className={`field-hint counter${charLength(values.comment.trim()) > 100 ? ' over' : ''}`}>
          {charLength(values.comment.trim())} / 100자
        </p>
        <FieldError id="error-comment" message={errors.comment} />
      </div>

      <button type="submit" className="button button-primary button-block" disabled={submitting}>
        {submitting ? '올리는 중…' : '🎉 자랑 올리기'}
      </button>
    </form>
  );
}
