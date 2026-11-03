'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const INSTAGRAM = 'https://instagram.com/lynux_espadrille'

function Wordmark() {
  return (
    <span className="lx-wordmark">
      <span className="font-cormorant lx-wordmark-main">LYNUX</span>
      <span className="lx-wordmark-sub">ESPADRILLES</span>
    </span>
  )
}

export default function Footer() {
  const pathname = usePathname()

  // The Our story page closes with a slim brand line instead of the full footer
  if (pathname === '/about' || pathname === '/about/') {
    return (
      <footer className="lx-story-footer font-dm">
        <div className="lx-story-footer-inner">
          <Wordmark />
          <span>COMFORT IN EVERY WAY</span>
        </div>
        <style>{footerCss}</style>
      </footer>
    )
  }

  return (
    <footer className="lx-footer font-dm">
      <div className="lx-footer-main">
        <div className="lx-footer-brand">
          <Wordmark />
          <p>Luxury handmade espadrilles crafted in South Africa with French and Spanish inspiration. Comfort in every way.</p>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="lx-text-link">@lynux_espadrille ↗</a>
        </div>
        <div className="lx-footer-column">
          <h2>Explore</h2>
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/returns">Returns &amp; exchanges</Link>
        </div>
        <div className="lx-footer-column">
          <h2>Get in touch</h2>
          <a href="mailto:info@lynuxespadrilles.co.za">info@lynuxespadrilles.co.za</a>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
          <span>South Africa</span>
          <span>R65 flat-rate delivery</span>
        </div>
      </div>
      <div className="lx-footer-bottom">
        <span>© 2023–2026 Lynux Espadrilles. All rights reserved.</span>
        <span>Handcrafted in South Africa</span>
      </div>
      <style>{footerCss}</style>
    </footer>
  )
}

const footerCss = `
  .lx-wordmark { display: inline-flex; flex-direction: column; align-items: flex-start; line-height: 1; }
  .lx-wordmark-main { font-size: 26px; letter-spacing: 0.17em; }
  .lx-wordmark-sub { margin-top: 3px; font-size: 7px; font-weight: 600; letter-spacing: 0.38em; }
  .lx-footer { padding: 58px 5vw 18px; background: #211E1B; color: #F9F2EC; }
  .lx-footer-main {
    display: grid; grid-template-columns: minmax(230px, 1.5fr) 1fr 1fr; gap: 50px;
    width: min(1360px, 100%); margin: 0 auto; padding-bottom: 45px;
  }
  .lx-footer-brand > p { max-width: 350px; margin: 17px 0; color: #C8BDB4; font-size: 12px; line-height: 1.6; }
  .lx-footer-brand .lx-text-link { color: #F9F2EC; }
  .lx-footer-column { display: flex; flex-direction: column; align-items: flex-start; gap: 9px; }
  .lx-footer-column h2 { margin: 0 0 8px; font-family: var(--font-dm), sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase; }
  .lx-footer-column a, .lx-footer-column span { color: #C8BDB4; font-size: 11px; transition: color 0.2s ease; }
  .lx-footer-column a:hover { color: #FAF4EF; }
  .lx-footer-bottom {
    display: flex; justify-content: space-between; gap: 20px;
    width: min(1360px, 100%); margin: 0 auto; padding-top: 15px;
    border-top: 1px solid #4A423B; color: #C8BDB4; font-size: 9px;
  }
  .lx-story-footer { padding: 0 clamp(24px, 7vw, 100px); background: var(--color-sand); color: var(--color-ink); }
  .lx-story-footer-inner {
    display: flex; justify-content: space-between; align-items: center; gap: 20px;
    padding: 25px 0 31px; border-top: 1px solid #DFCFC4; font-size: 10px; letter-spacing: 0.2em;
  }
  @media (max-width: 680px) {
    .lx-footer-main { grid-template-columns: 1fr 1fr; gap: 32px; }
    .lx-footer-brand { grid-column: 1 / -1; }
    .lx-footer-bottom { flex-direction: column; gap: 6px; }
  }
`
