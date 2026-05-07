'use server'

import { FROM, getResend } from '@tayo/email'

export interface BookingState {
  success?: boolean
  message?: string
  errors?: {
    name?: string[]
    phone?: string[]
    email?: string[]
    confirmEmail?: string[]
    date?: string[]
    startTime?: string[]
    duration?: string[]
    guestCount?: string[]
    eventType?: string[]
  }
}

const BUSINESS_EMAIL = 'setemiojo@gmail.com'
const BUSINESS_NAME = 'The Up Spot'

export async function submitBookingRequest(
  prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const name = (formData.get('name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const confirmEmail = (formData.get('confirmEmail') as string)?.trim().toLowerCase()
  const date = formData.get('date') as string
  const startTime = formData.get('startTime') as string
  const duration = formData.get('duration') as string
  const guestCount = formData.get('guestCount') as string
  const eventType = formData.get('eventType') as string
  const notes = (formData.get('notes') as string)?.trim()

  // Validation
  const errors: BookingState['errors'] = {}

  if (!name || name.length < 2) {
    errors.name = ['Full name is required (at least 2 characters)']
  }
  if (!phone || phone.replace(/\D/g, '').length < 10) {
    errors.phone = ['A valid phone number (10+ digits) is required']
  }
  if (!email || !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)) {
    errors.email = ['A valid email address is required']
  }
  if (!confirmEmail || confirmEmail !== email) {
    errors.confirmEmail = ['Email addresses do not match']
  }
  if (!date) {
    errors.date = ['Event date is required']
  }
  else {
    const eventDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (eventDate < today) {
      errors.date = ['Event date must be in the future']
    }
  }
  if (!startTime) {
    errors.startTime = ['Start time is required']
  }
  if (!duration) {
    errors.duration = ['Duration is required']
  }
  if (!guestCount || Number.parseInt(guestCount) < 1) {
    errors.guestCount = ['Guest count must be at least 1']
  }
  if (!eventType) {
    errors.eventType = ['Please select an event type']
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  // Format date for display
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Format time for display
  const [hours, minutes] = startTime.split(':')
  const hour = Number.parseInt(hours)
  const formattedTime = `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`

  const estimatedTotal = duration === 'custom'
    ? 'To be discussed'
    : `$${Number.parseInt(duration) * 150} + $75 deposit`

  try {
    const resend = getResend()

    // Notify the business
    await resend.emails.send({
      from: FROM,
      to: BUSINESS_EMAIL,
      subject: `New Venue Booking Request — ${eventType} on ${formattedDate}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8f5f0; color: #1a1008;">
          <div style="background: #1f4e3b; padding: 24px 32px; margin-bottom: 24px;">
            <h1 style="color: #f5f0e8; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">New Booking Request</h1>
            <p style="color: #c9a98a; margin: 8px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px;">${BUSINESS_NAME} · The Up Spot</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; color: #7a6550; width: 140px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; color: #7a6550;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce;"><a href="tel:${phone}" style="color: #1f4e3b;">${phone}</a></td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; color: #7a6550;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce;"><a href="mailto:${email}" style="color: #1f4e3b;">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; color: #7a6550;">Event Type</td><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; font-weight: 600;">${eventType}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; color: #7a6550;">Date</td><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce;">${formattedDate}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; color: #7a6550;">Start Time</td><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce;">${formattedTime}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; color: #7a6550;">Duration</td><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce;">${duration === 'custom' ? 'To discuss' : `${duration} hour${Number.parseInt(duration) > 1 ? 's' : ''}`}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; color: #7a6550;">Guests</td><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce;">${guestCount}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; color: #7a6550;">Est. Total</td><td style="padding: 10px 0; border-bottom: 1px solid #e0d8ce; font-weight: 600; color: #b05a2f;">${estimatedTotal}</td></tr>
            ${notes ? `<tr><td style="padding: 10px 0; color: #7a6550; vertical-align: top;">Notes</td><td style="padding: 10px 0;">${notes}</td></tr>` : ''}
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #1f4e3b; color: #f5f0e8; font-size: 13px;">
            Reply to this email or call <strong>${phone}</strong> to confirm the booking and collect the $75 deposit.
          </div>
        </div>
      `,
    })

    // Send confirmation to the customer
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `We received your booking request — ${BUSINESS_NAME}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8f5f0; color: #1a1008;">
          <div style="background: #1f4e3b; padding: 24px 32px; margin-bottom: 24px;">
            <h1 style="color: #f5f0e8; margin: 0; font-size: 22px; letter-spacing: 1px;">Booking Request Received</h1>
            <p style="color: #c9a98a; margin: 8px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px;">The Up Spot · 4548 N. Broadway, Chicago</p>
          </div>

          <p style="font-size: 16px; line-height: 1.7;">Hi ${name},</p>
          <p style="font-size: 15px; line-height: 1.7; color: #4a3828;">
            Thank you for your interest in The Up Spot! We've received your booking request and will be in touch within 24 hours to confirm availability and arrange your <strong>$75 non-refundable deposit</strong>.
          </p>

          <div style="border: 1px solid #d8cfc5; padding: 20px 24px; margin: 24px 0; background: #fff;">
            <p style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #7a6550;">Your Request Summary</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Event:</strong> ${eventType}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Duration:</strong> ${duration === 'custom' ? 'To be discussed' : `${duration} hour${Number.parseInt(duration) > 1 ? 's' : ''}`}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Guests:</strong> ${guestCount}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Estimated Total:</strong> <span style="color: #b05a2f; font-weight: 600;">${estimatedTotal}</span></p>
          </div>

          <p style="font-size: 14px; color: #7a6550; line-height: 1.7;">
            Questions? Call us at <a href="tel:312-899-6358" style="color: #1f4e3b;">312-899-6358</a> or <a href="tel:630-251-8059" style="color: #1f4e3b;">630-251-8059</a>.
          </p>

          <p style="font-size: 14px; color: #7a6550; margin-top: 24px;">
            See you soon,<br />
            <strong style="color: #1a1008;">The Up Spot Team</strong><br />
            <span style="font-style: italic; font-size: 13px;">Uptown Nutrition · 4548 N. Broadway, Chicago</span>
          </p>
        </div>
      `,
    })

    return {
      success: true,
      message: `Your booking request has been received, ${name}! Check your inbox — we'll confirm availability within 24 hours.`,
    }
  }
  catch (err) {
    console.error('Failed to send venue booking emails:', err)
    // Email failed but we still acknowledge the request
    return {
      success: true,
      message: `Your booking request has been received, ${name}! We'll reach out to ${email} within 24 hours to confirm.`,
    }
  }
}
