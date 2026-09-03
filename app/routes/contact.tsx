import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Mail,
  Clock,
  MapPin,
  Send,
  MessageSquare,
  ShieldCheck,
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
        title: 'Contact Miguel | Direct Inquiries & Project Discovery',
      },
      {
        name: 'description',
        content:
          'Get in touch directly with Miguel to discuss Local SEO, high-speed custom websites, or operational business automation. 24-hour response guaranteed.',
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
        content: 'Contact & Project Inquiries | built by Miguel',
      },
      {
        property: 'og:description',
        content:
          'Discuss your website, local search rankings, or automation stack directly with Miguel.',
      },
      { property: 'og:url', content: 'https://builtbymiguel.net/contact' },
      { property: 'og:image', content: 'https://builtbymiguel.net/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
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
    businessName: '',
    serviceInterest: 'Local SEO & Google Maps',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const result = await submitContactLead(formData)

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
    <div className="space-y-20 sm:space-y-28 lg:space-y-32 py-8 sm:py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="mb-8 sm:mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-rose-600 dark:text-rose-400 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" /> Direct Inquiries · 24-Hour Response
          </div>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6 sm:mb-8">
          Let’s Build Something{' '}
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            High-Performing.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Have a project in mind, need to dominate local search, or want to automate your client intake? Send a note below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inquiry Form */}
        <div className="lg:col-span-7 rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-10 shadow-xl dark:shadow-none space-y-6">
          <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Project Discovery Note</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">I review every inquiry personally within 24 hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Your Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Miguel Sanchez"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                  errors.name
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <label htmlFor="contact-business" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="contact-business"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Sanchez Plumbing & HVAC"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                  errors.businessName
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
                }`}
              />
              {errors.businessName && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.businessName}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(512) 000-0000"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500 transition-colors"
              />
            </div>

            {/* Service of Interest */}
            <div className="space-y-2">
              <label htmlFor="contact-service" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Service of Interest
              </label>
              <select
                id="contact-service"
                value={formData.serviceInterest}
                onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500 transition-colors"
              >
                <option value="Local SEO & Google Maps" className="dark:bg-slate-900">Local SEO & Google Map Pack Optimization</option>
                <option value="High-Speed Website Rebuild" className="dark:bg-slate-900">High-Speed Website Rebuild & Care</option>
                <option value="Custom Business Systems & Automation" className="dark:bg-slate-900">Custom Business Systems & Automation</option>
                <option value="Full Growth Architecture" className="dark:bg-slate-900">Full Growth Architecture (All Solutions)</option>
                <option value="Other Inquiries" className="dark:bg-slate-900">Other Inquiries</option>
              </select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                How Can I Help? <span className="text-slate-400 font-normal lowercase">(project details)</span>
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your current rankings, website goals, or administrative bottlenecks..."
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-rose-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-rose-500 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white bg-slate-900 dark:bg-rose-600 hover:bg-black dark:hover:bg-rose-500 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Your Note...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 fill-white" />
                    <span>Send Message to Miguel</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Direct developer inbox. No spam. 24-hour response guarantee.
            </p>
          </form>
        </div>

        {/* Right Column: Direct Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[3rem] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-8 space-y-6 shadow-xl dark:shadow-none">
            {/* Founder Avatar & Title */}
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <img
                src="/miguel-umbac.png"
                alt="Miguel Umbac"
                className="w-16 h-16 rounded-2xl object-cover object-top shadow-md border border-slate-100 dark:border-slate-800"
              />
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white">Miguel Umbac</div>
                <div className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">Founder & Systems Architect</div>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                    Direct Email
                  </div>
                  <a
                    href="mailto:miguel@builtbymiguel.net"
                    className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 font-mono transition-colors"
                  >
                    miguel@builtbymiguel.net
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                    Response Guarantee
                  </div>
                  <div className="text-slate-900 dark:text-white font-semibold">
                    Within 24 business hours
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                    Service Radius
                  </div>
                  <div className="text-slate-900 dark:text-white font-semibold">
                    United States (Nationwide Remote)
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% confidential discussion. Zero sales pressure.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
