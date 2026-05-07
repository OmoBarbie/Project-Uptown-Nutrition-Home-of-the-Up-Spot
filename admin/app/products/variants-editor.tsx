'use client';

import { useState } from 'react';

interface Variant {
  id?: string;
  name: string;
  type: string;
  priceModifier: string;
  stockQuantity: number;
  isActive: boolean;
  sortOrder: number;
}

interface Props {
  initial: Variant[];
}

export function VariantsEditor({ initial }: Props) {
  const [variants, setVariants] = useState<Variant[]>(initial);

  function add() {
    setVariants((v) => [...v, { name: '', type: 'size', priceModifier: '0', stockQuantity: 0, isActive: true, sortOrder: v.length }]);
  }

  function remove(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: keyof Variant, value: string | number | boolean) {
    setVariants((v) => v.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Variants</h3>
        <button type="button" onClick={add} className="text-sm text-green-600 hover:underline">+ Add variant</button>
      </div>
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      {variants.map((v, i) => (
        <div key={i} className="grid grid-cols-5 gap-2 items-end border rounded-md p-3">
          <div>
            <label className="text-xs text-gray-500">Name</label>
            <input value={v.name} onChange={(e) => update(i, 'name', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Type</label>
            <select value={v.type} onChange={(e) => update(i, 'type', e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
              <option value="size">Size</option>
              <option value="flavor">Flavor</option>
              <option value="option">Option</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Price ±</label>
            <input type="number" step="0.01" value={v.priceModifier} onChange={(e) => update(i, 'priceModifier', e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Stock</label>
            <input type="number" min="0" value={v.stockQuantity} onChange={(e) => update(i, 'stockQuantity', parseInt(e.target.value))} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <button type="button" onClick={() => remove(i)} className="text-red-500 text-sm hover:underline">Remove</button>
        </div>
      ))}
    </div>
  );
}
