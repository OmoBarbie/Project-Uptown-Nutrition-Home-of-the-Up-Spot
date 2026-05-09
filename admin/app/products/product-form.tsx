'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ProductFormState } from './actions';
import type { Category } from '@tayo/database';
import { VariantsEditor } from './variants-editor';
import { ImageUpload } from '@/components/image-upload';

interface Variant {
  id?: string;
  name: string;
  type: string;
  priceModifier: string;
  stockQuantity: number;
  isActive: boolean;
  sortOrder: number;
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      {pending ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
    </button>
  );
}

type ProductFormProps = {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: Category[];
  initialData?: {
    name: string;
    description: string;
    price: string;
    categoryId: string;
    emoji?: string;
    imageUrl?: string;
    stock: number;
    variants?: Variant[];
  };
  isEdit?: boolean;
};

export function ProductForm({ action, categories, initialData, isEdit = false }: ProductFormProps) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {state.message && (
        <div style={{ background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem' }}>
          <p style={{ color: 'var(--danger)', fontSize: '0.875rem', margin: 0 }}>{state.message}</p>
        </div>
      )}

      <div className="field">
        <label htmlFor="name">Product Name</label>
        <input type="text" name="name" id="name" defaultValue={initialData?.name} placeholder="e.g. Protein Bar" />
        {state.errors?.name && <span className="field-error">{state.errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" rows={3} defaultValue={initialData?.description} placeholder="Describe your product…" />
        {state.errors?.description && <span className="field-error">{state.errors.description}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="field">
          <label htmlFor="price">Price</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem', pointerEvents: 'none' }}>$</span>
            <input type="number" name="price" id="price" step="0.01" min="0" defaultValue={initialData?.price} placeholder="0.00" style={{ paddingLeft: '1.75rem' }} />
          </div>
          {state.errors?.price && <span className="field-error">{state.errors.price}</span>}
        </div>
        <div className="field">
          <label htmlFor="stock">Stock</label>
          <input type="number" name="stock" id="stock" min="0" defaultValue={initialData?.stock} placeholder="0" />
          {state.errors?.stock && <span className="field-error">{state.errors.stock}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select name="category" id="category" defaultValue={initialData?.categoryId || ''}>
            <option value="" disabled>Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {state.errors?.category && <span className="field-error">{state.errors.category}</span>}
        </div>
        <div className="field">
          <label htmlFor="emoji">Emoji <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional fallback)</span></label>
          <input type="text" name="emoji" id="emoji" maxLength={2} defaultValue={initialData?.emoji} placeholder="🥤" />
        </div>
      </div>

      <div className="field">
        <ImageUpload name="imageUrl" defaultValue={initialData?.imageUrl} label="Product Image" />
      </div>

      <hr className="divider" />
      <VariantsEditor initial={initialData?.variants ?? []} />
      <hr className="divider" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.625rem' }}>
        <a href="/products" className="btn btn-secondary">Cancel</a>
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
