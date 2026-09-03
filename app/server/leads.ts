import { createServerFn } from '@tanstack/react-start'
import { db, messages } from '../db'

export interface AuditLeadPayload {
  name: string
  businessName: string
  email: string
  cityArea: string
  websiteUrl?: string
  primaryGoal?: string
}

export interface ContactLeadPayload {
  name: string
  email: string
  phone?: string
  businessName?: string
  serviceInterest: string
  message: string
}

export interface LeadSubmissionResponse {
  success: boolean
  message: string
  leadId?: string
  errors?: Record<string, string>
}

/**
 * Validate an email address format
 */
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Server Function: Inbound Audit lead submission (inserts to PostgreSQL)
 */
export const submitAuditLead = createServerFn({ method: 'POST' })
  .validator((data: AuditLeadPayload) => data)
  .handler(async ({ data: payload }): Promise<LeadSubmissionResponse> => {
    const errors: Record<string, string> = {}

    if (!payload.name?.trim()) {
      errors.name = 'Full name is required'
    }

    if (!payload.businessName?.trim()) {
      errors.businessName = 'Business name is required'
    }

    if (!payload.email?.trim() || !validateEmail(payload.email)) {
      errors.email = 'A valid work email address is required'
    }

    if (!payload.cityArea?.trim()) {
      errors.cityArea = 'Primary service city/area is required'
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Validation failed. Please correct the errors above.',
        errors,
      }
    }

    try {
      const [record] = await db
        .insert(messages)
        .values({
          type: 'audit',
          name: payload.name.trim(),
          businessName: payload.businessName.trim(),
          email: payload.email.trim().toLowerCase(),
          location: payload.cityArea.trim(),
          websiteUrl: payload.websiteUrl?.trim() || null,
          message: payload.primaryGoal
            ? `Primary Goal: ${payload.primaryGoal}`
            : 'Google Map Pack & SEO Growth Audit',
          status: 'new',
        })
        .returning()

      return {
        success: true,
        message:
          'Audit request received. Video will be delivered within 24 hours.',
        leadId: record.id,
      }
    } catch (err) {
      console.error('Database error in submitAuditLead:', err)
      return {
        success: false,
        message:
          'Database submission failed. Please try again or contact us directly.',
      }
    }
  })

/**
 * Server Function: Inbound Contact inquiry submission (inserts to PostgreSQL)
 */
export const submitContactLead = createServerFn({ method: 'POST' })
  .validator((data: ContactLeadPayload) => data)
  .handler(async ({ data: payload }): Promise<LeadSubmissionResponse> => {
    const errors: Record<string, string> = {}

    if (!payload.name?.trim()) {
      errors.name = 'Name is required'
    }

    if (!payload.email?.trim() || !validateEmail(payload.email)) {
      errors.email = 'A valid email address is required'
    }

    if (!payload.message?.trim()) {
      errors.message = 'Please provide details about your project or inquiry'
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Validation failed. Please correct the errors above.',
        errors,
      }
    }

    try {
      const formattedMessage = [
        payload.serviceInterest ? `[Interest: ${payload.serviceInterest}]` : '',
        payload.phone ? `[Phone: ${payload.phone}]` : '',
        payload.message.trim(),
      ]
        .filter(Boolean)
        .join('\n\n')

      const [record] = await db
        .insert(messages)
        .values({
          type: 'contact',
          name: payload.name.trim(),
          businessName: payload.businessName?.trim() || 'Direct Inquiry',
          email: payload.email.trim().toLowerCase(),
          location: null,
          websiteUrl: null,
          message: formattedMessage,
          status: 'new',
        })
        .returning()

      return {
        success: true,
        message:
          'Message received. Miguel will reply within 24 business hours.',
        leadId: record.id,
      }
    } catch (err) {
      console.error('Database error in submitContactLead:', err)
      return {
        success: false,
        message:
          'Database submission failed. Please try again or contact us directly.',
      }
    }
  })
