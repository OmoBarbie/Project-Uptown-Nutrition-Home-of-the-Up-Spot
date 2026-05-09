import Stripe from 'stripe';

const statusConfig: Record<string, { label: string; cls: string }> = {
  succeeded:              { label: 'Succeeded',        cls: 'badge badge-success' },
  requires_payment_method:{ label: 'Requires Payment', cls: 'badge badge-warning' },
  canceled:               { label: 'Canceled',         cls: 'badge badge-danger'  },
  processing:             { label: 'Processing',       cls: 'badge badge-blue'    },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, cls: 'badge badge-neutral' };
  return <span className={cfg.cls}>{cfg.label}</span>;
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100);
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function TransactionsPage() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-12-15.clover' });
  const { data: paymentIntents } = await stripe.paymentIntents.list({ limit: 50, expand: ['data.customer'] });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Last {paymentIntents.length} Stripe PaymentIntents</p>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table style={{ minWidth: 780 }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {paymentIntents.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No transactions found.</td></tr>
              ) : (
                paymentIntents.map((pi) => {
                  const customer = pi.customer as Stripe.Customer | null;
                  const email = customer && typeof customer === 'object' && 'email' in customer
                    ? customer.email
                    : (pi.receipt_email ?? '—');
                  return (
                    <tr key={pi.id}>
                      <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{formatDate(pi.created)}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pi.id}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text)' }}>{formatAmount(pi.amount, pi.currency)}</td>
                      <td><StatusBadge status={pi.status} /></td>
                      <td style={{ fontSize: '0.85rem' }}>{email ?? '—'}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.825rem' }}>
                        {pi.description ?? '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
