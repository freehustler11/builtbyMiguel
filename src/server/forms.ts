export interface AuditSubmissionData {
  name: string
  businessName: string
  email: string
  cityArea: string
  websiteUrl?: string
  primaryGoal?: string
}

export interface ContactSubmissionData {
  name: string
  email: string
  phone?: string
  businessName?: string
  serviceInterest: string
  message: string
}

export interface FormSubmissionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

/**
 * Validate an email address
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Server-safe audit form submission handler
 */
export async function submitAuditRequest(
  data: AuditSubmissionData
): Promise<FormSubmissionResult> {
  const errors: Record<string, string> = {}

  if (!data.name?.trim()) {
    errors.name = 'Full name is required'
  }

  if (!data.businessName?.trim()) {
    errors.businessName = 'Business name is required'
  }

  if (!data.email?.trim() || !isValidEmail(data.email)) {
    errors.email = 'A valid email address is required'
  }

  if (!data.cityArea?.trim()) {
    errors.cityArea = 'Primary service city/area is required'
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please resolve the form validation errors.',
      errors,
    }
  }

  // Simulate transactional processing latency
  await new Promise((resolve) => setTimeout(resolve, 350))

  return {
    success: true,
    message: 'Audit request successfully received. Video will be delivered within 24 hours.',
  }
}

/**
 * Server-safe contact form submission handler
 */
export async function submitContactInquiry(
  data: ContactSubmissionData
): Promise<FormSubmissionResult> {
  const errors: Record<string, string> = {}

  if (!data.name?.trim()) {
    errors.name = 'Name is required'
  }

  if (!data.email?.trim() || !isValidEmail(data.email)) {
    errors.email = 'A valid email address is required'
  }

  if (!data.message?.trim()) {
    errors.message = 'Please provide details about your project or inquiry'
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please resolve the form validation errors.',
      errors,
    }
  }

  // Simulate transactional processing latency
  await new Promise((resolve) => setTimeout(resolve, 350))

  return {
    success: true,
    message: 'Inquiry received. Miguel will reply within 24 business hours.',
  }
}
