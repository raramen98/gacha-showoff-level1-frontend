'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ApiError, apiPost } from '@/lib/api';
import { KNOWN_IPS } from '@/lib/ip';
import type { FieldErrors, Series } from '@/lib/types';
import { SeriesFormValues, validateSeries } from '@/lib/validation';
import FieldError from './FieldError';

const EMPTY: SeriesFormValues = { ip_name: '', name: '', price: '', release_date: '' };
const FIELD_ORDER: (keyof SeriesFormValues)[] = ['ip_name', 'name', 'price', 'release_date'];

export default function SeriesForm() {
  const router = useRouter();
  const [values, setValues] = useState<SeriesFormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [created, setCreated] = useState<Series | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof SeriesFormValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (triedSubmit) setErrors(validateSeries(next));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTriedSubmit(true);
    setServerMessage('');
    setCreated(null);

    const found = validateSeries(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(`series-${firstInvalid}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const series = await apiPost<Series>('/series', { ...values, price: Number(values.price) });
      setCreated(series);
      setValues(EMPTY);
      setTriedSubmit(false);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.errors ?? {});
        setServerMessage(error.message);
      } else {
        setServerMessage('등록하지 못했어요. 잠시 후 다시 해 주세요.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form form-compact" onSubmit={handleSubmit} noValidate>
      {serverMessage && (
        <div className="form-alert" role="alert">
          😢 {serverMessage}
        </div>
      )}
      {created && (
        <div className="form-success" role="status">
          ✅ &lsquo;{created.name}&rsquo; 시리즈를 등록했어요!{' '}
          <Link href={`/posts/new?series_id=${created.id}`}>이 시리즈로 자랑 쓰기 →</Link>
        </div>
      )}
      <div className="field-row">
        <div className="field">
          <label htmlFor="series-ip_name">
            작품 이름 <span className="required">*</span>
          </label>
          <input
            id="series-ip_name"
            list="known-ips"
            value={values.ip_name}
            onChange={(e) => update('ip_name', e.target.value)}
            placeholder="예: 포켓몬"
            aria-invalid={!!errors.ip_name}
          />
          <datalist id="known-ips">
            {KNOWN_IPS.map((ip) => (
              <option key={ip} value={ip} />
            ))}
          </datalist>
          <FieldError id="series-error-ip_name" message={errors.ip_name} />
        </div>
        <div className="field">
          <label htmlFor="series-name">
            시리즈 이름 <span className="required">*</span>
          </label>
          <input
            id="series-name"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="예: 포켓몬 미니 피규어 컬렉션 Vol.2"
            aria-invalid={!!errors.name}
          />
          <FieldError id="series-error-name" message={errors.name} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="series-price">
            1회 가격(원) <span className="required">*</span>
          </label>
          <input
            id="series-price"
            inputMode="numeric"
            value={values.price}
            onChange={(e) => update('price', e.target.value)}
            placeholder="예: 5000"
            aria-invalid={!!errors.price}
          />
          <FieldError id="series-error-price" message={errors.price} />
        </div>
        <div className="field">
          <label htmlFor="series-release_date">
            출시일 <span className="required">*</span>
          </label>
          <input
            id="series-release_date"
            type="date"
            value={values.release_date}
            onChange={(e) => update('release_date', e.target.value)}
            aria-invalid={!!errors.release_date}
          />
          <FieldError id="series-error-release_date" message={errors.release_date} />
        </div>
      </div>
      <button type="submit" className="button button-primary" disabled={submitting}>
        {submitting ? '등록하는 중…' : '시리즈 등록'}
      </button>
    </form>
  );
}
