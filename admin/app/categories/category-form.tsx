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
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 520 }}>
      <div className="field">
        <label htmlFor="cat-name">Name</label>
        <input
          id="cat-name"
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!category) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
          }}
        />
      </div>
      <div className="field">
        <label htmlFor="cat-slug">Slug</label>
        <input id="cat-slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="cat-description">Description</label>
        <textarea id="cat-description" name="description" defaultValue={category?.description ?? ''} rows={3} />
      </div>
      <div className="field">
        <label htmlFor="cat-imageUrl">Image URL</label>
        <input id="cat-imageUrl" name="imageUrl" type="url" defaultValue={category?.imageUrl ?? ''} />
      </div>
      <div className="field">
        <label htmlFor="cat-sortOrder">Sort Order</label>
        <input id="cat-sortOrder" name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input name="isActive" type="checkbox" id="isActive" defaultChecked={category?.isActive ?? true} style={{ width: 'auto' }} />
        <label htmlFor="isActive" style={{ margin: 0 }}>Active</label>
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          {category ? 'Save Changes' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}
