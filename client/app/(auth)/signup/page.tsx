import Link from 'next/link'
import { SignUpForm } from '@/app/components/AuthForms'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-4">
            <div className="h-10 w-10 rounded-full bg-forest-600 flex items-center justify-center">
              <span className="text-cream-100 text-xs font-bold tracking-wider">UP</span>
            </div>
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-display font-semibold text-charcoal">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/55">
            Already have an account?
            {' '}
            <Link
              href="/login"
              className="font-medium text-forest-600 hover:text-forest-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white border border-sand py-6 px-5 sm:py-8 sm:px-10">
          <SignUpForm />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
