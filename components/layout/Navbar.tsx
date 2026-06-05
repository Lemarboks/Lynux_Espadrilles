'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/context/CartContext'
import { useWishlist } from '@/app/context/WishlistContext'
import { getAllProducts } from '@/lib/products'
import { Product } from '@/types'

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false); setSearchQuery(''); setSearchResults([])
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); setSearchResults([]) }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim().length < 2) { setSearchResults([]); return }
    const q = query.toLowerCase()
    setSearchResults(getAllProducts().filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ).slice(0, 5))
  }

  const handleResultClick = (slug: string) => {
    setSearchOpen(false); setSearchQuery(''); setSearchResults([])
    router.push(`/product/${slug}`)
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream shadow-sm' : 'bg-cream'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Lynux Espadrilles"
                width={110}
                height={70}
                className="h-14 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="font-dm text-sm text-ink-mid hover:text-ink transition-colors duration-200 tracking-wide"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="text-ink-mid hover:text-ink transition-colors duration-200"
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>

              <Link href="/wishlist" className="hidden sm:block relative text-ink-mid hover:text-ink transition-colors duration-200" aria-label="Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-clay text-cream text-[10px] font-dm font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative flex items-center gap-1.5 font-dm text-sm text-ink-mid hover:text-ink transition-colors duration-200 border border-sand-dark hover:border-clay px-3 py-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span>Go to Cart</span>
                {cartCount > 0 && (
                  <span className="bg-clay text-cream text-[10px] font-dm font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden text-ink ml-1"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Search dropdown */}
          {searchOpen && (
            <div ref={searchRef} className="border-t border-sand-dark pb-4">
              <div className="relative py-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-light">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search styles..."
                  className="w-full pl-7 font-dm text-sm text-ink bg-transparent focus:outline-none placeholder:text-ink-light"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]) }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              {searchQuery.trim().length >= 2 && (
                <div className="border-t border-sand">
                  {searchResults.length > 0 ? searchResults.map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.slug)}
                      className="w-full flex items-center gap-4 py-3 hover:bg-sand transition-colors duration-150 text-left"
                    >
                      <div className="relative w-10 h-10 flex-shrink-0 bg-sand overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-cormorant font-semibold text-sm text-ink">{product.name}</p>
                        <p className="font-dm text-xs text-ink-light">{formatPrice(product.price)}</p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-light flex-shrink-0">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  )) : (
                    <p className="font-dm text-sm text-ink-light py-4">
                      No styles found for &ldquo;{searchQuery}&rdquo;
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 bg-cream flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 h-16 border-b border-sand-dark">
              <span className="font-cormorant font-semibold text-xl text-ink">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-ink-light hover:text-ink transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <nav className="flex flex-col px-6 pt-8 gap-6">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="font-cormorant font-semibold text-3xl text-ink hover:text-clay transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto px-6 pb-8 pt-6 border-t border-sand-dark">
              <p className="font-dm text-xs text-ink-light mb-2">Follow us</p>
              <a href="https://instagram.com/lynux_espadrille" target="_blank" rel="noopener noreferrer"
                className="font-dm text-sm text-ink-mid hover:text-clay transition-colors flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
                @lynux_espadrille
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
