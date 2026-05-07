import { createCoupon } from '../actions';

export default function NewCouponPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">New Coupon</h1>
      <form action={createCoupon} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <input
            name="code"
            required
            className="w-full border rounded-md px-3 py-2 uppercase"
            placeholder="SAVE10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select name="type" required className="w-full border rounded-md px-3 py-2">
            <option value="flat">Flat ($)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Value</label>
          <input
            name="value"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="10"
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md font-medium">
          Create Coupon
        </button>
      </form>
    </div>
  );
}
