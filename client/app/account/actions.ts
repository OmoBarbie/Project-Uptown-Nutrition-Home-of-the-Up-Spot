'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export interface UpdateProfileState {
  success?: boolean
  message?: string
  errors?: {
    name?: string[]
    phone?: string[]
  }
}

export async function updateProfile(
  prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  try {
    // Get the authenticated session
    const headersList = await headers()
    const session = await auth.api.getSession({
      headers: headersList,
    })

    if (!session) {
      return {
        success: false,
        message: 'Unauthorized. Please sign in.',
      }
    }

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    // Validate input
    const errors: UpdateProfileState['errors'] = {}

    if (!name || name.trim().length === 0) {
      errors.name = ['Name is required']
    }
    else if (name.trim().length < 2) {
      errors.name = ['Name must be at least 2 characters']
    }

    if (phone && phone.length > 0 && phone.length < 10) {
      errors.phone = ['Phone number must be at least 10 digits']
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
      }
    }

    // auth.api.updateUser identifies the user from session headers — no userId in body
    await auth.api.updateUser({
      headers: headersList,
      body: {
        name: name.trim(),
        phone: phone?.trim() || null,
      },
    })

    return {
      success: true,
      message: 'Profile updated successfully!',
    }
  }
  catch (error) {
    console.error('Error updating user:', error)
    return {
      success: false,
      message: 'Failed to update profile. Please try again.',
    }
  }
}
