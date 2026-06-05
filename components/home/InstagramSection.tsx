import Image from 'next/image'

const instagramImages = [
  { src: '/images/the-lynux-6.jpg', alt: 'Lynux lifestyle' },
  { src: '/images/the-lynux-7.jpg', alt: 'Lynux lifestyle' },
  { src: '/images/the-mule-3.jpg', alt: 'The Mule lifestyle' },
  { src: '/images/the-mule-4.jpg', alt: 'The Mule lifestyle' },
]

export default function InstagramSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-cormorant font-semibold text-4xl lg:text-5xl text-ink mb-3">
            Follow Our Journey
          </h2>
          <a
            href="https://instagram.com/lynux_espadrille"
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm text-sm text-clay hover:text-clay-dark transition-colors duration-200 tracking-wide"
          >
            @lynux_espadrille
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {instagramImages.map(({ src, alt }, i) => (
            <a
              key={i}
              href="https://instagram.com/lynux_espadrille"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden block"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-all duration-300 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="white"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://instagram.com/lynux_espadrille"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-dm text-sm font-medium border border-ink text-ink hover:bg-ink hover:text-cream px-8 py-3.5 transition-all duration-300 tracking-wide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
            </svg>
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
