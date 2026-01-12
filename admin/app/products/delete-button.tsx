'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { deleteProduct } from './actions';

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(productId);
    } catch (error) {
      alert('Failed to delete product');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-x-1 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-red-50 disabled:opacity-50"
    >
      <TrashIcon className="h-4 w-4" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
