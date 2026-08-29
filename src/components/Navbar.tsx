import { Link } from '@tanstack/react-router'
import { Layers, Home, Info, Sparkles, ExternalLink, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                TanStack App
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400/80 font-medium">
                Vite + Router + Query
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              activeProps={{
                className: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
              }}
              inactiveProps={{
                className: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-transparent',
              }}
              activeOptions={{ exact: true }}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/about"
              activeProps={{
                className: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
              }}
              inactiveProps={{
                className: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-transparent',
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border transition-all duration-200"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </Link>
          </nav>

          {/* Right Action / Badges */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ready & Connected
            </div>
            
            <a
              href="https://tanstack.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Docs
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            activeProps={{
              className: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
            }}
            inactiveProps={{
              className: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-transparent',
            }}
            activeOptions={{ exact: true }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium border"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            activeProps={{
              className: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
            }}
            inactiveProps={{
              className: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-transparent',
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium border"
          >
            <Info className="w-4 h-4" />
            About
          </Link>
        </div>
      )}
    </header>
  )
}
