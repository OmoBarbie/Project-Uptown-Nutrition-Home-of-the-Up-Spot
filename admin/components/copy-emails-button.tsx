'use client'

import { useState } from 'react'

export function CopyEmailsButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(emails.join(', '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy} className="btn btn-secondary btn-sm">
      {copied ? 'Copied!' : `Copy ${emails.length} email${emails.length !== 1 ? 's' : ''}`}
    </button>
  )
}
