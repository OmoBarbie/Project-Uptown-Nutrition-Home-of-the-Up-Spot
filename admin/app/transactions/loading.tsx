export default function TransactionsLoading() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            width: 180,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--card)',
            marginBottom: '0.5rem',
          }}
        />
        <div
          style={{
            width: 240,
            height: 16,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--card)',
          }}
        />
      </div>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}
      >
        {/* Header row skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr 2fr',
            gap: '0.75rem',
            padding: '0.75rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 12,
                borderRadius: 4,
                background: 'var(--surface)',
              }}
            />
          ))}
        </div>

        {/* Body rows skeleton */}
        {Array.from({ length: 8 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr 2fr',
              gap: '0.75rem',
              padding: '0.875rem 0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            {Array.from({ length: 7 }).map((_, colIdx) => (
              <div
                key={colIdx}
                style={{
                  height: 14,
                  borderRadius: 4,
                  background: 'var(--surface)',
                  opacity: 1 - rowIdx * 0.08,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
