import Image from 'next/image'
import { img } from '@/lib/image'

export const metadata = {
  title: 'Our story — Lynux Espadrilles',
  description: 'Learn about Lynux Espadrilles, a South African luxury handmade espadrille brand.',
}

// Curved bottom edge over the photo, as in the concept design
const CURVE_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 0Q58 6 100 100L0 100Z'/%3E%3C/svg%3E") center / 100% 100% no-repeat`

export default function AboutPage() {
  return (
    <div className="font-dm">
      <section className="lx-story">
        <div className="lx-story-copy">
          <p className="lx-story-kicker">Our story</p>
          <h1 className="font-cormorant">A journey rooted in craftsmanship.</h1>
          <p className="lx-story-intro">
            Lynux Espadrilles was born from a simple idea — to create timeless footwear that blends effortless style with exceptional craftsmanship.
          </p>
        </div>
        <div className="lx-story-image">
          <Image src={img('/images/story/orange-espadrilles.png')} alt="Orange Lynux espadrilles worn on patterned steps" fill priority sizes="(max-width: 680px) 100vw, 60vw" />
        </div>
      </section>

      <section className="lx-philosophy">
        <p className="lx-story-kicker">Our philosophy</p>
        <h2 className="font-cormorant">Comfort, beauty<br />and purpose.</h2>
        <p>We believe great design should feel effortless. Our espadrilles are made to accompany you — from sunlit escapes to everyday moments.</p>
      </section>

      <style>{`
        .lx-story { display: grid; grid-template-columns: minmax(0, 41.2%) minmax(0, 1fr); min-height: 725px; padding-left: 6.25%; }
        .lx-story-copy { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding-right: 28px; }
        .lx-story-kicker { margin: 0 0 69px; color: var(--color-ink); font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; }
        .lx-story-kicker::after { display: block; width: 80px; height: 1px; margin-top: 20px; background: #D7B69A; content: ""; }
        .lx-story-copy h1 { max-width: 330px; margin: 0; font-size: 57px; font-weight: 400; line-height: 1.02; }
        .lx-story-intro { max-width: 390px; margin: 45px 0 0; color: var(--color-ink-light); font-size: 13px; line-height: 1.8; }
        .lx-story-image { position: relative; margin-left: -14%; overflow: hidden; }
        .lx-story-image img { object-fit: cover; -webkit-mask-image: linear-gradient(to right, transparent 0, #000 26%); mask-image: linear-gradient(to right, transparent 0, #000 26%); }
        .lx-story-image::after {
          position: absolute; inset: auto -1px -1px; height: 10%; background: var(--color-sand); content: "";
          -webkit-mask: ${CURVE_MASK}; mask: ${CURVE_MASK};
        }
        .lx-philosophy { display: flex; flex-direction: column; align-items: center; padding: 72px 22px 155px; text-align: center; }
        .lx-philosophy .lx-story-kicker { margin-bottom: 0; }
        .lx-philosophy .lx-story-kicker::after { width: 118px; margin: 20px auto 0; }
        .lx-philosophy h2 { margin: 40px 0 0; font-size: 39px; font-weight: 400; line-height: 1.08; }
        .lx-philosophy > p:last-child { max-width: 440px; margin: 30px 0 0; color: var(--color-ink-light); font-size: 13px; line-height: 1.7; }
        @media (max-width: 900px) {
          .lx-story-copy h1 { font-size: 48px; }
        }
        @media (max-width: 680px) {
          .lx-story { grid-template-columns: 1fr; min-height: 0; padding: 40px 24px 0; }
          .lx-story-kicker { margin-bottom: 30px; }
          .lx-story-copy h1 { font-size: 46px; line-height: 0.96; }
          .lx-story-intro { margin-top: 24px; }
          .lx-story-image { aspect-ratio: 0.83; width: calc(100% + 48px); margin: 30px 0 0 -24px; }
          .lx-story-image img { -webkit-mask-image: none; mask-image: none; }
          .lx-philosophy { padding: 50px 22px 90px; }
        }
      `}</style>
    </div>
  )
}
