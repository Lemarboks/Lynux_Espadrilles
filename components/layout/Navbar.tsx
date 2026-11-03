'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/app/context/CartContext'
import { useWishlist } from '@/app/context/WishlistContext'
import { getAllProducts } from '@/lib/products'
import { img } from '@/lib/image'
import { Product } from '@/types'

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Our story', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
)
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" /></svg>
)
const BagIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
)

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const router = useRouter()
  const pathname = usePathname()
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

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
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); setMobileOpen(false) }
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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <div className="lx-header-wrap">
      <div className="lx-announcement font-dm">
        <span>Handcrafted to order</span><span aria-hidden>·</span><span>R65 flat-rate delivery across South Africa</span>
      </div>

      <header className="lx-header font-dm">
        <button className="lx-icon-button lx-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <svg viewBox="0 0 24 24" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>

        {/* Original Lynux badge, in black */}
        <Link href="/" className="lx-logo" aria-label="Lynux Espadrilles home">
          <Image src={img('/images/logo-black.png')} alt="Lynux Espadrilles" width={110} height={78} priority />
        </Link>

        <nav className="lx-nav" aria-label="Main">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className={isActive(href) ? 'is-active' : undefined}>{label}</Link>
          ))}
        </nav>

        <div className="lx-actions">
          <button className="lx-icon-button" onClick={() => setSearchOpen(v => !v)} aria-label="Search">
            <SearchIcon />
          </button>
          <Link href="/wishlist" className="lx-liked" aria-label={`Liked items, ${wishlistCount}`}>
            <HeartIcon />
            {wishlistCount > 0 && <span className="lx-count lx-liked-count">{wishlistCount}</span>}
          </Link>
          <Link href="/cart" className="lx-bag" aria-label={`Go to cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
            <span className="lx-bag-icon"><BagIcon /></span>
            <span className="lx-bag-label">Go to cart</span>
            <span className="lx-count">{cartCount}</span>
          </Link>
        </div>
      </header>

      {searchOpen && (
        <div ref={searchRef} className="lx-search font-dm">
          <div className="lx-container">
            <div className="relative py-4">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-light lx-search-icon"><SearchIcon /></span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search styles..."
                className="w-full pl-8 text-sm text-ink bg-transparent focus:outline-none placeholder:text-ink-light"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]) }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink transition-colors"
                aria-label="Close search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {searchQuery.trim().length >= 2 && (
              <div className="border-t border-sand-dark pb-2">
                {searchResults.length > 0 ? searchResults.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product.slug)}
                    className="w-full flex items-center gap-4 py-3 hover:bg-sand transition-colors duration-150 text-left"
                  >
                    <div className="relative w-10 h-10 flex-shrink-0 bg-sand overflow-hidden">
                      <Image src={img(product.image)} alt={product.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink">{product.name}</p>
                      <p className="text-xs text-ink-light">{formatPrice(product.price)}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-light flex-shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                )) : (
                  <p className="text-sm text-ink-light py-4">No styles found for &ldquo;{searchQuery}&rdquo;</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lx-drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <nav className="lx-drawer font-dm" aria-label="Mobile" onClick={e => e.stopPropagation()}>
            <button className="lx-icon-button lx-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <svg viewBox="0 0 24 24" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
            {navLinks.map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="font-cormorant">{label}</Link>
            ))}
            <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="font-cormorant">Liked items</Link>
            <a href="https://instagram.com/lynux_espadrille" target="_blank" rel="noopener noreferrer" className="lx-drawer-social">@lynux_espadrille</a>
          </nav>
        </div>
      )}

      <style>{`
        .lx-header-wrap { position: sticky; top: 0; z-index: 50; }
        .lx-announcement {
          display: flex; justify-content: center; align-items: center; gap: 9px;
          min-height: 28px; padding: 4px 16px;
          background: #211E1B; color: #F3EEE5;
          font-size: 9px; font-weight: 600; letter-spacing: 0.08em;
        }
        .lx-header {
          display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center;
          min-height: 67px; padding: 0 clamp(24px, 7vw, 106px);
          border-bottom: 1px solid rgba(41,36,30,0.1);
          background: var(--color-sand); color: var(--color-ink);
        }
        .lx-logo { justify-self: start; display: block; }
        .lx-logo img { height: 52px; width: auto; }
        .lx-nav { display: flex; justify-content: center; gap: 30px; }
        .lx-nav a { font-size: 10px; letter-spacing: 0.02em; transition: color 0.2s ease; }
        .lx-nav a:hover, .lx-nav a.is-active { color: var(--color-clay-dark); }
        .lx-actions { display: flex; justify-content: flex-end; align-items: center; gap: 18px; }
        .lx-icon-button { display: grid; place-items: center; width: 40px; height: 40px; padding: 0; border: 0; background: transparent; cursor: pointer; color: inherit; }
        .lx-icon-button svg, .lx-liked svg, .lx-bag-icon svg, .lx-search-icon svg {
          width: 21px; height: 21px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round;
        }
        .lx-search-icon svg { width: 18px; height: 18px; }
        .lx-menu-button { display: none; }
        .lx-liked { position: relative; display: grid; place-items: center; width: 32px; height: 32px; }
        .lx-count {
          display: grid; place-items: center; width: 17px; height: 17px; border-radius: 50%;
          background: var(--color-ink); color: var(--color-cream); font-size: 9px; letter-spacing: 0;
        }
        .lx-liked-count { position: absolute; top: -1px; right: -5px; width: 15px; height: 15px; font-size: 8px; }
        .lx-bag {
          display: flex; align-items: center; gap: 7px; padding: 9px 14px;
          border: 1px solid var(--color-ink);
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .lx-bag:hover { background: var(--color-ink); color: var(--color-cream); }
        .lx-bag:hover .lx-count { background: var(--color-cream); color: var(--color-ink); }
        .lx-bag-icon { display: none; }
        .lx-search { border-bottom: 1px solid rgba(41,36,30,0.1); background: var(--color-sand); }
        .lx-drawer-backdrop { position: fixed; inset: 0; z-index: 60; background: rgba(29,27,25,0.4); }
        .lx-drawer {
          position: absolute; top: 0; left: 0; bottom: 0; width: min(300px, 82vw);
          display: flex; flex-direction: column; gap: 18px; padding: 70px 28px 28px;
          background: var(--color-sand);
        }
        .lx-drawer a { font-size: 26px; }
        .lx-drawer .lx-drawer-social { margin-top: auto; font-size: 12px; color: var(--color-ink-light); }
        .lx-drawer-close { position: absolute; top: 14px; right: 14px; }
        @media (max-width: 950px) {
          .lx-header { padding-inline: 4vw; }
          .lx-nav { gap: 20px; }
        }
        @media (max-width: 767px) {
          .lx-header { grid-template-columns: 44px 1fr auto; min-height: 62px; padding-inline: 12px; }
          .lx-menu-button { display: grid; }
          .lx-logo { justify-self: center; }
          .lx-logo img { height: 46px; }
          .lx-nav { display: none; }
          .lx-actions { gap: 6px; }
          .lx-liked { display: none; }
          .lx-bag { position: relative; padding: 0; border: 0; width: 40px; height: 40px; justify-content: center; }
          .lx-bag:hover { background: transparent; color: inherit; }
          .lx-bag-icon { display: grid; }
          .lx-bag-label { display: none; }
          .lx-bag .lx-count { position: absolute; top: 3px; right: 1px; width: 15px; height: 15px; font-size: 8px; }
        }
      `}</style>
    </div>
  )
}
