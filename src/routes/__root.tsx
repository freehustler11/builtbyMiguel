import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export interface RouterContext {
  queryClient: QueryClient
}

const LOCAL_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Built by Miguel',
  url: 'https://builtbymiguel.com',
  logo: 'https://builtbymiguel.com/logo.png',
  image: 'https://builtbymiguel.com/og-image.png',
  description:
    'Local SEO, high-speed websites, and custom business automation tools.',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Growth & Technology Solutions',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Local SEO & Google Business Profile Optimization',
          description:
            'Data-driven local search ranking and Google Maps dominance.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'High-Performance Websites & Care Plans',
          description:
            'Ultra-fast SSR web applications with zero-latency UX and ongoing maintenance.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Business Systems & Workflow Automation',
          description:
            'Automated CRM integration, booking workflows, and client pipelines.',
        },
      },
    ],
  },
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
      {
        title: 'Built by Miguel | High-Performance Websites & Local SEO Systems',
      },
      {
        name: 'description',
        content:
          'High-performance websites, local search rankings, and custom business systems engineered for local market dominance.',
      },
      // OpenGraph
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'Built by Miguel',
      },
      {
        property: 'og:title',
        content: 'Built by Miguel | High-Performance Websites & Local SEO Systems',
      },
      {
        property: 'og:description',
        content:
          'High-performance websites, local search rankings, and custom business systems.',
      },
      {
        property: 'og:url',
        content: 'https://builtbymiguel.com',
      },
      {
        property: 'og:image',
        content: 'https://builtbymiguel.com/og-image.jpg',
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Built by Miguel | High-Performance Websites & Local SEO Systems',
      },
      {
        name: 'twitter:description',
        content:
          'High-performance websites, local search rankings, and custom business systems.',
      },
      {
        name: 'twitter:image',
        content: 'https://builtbymiguel.com/og-image.jpg',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(LOCAL_BUSINESS_JSON_LD),
      },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 antialiased font-sans">
      {/* SSR Head Injection */}
      <HeadContent />

      {/* Persistent Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* Persistent Footer */}
      <Footer />

      {/* Devtools Panel (Dev mode only) */}
      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </>
      )}

      {/* SSR Scripts & Scroll Restoration */}
      <ScrollRestoration />
      <Scripts />
    </div>
  )
}
