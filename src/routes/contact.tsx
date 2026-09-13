import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Send,
  MessageSquare,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'
import { submitContactLead } from '../server/leads'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Contact built by Miguel | Direct Inquiries, 24-Hour Response',
      },
      {
        name: 'description',
        content:
          'Send Miguel a direct message about your website, local search rankings, or lead automation. No sales team, personal reply within 24 hours.',
      },
      {
        name: 'keywords',
        content:
          'contact miguel, hire local seo specialist, custom website inquiry, small business automation consultation',
      },
      // OpenGraph
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Contact built by Miguel | Direct Inquiries, 24-Hour Response',
      },
      {
        property: 'og:description',
        content:
          'Send Miguel a direct message about your website, local search rankings, or lead automation. No sales team, personal reply within 24 hours.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/contact' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Contact built by Miguel | Direct Inquiries, 24-Hour Response',
      },
      {
        name: 'twitter:description',
        content:
          'Send Miguel a direct message about your website, local search rankings, or lead automation. No sales team, personal reply within 24 hours.',
      },
      { name: 'twitter:image', content: 'https://builtbymiguel.net/og-image.png' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://builtbymiguel.net/contact',
      },
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Local SEO & Google Map Pack Optimization',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const result = await submitContactLead({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceInterest: formData.serviceInterest,
        message: formData.message,
      },
    })

    if (result.success) {
      navigate({ to: '/thank-you' })
    } else {
      setIsSubmitting(false)
      if (result.errors) {
        setErrors(result.errors)
      }
    }
  }

  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-12 sm:py-16 md:py-20 space-y-12 sm:space-y-16">
        {/* Soft Ambient Light Glow Matching Design System */}
        <div className="relative text-center max-w-3xl mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-400/20 via-orange-400/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

          {/* SECTION 1: Hero */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/50 shadow-xs">
              <MessageSquare className="w-3.5 h-3.5" /> Direct Inquiries · 24-Hour Response
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
            Let's Build Systems That{' '}
            <span className="text-amber-600 dark:text-amber-400">
              Bring You Jobs.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Have a question about your website, local search rankings, or lead automation? Send a note below to start a conversation.
          </p>
        </div>

        {/* SECTION 2: Contact (Single Column) */}
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Personal Intro Line with Small Photo */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#111827]/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <img
              src="/miguel-umbac.png"
              alt="Miguel Umbac"
              className="w-12 h-12 rounded-full object-cover object-top border-2 border-amber-500/40 shadow-xs shrink-0"
            />
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              You're contacting Miguel Umbac directly. No sales team, no hand-offs, just a reply from me within 24 hours.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-sm dark:shadow-none space-y-6">
            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-5">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                Send a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                I review every inquiry personally within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Your Name */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Your Name <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Miguel Sanchez"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Email Address <span className="text-amber-600 dark:text-amber-400">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.com"
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(512) 000-0000"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 transition-colors"
                />
              </div>

              {/* Service of Interest */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-service"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Service of Interest
                </label>
                <select
                  id="contact-service"
                  value={formData.serviceInterest}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceInterest: e.target.value })
                  }
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 transition-colors"
                >
                  <option value="Local SEO & Google Map Pack Optimization" className="dark:bg-slate-900">
                    Local SEO & Google Map Pack Optimization
                  </option>
                  <option value="National & Regional SEO" className="dark:bg-slate-900">
                    National & Regional SEO
                  </option>
                  <option value="AEO & GEO Optimization" className="dark:bg-slate-900">
                    AEO & GEO Optimization
                  </option>
                  <option value="Website Design & Development" className="dark:bg-slate-900">
                    Website Design & Development
                  </option>
                  <option value="Website Hosting & Care" className="dark:bg-slate-900">
                    Website Hosting & Care
                  </option>
                  <option value="Systems & Automation" className="dark:bg-slate-900">
                    Systems & Automation
                  </option>
                  <option value="Not Sure Yet" className="dark:bg-slate-900">
                    Not Sure Yet
                  </option>
                </select>
              </div>

              {/* How Can I Help? */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  How Can I Help? <span className="text-slate-400 font-normal lowercase">(project details)</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your current website, Google rankings, or lead goals..."
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                    errors.message
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.message}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 active:scale-98 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Sending Your Note...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 fill-slate-950" />
                      <span>Send Message to Miguel</span>
                    </>
                  )}
                </button>
              </div>

              {/* Micro-copy below button */}
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-sans">
                Direct inbox. No spam. 24-hour response guarantee.
              </p>
            </form>
          </div>

          {/* Horizontal Trust Strip (below the form) */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 p-5 sm:p-6 space-y-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <span className="text-base leading-none select-none">📧</span>
                <div className="leading-snug">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Direct Email
                  </span>{' '}
                  —{' '}
                  <a
                    href="mailto:umbacmi@gmail.com"
                    className="text-amber-600 dark:text-amber-400 hover:underline font-mono"
                  >
                    umbacmi@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-base leading-none select-none">⏱️</span>
                <div className="leading-snug">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Response Guarantee
                  </span>{' '}
                  — Within 24 business hours
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:col-span-2">
                <span className="text-base leading-none select-none">🌍</span>
                <div className="leading-snug">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Where I Work
                  </span>{' '}
                  — Based in Dumaguete City, Philippines. Serving clients across the US, Canada, Australia, and worldwide.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="text-base leading-none select-none">✅</span>
              <span>100% confidential. No sales pressure.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
