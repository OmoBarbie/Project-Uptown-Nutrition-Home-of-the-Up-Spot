'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ProductFormState } from './actions';
import type { Category } from '@tayo/database';

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {pending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
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
    emoji: string;
    stock: number;
  };
  isEdit?: boolean;
};

export function ProductForm({ action, categories, initialData, isEdit = false }: ProductFormProps) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{state.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-900">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={initialData?.name}
          className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
          placeholder="e.g., Protein Bar"
        />
        {state.errors?.name && (
          <p className="mt-2 text-sm text-red-600">{state.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-900">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          defaultValue={initialData?.description}
          className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
          placeholder="Describe your product..."
        />
        {state.errors?.description && (
          <p className="mt-2 text-sm text-red-600">{state.errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-900">
            Price
          </label>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-slate-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              step="0.01"
              min="0"
              defaultValue={initialData?.price}
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
              placeholder="0.00"
            />
          </div>
          {state.errors?.price && (
            <p className="mt-2 text-sm text-red-600">{state.errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-slate-900">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            id="stock"
            min="0"
            defaultValue={initialData?.stock}
            className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
            placeholder="0"
          />
          {state.errors?.stock && (
            <p className="mt-2 text-sm text-red-600">{state.errors.stock}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-900">
            Category
          </label>
          <select
            name="category"
            id="category"
            defaultValue={initialData?.categoryId || ''}
            className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {state.errors?.category && (
            <p className="mt-2 text-sm text-red-600">{state.errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="emoji" className="block text-sm font-medium text-slate-900">
            Emoji
          </label>
          <input
            type="text"
            name="emoji"
            id="emoji"
            maxLength={2}
            defaultValue={initialData?.emoji}
            className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm"
            placeholder="🥤"
          />
          {state.errors?.emoji && (
            <p className="mt-2 text-sm text-red-600">{state.errors.emoji}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-3 pt-4 border-t border-slate-200">
        <a
          href="/products"
          className="rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          Cancel
        </a>
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
