'use client';

interface Variant {
  id: string;
  name: string;
  type: string;
  priceModifier: string;
  stockQuantity: number;
  isActive: boolean;
}

interface Props {
  variants: Variant[];
  basePrice: string;
  onSelect: (variantId: string | null, finalPrice: number) => void;
}

export function VariantSelector({ variants, basePrice, onSelect }: Props) {
  if (variants.length === 0) return null;

  const types = [...new Set(variants.map((v) => v.type))];

  return (
    <div className="space-y-4">
      {types.map((type) => (
        <div key={type}>
          <p className="text-sm font-medium text-gray-700 capitalize mb-2">{type}</p>
          <div className="flex flex-wrap gap-2">
            {variants
              .filter((v) => v.type === type && v.isActive)
              .map((v) => {
                const modifier = parseFloat(v.priceModifier);
                const final = parseFloat(basePrice) + modifier;
                const label = modifier === 0
                  ? v.name
                  : modifier > 0
                  ? `${v.name} (+$${modifier.toFixed(2)})`
                  : `${v.name} (-$${Math.abs(modifier).toFixed(2)})`;

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={v.stockQuantity === 0}
                    onClick={() => onSelect(v.id, final)}
                    className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {label}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
