import { getDb, schema } from '@tayo/database';
import { eq } from 'drizzle-orm';
import { approveReview, rejectReview, featureReview } from './actions';

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
    with: { product: { columns: { name: true } } },
    orderBy: (r, { desc }) => [desc(r.createdAt)],
    limit: 50,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'all'].map((t) => (
          <a
            key={t}
            href={`/reviews?tab=${t}`}
            className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize ${tab === t ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {t}
          </a>
        ))}
      </div>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{r.product.name}</p>
                <p className="text-sm text-gray-500">
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}{' '}
                  {r.isVerifiedPurchase && (
                    <span className="text-green-600 text-xs ml-1">Verified</span>
                  )}
                </p>
                {r.title && <p className="font-medium mt-1">{r.title}</p>}
                <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                {!r.isApproved && (
                  <form action={approveReview.bind(null, r.id)}>
                    <button type="submit" className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      Approve
                    </button>
                  </form>
                )}
                <form action={rejectReview.bind(null, r.id)}>
                  <button type="submit" className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                    Reject
                  </button>
                </form>
                <form action={featureReview.bind(null, r.id, !r.isFeatured)}>
                  <button
                    type="submit"
                    className={`text-sm px-2 py-1 rounded ${r.isFeatured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {r.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500">No reviews in this tab.</p>}
      </div>
    </div>
  );
}
