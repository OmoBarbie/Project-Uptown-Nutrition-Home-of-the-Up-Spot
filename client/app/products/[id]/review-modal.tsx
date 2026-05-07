'use client';

import { useState, useTransition } from 'react';
import { submitReview } from './actions';

interface Props {
  productId: string;
  isLoggedIn: boolean;
}

export function ReviewModal({ productId, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return <a href="/login" className="text-sm text-green-700 underline">Log in to write a review</a>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    setError('');
    startTransition(async () => {
      const result = await submitReview(productId, { rating, title, comment });
      if (result?.error) { setError(result.error); return; }
      setSuccess(true);
      setTimeout(() => { setOpen(false); setSuccess(false); setRating(0); setTitle(''); setComment(''); }, 2000);
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm bg-green-600 text-white px-4 py-2 rounded-md font-medium">
        Write a Review
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Write a Review</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">&#10005;</button>
            </div>
            {success ? (
              <p className="text-green-700 font-medium text-center py-4">Review submitted! It will appear after moderation.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Rating</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setRating(s)} className={`text-2xl ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>&#9733;</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title (optional)</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Review</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} minLength={20} required rows={4} className="w-full border rounded-md px-3 py-2 text-sm" />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={isPending} className="w-full bg-green-600 text-white py-2 rounded-md font-medium disabled:opacity-50">
                  {isPending ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
