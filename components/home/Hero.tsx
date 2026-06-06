'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { img } from '@/lib/image'

const heroSlides = [
  { src: "/images/the-lynux.png",         name: "The Lynux",        price: "From R1,099.00", slug: "the-lynux",        tagline: "Shoes made",      taglineItalic: "for every",  taglineEnd: "occasion"  },
  { src: "/images/the-mule-3.jpg",        name: "The Mule",         price: "From R1,299.00", slug: "the-mule",         tagline: "Step into",       taglineItalic: "effortless", taglineEnd: "style"     },
  { src: "/images/florencia-cerrada.jpg", name: "Florencia Cerrada",price: "From R1,499.00", slug: "florencia-cerrada",tagline: "Closed toe,",     taglineItalic: "open",       taglineEnd: "heart"     },
  { src: "/images/lucia-wedge.png",       name: "Lucia Wedge",      price: "From R1,299.00", slug: "lucia-wedge",      tagline: "Elevate",         taglineItalic: "every",      taglineEnd: "step"      },
  { src: "/images/the-bella.jpg",         name: "The Bella",        price: "From R999.00",   slug: "the-bella",        tagline: "Crafted",         taglineItalic: "with",       taglineEnd: "love"      },
  { src: "/images/valeria.png",           name: "Valeria",          price: "From R1,099.00", slug: "valeria",          tagline: "Made",            taglineItalic: "just",       taglineEnd: "for you"   },
  { src: "/images/ariana.png",            name: "Ariana",           price: "From R1,099.00", slug: "ariana",           tagline: "Bold colours,",   taglineItalic: "gentle",     taglineEnd: "comfort"   },
  { src: "/images/carnero-slipper.jpg",   name: "Carnero Slipper",  price: "From R1,299.00", slug: "carnero-slipper",  tagline: "Wrap your feet",  taglineItalic: "in pure",    taglineEnd: "softness"  },
  { src: "/images/1000038200.jpg",        name: "The Lynux",        price: "From R1,099.00", slug: "the-lynux",        tagline: "Born for",        taglineItalic: "sun &",      taglineEnd: "sea"       },
  { src: "/images/1000038203.jpg",        name: "The Bella",        price: "From R999.00",   slug: "the-bella",        tagline: "Tied with",       taglineItalic: "intention,", taglineEnd: "worn with love" },
]

