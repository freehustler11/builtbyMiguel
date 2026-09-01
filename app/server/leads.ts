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
 * Server-side lead processor for Audit requests
 */
export async function submitAuditLead(
  payload: AuditLeadPayload
): Promise<LeadSubmissionResponse> {
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

  // Generate unique lead ID and simulate low-latency server processing
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
    message: 'Audit request received. Video will be delivered within 24 hours.',
    leadId,
  }
}

/**
 * Server-side lead processor for direct Contact inquiries
 */
export async function submitContactLead(
  payload: ContactLeadPayload
): Promise<LeadSubmissionResponse> {
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

  // Generate unique inquiry ID and simulate low-latency server processing
  const leadId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    success: true,
    message: 'Message received. Miguel will reply within 24 business hours.',
    leadId,
  }
}
