import Image from 'next/image'
import Link from 'next/link'
import { img } from '@/lib/image'

// Full-width lifestyle photo with the copy over a warm wash, as in the Lynux concept homepage
export default function Hero() {
  return (
    <section className="home-hero">
      <Image
        src={img('/images/1000038200.jpg')}
        alt="Lynux espadrilles lifestyle"
        fill
        priority
        sizes="100vw"
        className="home-hero-image"
      />
      <div className="home-hero-wash" aria-hidden />

      <div className="home-hero-copy">
        <p className="font-dm home-hero-eyebrow">Handcrafted in South Africa</p>
        <h1 className="font-cormorant text-ink">
          Timeless Style.<br />Effortless Comfort.
        </h1>
        <p className="font-dm home-hero-text">Handcrafted espadrilles for every step of your journey.</p>
        <Link href="/shop" className="font-dm home-button">
          Shop the collection <span aria-hidden>→</span>
        </Link>
      </div>

      <style>{`
        .home-hero {
          position: relative;
          margin-top: 64px;
          height: clamp(430px, 38vw, 555px);
          overflow: hidden;
          background: #B99277;
        }
        @media (min-width: 1024px) { .home-hero { margin-top: 80px; } }
        .home-hero-image { object-fit: cover; object-position: center 53%; }
        .home-hero-wash {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(226,194,171,0.72) 0%, rgba(226,194,171,0.45) 34%, rgba(226,194,171,0.04) 70%),
            linear-gradient(0deg, rgba(39,29,23,0.12), transparent 35%);
        }
        .home-hero-copy {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          width: min(660px, 56%);
          height: 100%;
          padding: 45px 0 45px clamp(36px, 7vw, 105px);
        }
        .home-hero-eyebrow {
          margin: 0 0 14px;
          color: #553D2E;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.13em;
        }
        .home-hero-copy h1 {
          margin: 0;
          max-width: 600px;
          font-size: 57px;
          font-weight: 400;
          line-height: 0.96;
        }
        .home-hero-text {
          max-width: 330px;
          margin: 15px 0 19px;
          color: #29211C;
          font-size: 14px;
        }
        @media (min-width: 1440px) {
          .home-hero { height: 555px; }
          .home-hero-copy h1 { font-size: 61px; }
        }
        @media (max-width: 950px) {
          .home-hero { height: 475px; }
          .home-hero-copy { width: 59%; }
          .home-hero-copy h1 { font-size: 51px; }
        }
        @media (max-width: 680px) {
          .home-hero { height: 570px; }
          .home-hero-image { object-position: 58% center; }
          .home-hero-wash {
            background: linear-gradient(0deg, rgba(222,188,164,0.92), rgba(222,188,164,0.72) 32%, rgba(222,188,164,0.04) 78%);
          }
          .home-hero-copy {
            position: absolute;
            inset: auto 0 0;
            width: 100%;
            height: auto;
            padding: 27px 24px 30px;
          }
          .home-hero-eyebrow { margin-bottom: 7px; }
          .home-hero-copy h1 { max-width: 370px; font-size: 46px; }
          .home-hero-text { max-width: 290px; margin: 10px 0 14px; font-size: 12px; }
        }
      `}</style>
    </section>
  )
}
