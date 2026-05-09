import { getDb, schema } from '@tayo/database'
import { isNull } from 'drizzle-orm'
import { CopyEmailsButton } from '@/components/copy-emails-button'

export default async function NewsletterPage() {
  const db = getDb()
  const subscribers = await db.query.newsletterSubscribers.findMany({
    where: isNull(schema.newsletterSubscribers.unsubscribedAt),
    orderBy: (s, { desc }) => [desc(s.subscribedAt)],
  })

  const emails = subscribers.map(s => s.email)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Newsletter Subscribers</h1>
          <p className="page-subtitle">{subscribers.length} active subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        {subscribers.length > 0 && <CopyEmailsButton emails={emails} />}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(s => (
              <tr key={s.id}>
                <td style={{ color: 'var(--text)', fontWeight: 500 }}>{s.email}</td>
                <td style={{ fontSize: '0.8rem' }}>{s.subscribedAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No subscribers yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
