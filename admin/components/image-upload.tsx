'use client';

import { useEffect, useRef, useState } from 'react';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  label?: string;
}

export function ImageUpload({ name, defaultValue, label = 'Image' }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Keep the hidden input's DOM value in sync so FormData captures it correctly
  // with React 19 server actions (which read the DOM property, not the vdom state).
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = url;
    }
  }, [url]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? 'Upload failed. Please try again.');
      } else {
        setUrl(data.url);
      }
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
          {label}
        </label>
      )}

      <input ref={hiddenInputRef} type="hidden" name={name} defaultValue={url} />

      {url && (
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            background: 'var(--card)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Product"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: uploading ? 'var(--text-muted)' : 'var(--text)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.12s, background 0.12s',
          }}
          onMouseEnter={(e) => {
            if (!uploading) {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)';
              (e.currentTarget as HTMLElement).style.color = 'var(--orange)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text)';
          }}
        >
          {uploading ? 'Uploading…' : url ? 'Change Image' : 'Upload Image'}
        </button>

        {url && !uploading && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Image uploaded</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {error && (
        <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.25rem' }}>{error}</p>
      )}
    </div>
  );
}
