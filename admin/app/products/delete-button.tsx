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
    } catch {
      alert('Failed to delete product');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn btn-danger btn-sm"
    >
      <TrashIcon style={{ width: 14, height: 14 }} />
      {isDeleting ? 'Deleting…' : 'Delete'}
    </button>
  );
}
