'use client'

import type { BookingState } from './actions'
import { useActionState, useMemo } from 'react'
import { submitBookingRequest } from './actions'

const initialState: BookingState = {}

const eventTypes = [
  'Birthday Party',
  'Baby Shower',
  'Bachelor / Bachelorette Party',
  'Graduation Celebration',
  'Intimate Wedding',
  'Wedding Reception',
  'Holiday Party',
  'Brunch Party',
  'Pop-Up Shop',
  'Pop-Up Restaurant',
  'Photoshoot',
  'Art Gallery',
  'Yoga Class / Fitness Event',
  'Conference / Meeting',
  'Corporate Event',
  'Music Event',
  'Other',
]

const durations = [
  { value: '1', label: '1 hour — $150' },
  { value: '2', label: '2 hours — $300' },
  { value: '3', label: '3 hours — $450' },
  { value: '4', label: '4 hours — $600' },
  { value: '5', label: '5 hours — $750' },
  { value: '6', label: '6 hours — $900' },
  { value: 'custom', label: 'More than 6 hours — Let\'s talk' },
]

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length)
    return null
  return <p className="mt-1.5 text-xs text-terracotta-500">{messages[0]}</p>
}

const inputClass
  = 'block w-full bg-background border border-sand px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-forest-600 transition-colors'
const labelClass = 'block text-xs font-semibold tracking-[0.15em] uppercase text-foreground/50 mb-2'

export function BookingForm() {
  const [state, formAction, isPending] = useActionState(submitBookingRequest, initialState)
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  if (state.success) {
    return (
      <div className="border border-forest-600 bg-forest-50 p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-forest-600 mb-6">
          <svg className="w-7 h-7 text-cream-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-3xl font-medium text-charcoal mb-3">Request Sent!</h3>
        <p className="text-sm text-foreground/60 leading-relaxed max-w-md mx-auto">{state.message}</p>
        <p className="mt-4 text-xs text-foreground/40 italic">
          Deposit of $75 (non-refundable) due upon confirmation.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="space-y-0">
      {/* Contact information */}
      <div className="border border-sand p-4 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-charcoal mb-6">
          Your Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="name" className={labelClass}>Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="name"
              placeholder="Jane Smith"
              className={inputClass}
            />
            <FieldError messages={state.errors?.name} />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              autoComplete="tel"
              placeholder="(312) 555-0100"
              className={inputClass}
            />
            <FieldError messages={state.errors?.phone} />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              placeholder="jane@example.com"
              className={inputClass}
            />
            <FieldError messages={state.errors?.email} />
          </div>

          <div>
            <label htmlFor="confirmEmail" className={labelClass}>Confirm Email *</label>
            <input
              type="email"
              id="confirmEmail"
              name="confirmEmail"
              required
              autoComplete="email"
              placeholder="jane@example.com"
              className={inputClass}
            />
            <FieldError messages={state.errors?.confirmEmail} />
          </div>
        </div>
      </div>

      {/* Event details */}
      <div className="border border-t-0 border-sand p-4 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-charcoal mb-6">
          Event Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="date" className={labelClass}>Event Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              required
              min={today}
              className={inputClass}
            />
            <FieldError messages={state.errors?.date} />
          </div>

          <div>
            <label htmlFor="startTime" className={labelClass}>Start Time *</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              required
              className={inputClass}
            />
            <FieldError messages={state.errors?.startTime} />
          </div>

          <div>
            <label htmlFor="duration" className={labelClass}>Duration *</label>
            <select
              id="duration"
              name="duration"
              required
              className={inputClass}
              defaultValue=""
            >
              <option value="" disabled>Select duration…</option>
              {durations.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            <FieldError messages={state.errors?.duration} />
          </div>

          <div>
            <label htmlFor="guestCount" className={labelClass}>Number of Guests *</label>
            <input
              type="number"
              id="guestCount"
              name="guestCount"
              required
              min={1}
              placeholder="e.g. 25"
              className={inputClass}
            />
            <FieldError messages={state.errors?.guestCount} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="eventType" className={labelClass}>Event Type *</label>
            <select
              id="eventType"
              name="eventType"
              required
              className={inputClass}
              defaultValue=""
            >
              <option value="" disabled>Select event type…</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <FieldError messages={state.errors?.eventType} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="border border-t-0 border-sand p-4 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-charcoal mb-6">
          Additional Details
          <span className="ml-2 text-base font-normal italic text-foreground/40">(optional)</span>
        </h3>
        <div>
          <label htmlFor="notes" className={labelClass}>
            Comments, special requests, or questions
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Tell us about your vision, any special setup needs, equipment requests, or questions about the space…"
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Pricing reminder + submit */}
      <div className="border border-t-0 border-sand p-4 sm:p-8 bg-cream-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="text-sm text-foreground/55 leading-relaxed">
            <p>
              <span className="font-semibold text-charcoal">$150 / hour</span>
              {' '}
              · $75 non-refundable deposit due on confirmation
            </p>
            <p className="mt-1 text-xs">Discounts available upon request · Events preferred to conclude by 2 AM</p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto shrink-0 px-8 sm:px-10 py-3.5 sm:py-4 bg-forest-600 text-cream-100 text-sm font-semibold tracking-widest uppercase hover:bg-forest-700 active:bg-forest-900 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Sending…' : 'Request Booking'}
          </button>
        </div>

        {state.message && !state.success && (
          <p className="mt-4 text-sm text-terracotta-500">{state.message}</p>
        )}
      </div>
    </form>
  )
}