const INTERVAL = 4000
const FADE_DURATION = 800
const HERO_VIDEO = '/videos/lynnux-hero.mp4'

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [badgeVisible, setBadgeVisible] = useState(true)
  const [taglineA, setTaglineA] = useState(heroSlides[0])
  const [taglineB, setTaglineB] = useState(heroSlides[1 % heroSlides.length])
  const [activeLayer, setActiveLayer] = useState<'a' | 'b'>('a')
  const [hovered, setHovered] = useState(false)
  const [arrowsVisible, setArrowsVisible] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transitioningRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const goToSlide = useCallback((index: number) => {
    if (transitioningRef.current || index === currentIndex) return
    transitioningRef.current = true
    setTransitioning(true)
    setNextIndex(index)
    setBadgeVisible(false)
    // Load incoming tagline into the inactive layer, then swap — simultaneous crossfade
    if (activeLayer === 'a') {
      setTaglineB(heroSlides[index])
      setActiveLayer('b')
    } else {
      setTaglineA(heroSlides[index])
      setActiveLayer('a')
    }
    setTimeout(() => {
      setCurrentIndex(index)
      setNextIndex(null)
      setTransitioning(false)
      transitioningRef.current = false
      setBadgeVisible(true)
    }, FADE_DURATION)
  }, [currentIndex, activeLayer])

  const advance = useCallback(() => {
    goToSlide((currentIndex + 1) % heroSlides.length)
  }, [currentIndex, goToSlide])

  const goBack = useCallback(() => {
    goToSlide((currentIndex - 1 + heroSlides.length) % heroSlides.length)
  }, [currentIndex, goToSlide])

  useEffect(() => {
    if (hovered) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(advance, INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [hovered, advance])

  const current = heroSlides[currentIndex]
  const next = nextIndex !== null ? heroSlides[nextIndex] : null

  return (
    <section
      className="home-hero"
      style={{
        display: 'flex',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#FDFCF9',
        position: 'relative',
        isolation: 'isolate',
      }}
    >
      <div className="hero-video-layer" aria-hidden>
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={img(HERO_VIDEO)} type="video/mp4" />
        </video>
        <div className="hero-video-wash" />
      </div>

      {/* ── Left panel ── */}
      <div
        className="hero-left"
        style={{
          flex: '0 0 50%',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 80,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{
            padding: '0 clamp(24px, 6vw, 80px)',
            width: '100%',
          }}
        >
          <p className="font-dm text-xs tracking-[0.25em] uppercase text-clay font-medium mb-6">
            Handcrafted in South Africa
          </p>

          {/* Dynamic tagline — dual-layer crossfade */}
          <div className="relative mb-6">
            {/* Invisible spacer using the longest possible tagline to reserve height */}
            <h1
              className="font-cormorant font-semibold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[1.05] invisible pointer-events-none"
              aria-hidden
            >
              Wrap your feet<br />
              <span className="italic">in pure</span><br />
              softness
            </h1>
            {(['a', 'b'] as const).map(layer => {
              const slide = layer === 'a' ? taglineA : taglineB
              const isActive = activeLayer === layer
              return (
                <h1
                  key={layer}
                  className="font-cormorant font-semibold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[1.05]"
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%',
                    opacity: isActive ? 1 : 0,
                    transition: `opacity 600ms ease-in-out`,
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                >
                  {slide.tagline}<br />
                  <span className="italic" style={{ color: '#C8A97E' }}>{slide.taglineItalic}</span><br />
                  {slide.taglineEnd}
                </h1>
              )
            })}
          </div>

          <p className="font-dm text-base lg:text-lg text-ink-light leading-relaxed mb-10 max-w-md">
            Luxury espadrilles handcrafted with French and Spanish inspiration. Comfort in every way.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-block font-dm text-sm font-medium bg-clay hover:bg-clay-dark text-cream px-8 py-3.5 transition-all duration-300 tracking-wide"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="inline-block font-dm text-sm font-medium border border-ink text-ink hover:bg-ink hover:text-cream px-8 py-3.5 transition-all duration-300 tracking-wide"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div
        className={`hero-right transition-all duration-700 delay-200 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ flex: '0 0 50%', position: 'relative', overflow: 'hidden', zIndex: 1 }}
        onMouseEnter={() => { setHovered(true); setArrowsVisible(true) }}
        onMouseLeave={() => { setHovered(false); setArrowsVisible(false) }}
      >
        <div className="hero-product-frame">
          <div className="hero-product-image">
            <Image
              src={img(current.src)}
              alt={current.name}
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 1023px) 68vw, 30vw"
              style={{
                opacity: transitioning ? 0 : 1,
                transition: `opacity ${FADE_DURATION}ms ease-in-out`,
              }}
            />

            {next && (
              <Image
                src={img(next.src)}
                alt={next.name}
                fill
                className="object-contain object-center"
                sizes="(max-width: 1023px) 68vw, 30vw"
                style={{
                  opacity: transitioning ? 1 : 0,
                  transition: `opacity ${FADE_DURATION}ms ease-in-out`,
                }}
              />
            )}
          </div>

          <div className="hero-product-footer">
            <Link href={`/product/${current.slug}`}
              style={{
                opacity: badgeVisible ? 1 : 0,
                transition: 'opacity 300ms ease',
                textDecoration: 'none',
                display: 'block',
              }}>
              <p className="font-dm text-[9px] tracking-[0.12em] uppercase text-ink-light">Now Viewing</p>
              <p className="font-cormorant font-semibold text-base text-ink leading-tight">{current.name}</p>
              <p className="font-dm text-[11px] text-ink-mid">{current.price}</p>
            </Link>

            <div className="hero-cycle-dots">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => goToSlide(i)} aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: i === currentIndex ? 9 : 6,
                    height: i === currentIndex ? 9 : 6,
                    borderRadius: '50%',
                    background: i === currentIndex ? '#C8A97E' : 'rgba(28,26,23,0.26)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 300ms ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Left arrow */}
        <button onClick={e => { e.preventDefault(); goBack() }} aria-label="Previous slide"
          style={{
            position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(28,26,23,0.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: arrowsVisible ? 1 : 0, transition: 'opacity 250ms ease',
            zIndex: 10, border: 'none', cursor: 'pointer',
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        {/* Right arrow */}
        <button onClick={e => { e.preventDefault(); advance() }} aria-label="Next slide"
          style={{
            position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(28,26,23,0.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: arrowsVisible ? 1 : 0, transition: 'opacity 250ms ease',
            zIndex: 10, border: 'none', cursor: 'pointer',
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

      </div>

      {/* Mobile / responsive styles */}
      <style>{`
        .hero-video-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: #FDFCF9;
        }
        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.82;
        }
        .hero-video-wash {
          display: none;
        }
        .hero-product-frame {
          position: absolute;
          left: 50%;
          top: 52%;
          width: min(68%, 430px);
          aspect-ratio: 4 / 5;
          transform: translate(-50%, -50%);
          z-index: 8;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.34);
          background: rgba(253,252,249,0.18);
          box-shadow: 0 18px 42px rgba(28,26,23,0.16);
        }
        .hero-product-image {
          position: absolute;
          inset: 4% 5% 22%;
        }
        .hero-product-footer {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          min-height: 58px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 12px;
          padding: 9px 10px;
          border-radius: 7px;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(200,169,126,0.18);
        }
        .hero-cycle-dots {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          max-width: 112px;
          flex-wrap: wrap;
          padding-bottom: 3px;
        }
        @media (max-width: 1023px) {
          .home-hero { flex-direction: column; }
          .hero-left { flex: none !important; width: 100% !important; padding-top: 80px !important; padding-bottom: 32px !important; }
          .hero-right { flex: none !important; width: 100% !important; height: 60vw !important; min-height: 280px !important; }
          .hero-blend { display: none !important; }
          .hero-product-frame {
            width: min(72vw, 320px);
            top: 50%;
            aspect-ratio: 5 / 4;
          }
          .hero-product-image {
            inset: 5% 5% 27%;
          }
          .hero-product-footer {
            min-height: 52px;
            padding: 7px 8px;
          }
          .hero-video {
            opacity: 0.72;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0ms !important; animation-duration: 0ms !important; }
          .hero-video { display: none; }
        }
      `}</style>
    </section>
  )
}
