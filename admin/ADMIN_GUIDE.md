# Uptown Nutrition Admin Dashboard

A comprehensive admin dashboard for managing products and orders for the Uptown Nutrition e-commerce platform.

## Features

### 📊 Dashboard
- Overview statistics (Total Revenue, Orders, Products, Users)
- Quick actions for common tasks
- System status monitoring
- Real-time data from the database

### 📦 Product Management
- **View All Products**: Browse all products in a data table
  - Product name, category, price, stock level
  - Stock status indicators (In Stock / Out of Stock)
  - Quick edit and delete actions
- **Add New Product**: Create new products with:
  - Name, description, price
  - Category and emoji icon
  - Stock quantity
  - Form validation
- **Edit Product**: Update existing product information
  - Pre-filled form with current data
  - Same validation as create
- **Delete Product**: Remove products with confirmation

### 🛍️ Order Management
- **View All Orders**: Browse all orders with:
  - Order number, customer info, date
  - Total amount
  - Payment status (pending, processing, succeeded, failed, refunded)
  - Order status (pending, confirmed, preparing, ready_for_pickup, out_for_delivery, delivered, completed, cancelled, refunded)
- **Order Details**: View complete order information:
  - All order items with product details
  - Customer contact and shipping information
  - Payment method details
  - Order timeline
  - Price breakdown (subtotal, tax, delivery fee, total)
- **Update Order Status**: Change order status with dropdown
  - Automatically updates timestamps (confirmedAt, deliveredAt, cancelledAt)
  - Real-time status updates

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: Drizzle ORM with PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Forms**: React Server Actions with useActionState
- **Validation**: Server-side form validation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database (configured in .env)

### Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:
```env
DATABASE_URL="postgresql://..."
```

4. Start the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
admin/
├── app/
│   ├── layout.tsx              # Root layout with AdminLayout wrapper
│   ├── page.tsx                # Dashboard home with stats
│   ├── products/
│   │   ├── page.tsx           # Products list
│   │   ├── actions.ts         # Product CRUD actions
│   │   ├── product-form.tsx   # Reusable product form
│   │   ├── delete-button.tsx  # Delete product button
│   │   ├── new/
│   │   │   └── page.tsx       # Create product page
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx   # Edit product page
│   └── orders/
│       ├── page.tsx           # Orders list
│       ├── actions.ts         # Order update actions
│       └── [id]/
│           ├── page.tsx       # Order details
│           └── order-status-form.tsx  # Status update form
├── components/
│   └── AdminLayout.tsx        # Main layout with navigation
└── .env                       # Environment variables
```

## Features in Detail

### Dashboard Statistics

The dashboard automatically calculates and displays:
- **Total Revenue**: Sum of all successful payments
- **Total Orders**: Count of all orders
- **Total Products**: Count of all products
- **Total Users**: Count of registered users

### Product Management Workflow

1. **List View**:
   - See all products at a glance
   - Filter/sort capabilities (table structure ready)
   - Stock status indicators

2. **Create Product**:
   - Navigate to `/products/new`
   - Fill in product details
   - Validation ensures quality data
   - Redirects to product list on success

3. **Edit Product**:
   - Click "Edit" on any product
   - Form pre-filled with current data
   - Update and save changes
   - Redirects to product list on success

4. **Delete Product**:
   - Click "Delete" on any product
   - Confirmation dialog prevents accidents
   - Immediate removal from database

### Order Management Workflow

1. **List View**:
   - See all orders chronologically
   - Status badges for quick identification
   - Click "View" to see details

2. **Order Details**:
   - Complete order information
   - All purchased items
   - Customer and shipping details
   - Payment information
   - Order timeline

3. **Update Status**:
   - Select new status from dropdown
   - Click "Update Status"
   - Automatically updates relevant timestamps
   - Success confirmation message

## Order Status Flow

Typical order progression:
1. **pending** → Payment being processed
2. **confirmed** → Payment succeeded, order confirmed
3. **preparing** → Items being prepared
4. **ready_for_pickup** / **out_for_delivery** → Ready to go
5. **delivered** → Order delivered to customer
6. **completed** → Order fully complete

Alternative flows:
- **cancelled** → Order cancelled
- **refunded** → Payment refunded

## Payment Status

- **pending**: Payment not yet processed
- **processing**: Payment being processed
- **succeeded**: Payment successful
- **failed**: Payment failed
- **refunded**: Payment refunded to customer

## Database Schema

The admin uses the following tables from the shared database package:
- `products` - Product catalog
- `orders` - Customer orders
- `orderItems` - Items in each order
- `user` - Registered users

## Security Considerations

⚠️ **Important**: This admin dashboard currently has no authentication.

**For production**, you should:
1. Add authentication (e.g., better-auth with admin role)
2. Implement role-based access control
3. Add middleware to protect routes
4. Implement audit logging for changes
5. Add CSRF protection for forms

## Development Tips

### Adding New Features

1. **New Page**: Create in appropriate directory under `app/`
2. **Server Actions**: Add to `actions.ts` file
3. **Client Components**: Mark with `'use client'` directive
4. **Forms**: Use `useActionState` and `useFormStatus` hooks

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow existing color scheme:
  - Primary: Emerald (emerald-600, emerald-700)
  - Secondary: Orange (orange-500)
  - Neutral: Slate (slate-50, slate-100, etc.)
- Use ring utilities for borders instead of border classes

### Server Actions Pattern

```tsx
'use server';

export async function yourAction(
  prevState: YourState,
  formData: FormData
): Promise<YourState> {
  // 1. Extract and validate data
  // 2. Perform database operations
  // 3. Revalidate paths
  // 4. Return state or redirect
}
```

## Deployment

The admin dashboard can be deployed separately from the client app.

### Vercel Deployment

1. Connect your GitHub repository
2. Set root directory to `admin`
3. Add environment variables (DATABASE_URL)
4. Deploy

See `DEPLOYMENT_GUIDE.md` in the project root for detailed instructions.

## Troubleshooting

### Database Connection Issues

If you see database errors:
1. Check `.env` file has correct DATABASE_URL
2. Verify database is accessible
3. Check Drizzle schema is up to date

### Build Errors

If build fails:
1. Run `bun install` to ensure dependencies are installed
2. Check TypeScript errors with `bun tsc --noEmit`
3. Clear `.next` folder and rebuild

### Server Actions Not Working

If forms don't submit:
1. Ensure `'use server'` directive is at top of actions file
2. Check action returns correct state type
3. Verify `revalidatePath` is called after mutations

## Future Enhancements

Potential features to add:
- [ ] User management (view/edit users)
- [ ] Analytics and reports
- [ ] Bulk product import/export
- [ ] Order filtering and search
- [ ] Email notifications for order status changes
- [ ] Inventory management and low stock alerts
- [ ] Product categories management
- [ ] Discount codes and promotions
- [ ] Customer support chat integration
- [ ] Activity logs and audit trail

## Contributing

When adding features:
1. Follow existing code patterns
2. Use TypeScript for type safety
3. Add proper error handling
4. Update this README with new features
5. Test thoroughly before committing

## Support

For issues or questions:
- Check the main project README
- Review DEPLOYMENT_GUIDE.md
- Check database schema in `/database/src/schema`
