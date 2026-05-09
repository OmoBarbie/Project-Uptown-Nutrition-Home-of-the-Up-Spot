import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { approveReview, rejectReview, featureReview } from './actions';
import { CheckIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = 'pending' } = await searchParams;
  const db = getDb();

  const reviews = await db.query.reviews.findMany({
    where:
      tab === 'pending'
        ? eq(schema.reviews.isApproved, false)
        : tab === 'approved'
          ? eq(schema.reviews.isApproved, true)
          : undefined,
    with: {
      product: { columns: { name: true } },
      user: { columns: { name: true, email: true } },
    },
    orderBy: (r, { desc }) => [desc(r.createdAt)],
    limit: 50,
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reviews</h1>
          <p className="page-subtitle">{reviews.length} reviews in this view</p>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {(['pending','approved','all'] as const).map(t => (
          <a key={t} href={`/reviews?tab=${t}`} className={`tab${tab === t ? ' tab-active' : ''}`} style={{ textTransform: 'capitalize' }}>
            {t}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {reviews.map((r) => (
          <div key={r.id} className="card-padded">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{r.product.name}</span>
                  <span className="badge badge-orange" style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>
                    {r.user.name || r.user.email}
                  </span>
                  {r.isVerifiedPurchase && <span className="badge badge-success">Verified</span>}
                  {r.isFeatured && <span className="badge badge-blue">Featured</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {[1,2,3,4,5].map(s => (
                    <StarIcon key={s} style={{ width: 14, height: 14, fill: s <= r.rating ? '#F59E0B' : 'none', color: s <= r.rating ? '#F59E0B' : 'var(--border)', strokeWidth: 1.5 }} />
                  ))}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>{r.createdAt.toLocaleDateString()}</span>
                </div>
                {r.title && <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{r.title}</p>}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.comment}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, flexWrap: 'wrap' }}>
                {!r.isApproved && (
                  <form action={approveReview.bind(null, r.id)}>
                    <button type="submit" className="btn btn-success btn-sm">
                      <CheckIcon style={{ width: 14, height: 14 }} />
                      Approve
                    </button>
                  </form>
                )}
                <form action={rejectReview.bind(null, r.id)}>
                  <button type="submit" className="btn btn-danger btn-sm">
                    <TrashIcon style={{ width: 14, height: 14 }} />
                    Reject
                  </button>
                </form>
                <form action={featureReview.bind(null, r.id, !r.isFeatured)}>
                  <button type="submit" className={`btn btn-sm ${r.isFeatured ? 'btn-secondary' : 'btn-ghost'}`}>
                    <StarIcon style={{ width: 14, height: 14 }} />
                    {r.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="card-padded empty-state"><p>No reviews in this tab.</p></div>
        )}
      </div>
    </div>
  );
}
