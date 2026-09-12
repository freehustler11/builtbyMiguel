/**
 * Canonical 301 Permanent Redirects configuration for Node server.
 * Maps discontinued, legacy, alias, and typo paths to their closest live canonical page.
 */

export const REDIRECT_MAP = {
  // --- SEO Pillar & General Services ---
  '/services': '/seo',
  '/services/seo': '/seo',
  '/seo-services': '/seo',
  '/contractor-seo': '/seo',
  '/seo-for-contractors': '/seo',

  // --- Local SEO & GBP Child ---
  '/local-seo': '/seo/local',
  '/services/local-seo': '/seo/local',
  '/gbp': '/seo/local',
  '/services/gbp': '/seo/local',
  '/google-business-profile': '/seo/local',
  '/google-business-profile-optimization': '/seo/local',
  '/local-search': '/seo/local',
  '/local-seo-gbp': '/seo/local',

  // --- National SEO Child ---
  '/national-seo-services': '/national-seo',
  '/services/national-seo': '/national-seo',
  '/b2b-seo': '/national-seo',
  '/enterprise-seo': '/national-seo',
  '/multi-location-seo': '/national-seo',
  '/franchise-seo': '/national-seo',
  '/franchise-seo-services': '/national-seo',

  // --- AEO & GEO / AI Search Child ---
  '/aeo-geo': '/seo/ai-search',
  '/aeo': '/seo/ai-search',
  '/geo': '/seo/ai-search',
  '/ai-seo': '/seo/ai-search',
  '/services/aeo-geo': '/seo/ai-search',
  '/generative-engine-optimization': '/seo/ai-search',
  '/generative-engine-optimization-services': '/seo/ai-search',
  '/answer-engine-optimization': '/seo/ai-search',
  '/ai-search': '/seo/ai-search',

  // --- Websites Pillar ---
  '/services/websites': '/websites',
  '/contractor-websites': '/websites',

  // --- Website Design & Development Child ---
  '/web-design': '/website-design',
  '/services/web-design': '/website-design',
  '/website-development': '/website-design',
  '/custom-web-development': '/website-design',
  '/website-redesign': '/website-design',
  '/website-redesign-services': '/website-design',
  '/small-business-website-design': '/website-design',

  // --- Website Care & Hosting Child ---
  '/website-maintenance': '/websites-care',
  '/services/website-maintenance': '/websites-care',
  '/services/websites-care': '/websites-care',
  '/website-care': '/websites-care',
  '/hosting': '/websites-care',
  '/website-hosting': '/websites-care',
  '/maintenance': '/websites-care',
  '/care': '/websites-care',

  // --- Systems & Automation Pillar ---
  '/automation': '/systems-auto',
  '/services/automation': '/systems-auto',
  '/services/systems-auto': '/systems-auto',
  '/systems': '/systems-auto',
  '/business-automation': '/systems-auto',
  '/business-automation-services': '/systems-auto',
  '/lead-automation': '/systems-auto',
  '/workflow-automation': '/systems-auto',

  // --- Website Demo Landing Page ---
  '/demo': '/website-demo',
  '/free-demo': '/website-demo',
  '/free-website-demo': '/website-demo',
  '/mockup': '/website-demo',
  '/website-mockup': '/website-demo',

  // --- Audit Page ---
  '/free-audit': '/audit',
  '/video-audit': '/audit',
  '/seo-audit': '/audit',

  // --- Work / Portfolio ---
  '/case-studies': '/work',
  '/portfolio': '/work',

  // --- Contact & Inquiries ---
  '/pricing': '/contact',
  '/quote': '/contact',
  '/get-in-touch': '/contact',
}

/**
 * Resolves a requested pathname to a 301 redirect target.
 * Returns null if the pathname is already a valid canonical route or not redirected.
 */
export function resolveRedirect(rawPath) {
  if (!rawPath) return null

  // Separate path from query string / hash if present
  const [pathOnly, search] = rawPath.split('?')
  const querySuffix = search ? `?${search}` : ''

  // Normalize: trim whitespace, convert to lowercase
  let normalized = pathOnly.trim().toLowerCase()

  // Strip trailing slash if present and not root '/'
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  // Direct map check
  if (REDIRECT_MAP[normalized]) {
    return `${REDIRECT_MAP[normalized]}${querySuffix}`
  }

  // Check if original had a trailing slash that can be stripped
  if (pathOnly.length > 1 && pathOnly.endsWith('/')) {
    const stripped = pathOnly.slice(0, -1)
    return `${stripped}${querySuffix}`
  }

  return null
}
