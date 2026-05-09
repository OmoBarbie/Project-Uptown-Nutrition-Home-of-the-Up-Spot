'use client'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-forest-600 text-cream px-4 py-2 text-sm font-medium hover:bg-forest-700 transition-colors"
    >
      Print Invoice
    </button>
  )
}
