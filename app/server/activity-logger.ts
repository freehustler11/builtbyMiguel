import { db, activityLogs } from '../db'
import type { ActivityAction } from './activity'

async function getServerUtils() {
  return await import(/* @vite-ignore */ '@tanstack/react-start/server')
}

/**
 * Extract client IP address and User-Agent from incoming request headers
 */
export async function getClientRequestMeta(): Promise<{ ipAddress: string; userAgent: string }> {
  let ipAddress = '127.0.0.1'
  let userAgent = 'Unknown'
  try {
    const { getRequestHeader } = await getServerUtils()
    const forwardedFor = getRequestHeader('x-forwarded-for') || ''
    const realIp = getRequestHeader('x-real-ip') || ''
    const cfConnectingIp = getRequestHeader('cf-connecting-ip') || ''
    const clientIp = cfConnectingIp || forwardedFor.split(',')[0]?.trim() || realIp
    if (clientIp) {
      ipAddress = clientIp
    }
    const ua = getRequestHeader('user-agent') || ''
    if (ua) {
      userAgent = ua
    }
  } catch {
    // Request context not available in non-HTTP server environments
  }
  return { ipAddress, userAgent }
}

/**
 * Clean device / browser formatter from user-agent string
 */
export function parseDevice(ua?: string | null): string {
  if (!ua || ua === 'Unknown') return 'Unknown Device'

  // OS Detection
  let os = 'Unknown OS'
  if (/windows phone/i.test(ua)) os = 'Windows Phone'
  else if (/win(dows|98|nt|32|64)/i.test(ua)) os = 'Windows'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/ipad/i.test(ua)) os = 'iPad'
  else if (/iphone|ipod/i.test(ua)) os = 'iPhone'
  else if (/mac(intosh|os)/i.test(ua)) os = 'macOS'
  else if (/linux/i.test(ua)) os = 'Linux'
  else if (/cros/i.test(ua)) os = 'ChromeOS'

  // Browser Detection
  let browser = 'Browser'
  if (/edg([ea]|ios)?\//i.test(ua)) browser = 'Edge'
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera'
  else if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome'
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) browser = 'Safari'
  else if (/msie|trident/i.test(ua)) browser = 'Internet Explorer'

  return `${browser} on ${os}`
}

/**
 * Safe, non-blocking helper to persist an activity log event
 */
export async function logActivity(entry: {
  userId?: string | null
  userEmail?: string | null
  role?: string | null
  action: ActivityAction | string
  ipAddress?: string | null
  userAgent?: string | null
}): Promise<void> {
  try {
    let { ipAddress, userAgent } = entry
    if (!ipAddress || !userAgent) {
      const meta = await getClientRequestMeta()
      if (!ipAddress) ipAddress = meta.ipAddress
      if (!userAgent) userAgent = meta.userAgent
    }

    await db.insert(activityLogs).values({
      userId: entry.userId || null,
      userEmail: entry.userEmail?.trim().toLowerCase() || null,
      role: entry.role || null,
      action: entry.action,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    })
  } catch (err) {
    // Non-blocking: failures in logging should never crash the parent request
    console.error('⚠️ [ActivityLog] Failed to record activity:', err)
  }
}
