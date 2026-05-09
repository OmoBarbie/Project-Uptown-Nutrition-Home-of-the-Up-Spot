import { getDb, schema } from '@tayo/database'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { HelpfulButton } from './helpful-button'
import { GuestReviewPrompt, ReviewForm } from './review-modal'

interface Props {
  productId: string
  ratings: { averageRating: number, totalReviews: number, oneStar: number, twoStar: number, threeStar: number, fourStar: number, fiveStar: number } | null
}

export async function ReviewsSection({ productId, ratings }: Props) {
  const db = getDb()
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  const reviews = await db.query.reviews.findMany({
    where: and(eq(schema.reviews.productId, productId), eq(schema.reviews.isApproved, true)),
    orderBy: [desc(schema.reviews.createdAt)],
    limit: 10,
  })

  const votedReviewIds = new Set<string>()
  if (session && reviews.length > 0) {
    const votes = await db.query.reviewHelpful.findMany({
      where: and(
        eq(schema.reviewHelpful.userId, session.user.id),
        inArray(schema.reviewHelpful.reviewId, reviews.map(r => r.id)),
      ),
      columns: { reviewId: true },
    })
    votes.forEach(v => votedReviewIds.add(v.reviewId))
  }

  const avg = ratings ? ratings.averageRating : 0
  const total = ratings?.totalReviews ?? 0

  const starCounts = ratings
    ? [ratings.fiveStar, ratings.fourStar, ratings.threeStar, ratings.twoStar, ratings.oneStar]
    : [0, 0, 0, 0, 0]

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Reviews
          {total > 0 && `(${total})`}
        </h2>
        {session ? <ReviewForm productId={productId} /> : <GuestReviewPrompt />}
      </div>

      {total > 0 && (
        <div className="flex gap-8 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-4xl font-bold">{avg.toFixed(1)}</p>
            <p className="text-yellow-400 text-xl">{'★'.repeat(Math.round(avg))}</p>
            <p className="text-sm text-gray-500">
              {total}
              {' '}
              reviews
            </p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-right">{star}</span>
                <span className="text-yellow-400">★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: total > 0 ? `${(starCounts[i] / total) * 100}%` : '0%' }} />
                </div>
                <span className="text-gray-500 w-6">{starCounts[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map(r => (
          <div key={r.id} className="border-b pb-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </span>
                {r.isVerifiedPurchase && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified Purchase</span>}
              </div>
              <span className="text-sm text-gray-400">{r.createdAt.toLocaleDateString()}</span>
            </div>
            {r.title && <p className="font-semibold mb-1">{r.title}</p>}
            <p className="text-gray-700 text-sm">{r.comment}</p>
            <HelpfulButton
              reviewId={r.id}
              initialCount={r.helpfulCount}
              initialVoted={votedReviewIds.has(r.id)}
              isLoggedIn={!!session}
            />
          </div>
        ))}
        {reviews.length === 0 && total === 0 && (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        )}
      </div>
    </section>
  )
}
