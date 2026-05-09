import { CategoryForm } from '../category-form';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function NewCategoryPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/categories" className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
          <ChevronLeftIcon style={{ width: 14, height: 14 }} />
          Back to Categories
        </Link>
        <h1 className="page-title">New Category</h1>
      </div>
      <div className="card-padded" style={{ maxWidth: 560 }}>
        <CategoryForm />
      </div>
    </div>
  );
}
