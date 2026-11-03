import Link from 'next/link'

export const metadata = {
  title: 'Contact — Lynux Espadrilles',
  description: 'Get in touch with Lynux Espadrilles about a style, an order or an exchange.',
}

const EMAIL = 'info@lynuxespadrilles.co.za'
const INSTAGRAM = 'https://instagram.com/lynux_espadrille'

export default function ContactPage() {
  return (
    <div className="font-dm">
      <section className="lx-banner">
        <h1 className="lx-page-title text-ink">Get in touch</h1>
        <p>Contact Lynux Espadrilles</p>
      </section>

      <section className="lx-contact lx-container">
        <div className="lx-contact-copy">
          <p className="lx-eyebrow">Contact</p>
          <h2 className="font-cormorant">We&rsquo;re here to help.</h2>
          <p>For questions about a style, an order, or an exchange, contact Lynux through one of the channels below.</p>
          <a href={`mailto:${EMAIL}`} className="lx-button">Email Lynux <span aria-hidden>→</span></a>
        </div>

        <div className="lx-contact-methods">
          <a href={`mailto:${EMAIL}`} className="lx-contact-row">
            <span className="lx-contact-label">Email</span>
            <span>{EMAIL}</span>
            <span aria-hidden>↗</span>
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="lx-contact-row">
            <span className="lx-contact-label">Instagram</span>
            <span>@lynux_espadrille</span>
            <span aria-hidden>↗</span>
          </a>
          <div className="lx-contact-row lx-contact-service">
            <span className="lx-contact-label">Delivery</span>
            <span>R65 flat-rate delivery</span>
            <span className="lx-contact-sub">South Africa</span>
          </div>
          <div className="lx-contact-row lx-contact-service">
            <span className="lx-contact-label">Returns &amp; exchanges</span>
            <span>Free exchange for manufacturing defects.</span>
            <Link href="/returns" className="lx-contact-sub lx-text-link">Read the policy ↗</Link>
          </div>
        </div>
      </section>

      <style>{`
        .lx-contact { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr); gap: clamp(35px, 8vw, 110px); padding-top: 55px; padding-bottom: 85px; }
        .lx-contact-copy h2 { max-width: 430px; margin: 0; font-size: 48px; font-weight: 400; line-height: 1.05; }
        .lx-contact-copy > p:not(.lx-eyebrow) { max-width: 380px; margin: 16px 0 22px; color: var(--color-ink-light); font-size: 13px; }
        .lx-contact-methods { border-top: 1px solid #DFCFC4; }
        .lx-contact-row {
          display: grid; grid-template-columns: 140px minmax(0, 1fr) 22px; align-items: center; gap: 12px;
          min-height: 64px; padding: 13px 0; border-bottom: 1px solid #DFCFC4; font-size: 12px;
        }
        .lx-contact-row > span[aria-hidden] { justify-self: end; font-size: 15px; }
        .lx-contact-label { color: var(--color-ink-light); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; }
        .lx-contact-service { grid-template-columns: 140px minmax(0, 1fr); align-items: start; }
        .lx-contact-service > .lx-contact-sub { grid-column: 2; justify-self: start; color: var(--color-ink-light); font-size: 11px; }
        @media (max-width: 800px) {
          .lx-contact { grid-template-columns: 1fr; padding-top: 35px; padding-bottom: 60px; }
          .lx-contact-copy h2 { font-size: 40px; }
        }
        @media (max-width: 480px) {
          .lx-contact-row { grid-template-columns: 100px minmax(0, 1fr) 18px; }
          .lx-contact-service { grid-template-columns: 100px minmax(0, 1fr); }
        }
      `}</style>
    </div>
  )
}
