'use client';

import { useState } from 'react';
import { createCategory, updateCategory } from './actions';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface Props {
  category?: Category;
}

export function CategoryForm({ category }: Props) {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');

  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!category) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
          }}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" defaultValue={category?.description ?? ''} rows={3} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input name="imageUrl" type="url" defaultValue={category?.imageUrl ?? ''} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sort Order</label>
        <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className="w-full border rounded-md px-3 py-2" />
      </div>
      <div className="flex items-center gap-2">
        <input name="isActive" type="checkbox" id="isActive" defaultChecked={category?.isActive ?? true} />
        <label htmlFor="isActive" className="text-sm font-medium">Active</label>
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md font-medium">
        {category ? 'Save Changes' : 'Create Category'}
      </button>
    </form>
  );
}
