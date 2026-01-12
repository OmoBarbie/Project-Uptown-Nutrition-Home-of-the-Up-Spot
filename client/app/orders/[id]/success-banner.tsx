'use client';

import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export function SuccessBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-50 border-b border-emerald-200">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center flex-1">
            <CheckCircleIcon className="h-6 w-6 text-emerald-600 flex-shrink-0" aria-hidden="true" />
            <p className="ml-3 font-medium text-emerald-800">
              <span className="md:hidden">Payment successful!</span>
              <span className="hidden md:inline">
                Payment successful! Your order has been confirmed and will be processed shortly.
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="ml-3 inline-flex rounded-md bg-emerald-50 p-1.5 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-emerald-50"
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
