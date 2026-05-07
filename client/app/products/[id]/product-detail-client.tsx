'use client';

import { useState } from 'react';
import { VariantSelector } from './variant-selector';
import { AddToCartButton } from './add-to-cart-button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  compareAtPrice: string | null;
  imageUrl: string;
  imageAlt: string | null;
  emoji: string | null;
  stockQuantity: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fiber: number | null;
  sugar: number | null;
  fat: number | null;
  category: { name: string };
  variants: { id: string; name: string; type: string; priceModifier: string; stockQuantity: number; isActive: boolean }[];
}

interface Props {
  product: Product;
  ratings: { averageRating: string; totalReviews: number } | null;
}

export function ProductDetailClient({ product, ratings }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState(parseFloat(product.price));

  const hasNutrition = [product.calories, product.protein, product.carbs].some((v) => v !== null);
  const stockForDisplay = selectedVariantId
    ? (product.variants.find((v) => v.id === selectedVariantId)?.stockQuantity ?? product.stockQuantity)
    : product.stockQuantity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img src={product.imageUrl} alt={product.imageAlt ?? product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <h1 className="text-3xl font-bold">{product.emoji} {product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-green-700">${displayPrice.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-gray-400 line-through">${parseFloat(product.compareAtPrice).toFixed(2)}</span>
            )}
          </div>

          {/* Ratings */}
          {ratings && ratings.totalReviews > 0 && (
            <a href="#reviews" className="text-sm text-gray-600 hover:underline">
              ★ {parseFloat(ratings.averageRating).toFixed(1)} ({ratings.totalReviews} reviews)
            </a>
          )}

          <p className="text-gray-700">{product.description}</p>

          <VariantSelector
            variants={product.variants}
            basePrice={product.price}
            onSelect={(vId, price) => { setSelectedVariantId(vId); setDisplayPrice(price); }}
          />

          <AddToCartButton
            productId={product.id}
            variantId={selectedVariantId}
            maxQuantity={stockForDisplay}
          />

          {/* Nutrition */}
          {hasNutrition && (
            <details className="border rounded-lg p-4">
              <summary className="font-medium cursor-pointer">Nutrition Info</summary>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                {product.calories != null && <><dt className="text-gray-500">Calories</dt><dd className="font-medium col-span-2">{product.calories}</dd></>}
                {product.protein != null && <><dt className="text-gray-500">Protein</dt><dd className="font-medium col-span-2">{product.protein}g</dd></>}
                {product.carbs != null && <><dt className="text-gray-500">Carbs</dt><dd className="font-medium col-span-2">{product.carbs}g</dd></>}
                {product.fiber != null && <><dt className="text-gray-500">Fiber</dt><dd className="font-medium col-span-2">{product.fiber}g</dd></>}
                {product.sugar != null && <><dt className="text-gray-500">Sugar</dt><dd className="font-medium col-span-2">{product.sugar}g</dd></>}
                {product.fat != null && <><dt className="text-gray-500">Fat</dt><dd className="font-medium col-span-2">{product.fat}g</dd></>}
              </dl>
            </details>
          )}
        </div>
      </div>

      {/* Reviews section anchor */}
      <div id="reviews" className="mt-16">
        {/* Reviews UI added in plan-08 */}
      </div>
    </div>
  );
}
