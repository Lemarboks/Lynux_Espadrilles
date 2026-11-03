import Image from 'next/image'
import { img } from '@/lib/image'

const INSTAGRAM = 'https://instagram.com/lynux_espadrille'

const photos = [
  { src: '/images/instagram/1-sunhat.jpg', alt: 'Lynux espadrilles with a straw sunhat and sunglasses', position: '55% 65%' },
  { src: '/images/instagram/2-chair.jpg', alt: 'Beige bow espadrilles worn while sitting on an outdoor chair', position: 'center 68%' },
  { src: '/images/instagram/3-marina.jpg', alt: 'Model wearing Lynux espadrilles at the marina', position: 'center 30%' },
  { src: '/images/instagram/4-decking.jpg', alt: 'Brown leather espadrilles on wooden decking', position: 'center 55%' },
]

export default function InstagramStrip() {
  return (
    <section className="insta-strip font-dm">
      <div className="insta-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="insta-title" aria-label="Follow Lynux Espadrilles on Instagram">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
          </svg>
          <span>Follow us on Instagram</span>
        </a>
        <div className="insta-grid">
          {photos.map(photo => (
            <a key={photo.src} href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="insta-item" aria-label="View Lynux on Instagram">
              <Image src={img(photo.src)} alt={photo.alt} fill sizes="(max-width: 680px) 33vw, 18vw" style={{ objectFit: 'cover', objectPosition: photo.position }} />
            </a>
          ))}
        </div>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="insta-next" aria-label="See more on Instagram">→</a>
      </div>

      <style>{`
        .insta-strip { padding: 14px 0; background: #211E1B; color: #F9F2EC; }
        .insta-inner { display: grid; grid-template-columns: minmax(185px, 0.7fr) 2fr 40px; align-items: center; gap: 20px; }
        .insta-title { display: flex; align-items: center; gap: 11px; font-size: 12px; white-space: nowrap; }
        .insta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9px; }
        .insta-item { position: relative; display: block; aspect-ratio: 1.12; overflow: hidden; border-radius: 2px; background: #3A322C; }
        .insta-item img { transition: transform 0.6s ease; }
        .insta-item:hover img { transform: scale(1.035); }
        .insta-next {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border: 1px solid #F9F2EC;
          border-radius: 50%;
          font-size: 17px;
        }
        @media (max-width: 950px) {
          .insta-inner { grid-template-columns: 1fr 2fr 35px; gap: 13px; }
          .insta-grid { grid-template-columns: repeat(3, 1fr); }
          .insta-item:nth-child(4) { display: none; }
        }
        @media (max-width: 680px) {
          .insta-strip { padding: 12px 0; }
          .insta-inner { grid-template-columns: 1fr 32px; gap: 9px; }
          .insta-title { font-size: 11px; }
          .insta-grid { grid-column: 1 / -1; grid-row: 2; gap: 6px; }
          .insta-item { aspect-ratio: 1; }
          .insta-next { grid-column: 2; grid-row: 1; }
        }
      `}</style>
    </section>
  )
}
