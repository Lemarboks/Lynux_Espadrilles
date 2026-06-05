'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getAllProducts } from '@/lib/products'
import ProductCard from '@/components/shop/ProductCard'

const SCROLL_BY = 304 // 280px card + 24px gap

export default function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })
  const didDrag = useRef(false)

  const products = getAllProducts()

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
  }, [updateArrows])

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -SCROLL_BY, behavior: 'smooth' })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: SCROLL_BY, behavior: 'smooth' })

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    setIsDragging(true)
    didDrag.current = false
    dragStart.current = { x: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const el = scrollRef.current
    if (!el) return
    const dx = (e.pageX - el.offsetLeft) - dragStart.current.x
    if (Math.abs(dx) > 4) didDrag.current = true
    el.scrollLeft = dragStart.current.scrollLeft - dx
  }
  const onMouseUp = () => setIsDragging(false)

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-dm text-xs tracking-[0.25em] uppercase text-clay font-medium mb-3">
            Curated for you
          </p>
          <h2 className="font-cormorant font-semibold text-4xl lg:text-5xl text-ink mb-4">
            Featured Collection
          </h2>
          <p className="font-dm text-base text-ink-light max-w-md mx-auto">
            Handcrafted with love, designed for you
          </p>
        </div>
      </div>

      {/* Scroll row */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll left"
          style={{
            position: 'absolute', left: 12, top: '45%', transform: 'translateY(-50%)',
            width: 48, height: 48, borderRadius: '50%',
            background: '#C8A97E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, border: 'none', cursor: canScrollLeft ? 'pointer' : 'default',
            opacity: canScrollLeft ? 1 : 0.3,
            transition: 'opacity 200ms ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={scrollRight}
          aria-label="Scroll right"
          style={{
            position: 'absolute', right: 12, top: '45%', transform: 'translateY(-50%)',
            width: 48, height: 48, borderRadius: '50%',
            background: '#C8A97E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, border: 'none', cursor: canScrollRight ? 'pointer' : 'default',
            opacity: canScrollRight ? 1 : 0.3,
            transition: 'opacity 200ms ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{
            display: 'flex',
            gap: 24,
            overflowX: 'auto',
            paddingLeft: 48,
            paddingRight: 48,
            paddingBottom: 16,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            scrollbarWidth: 'thin',
            scrollbarColor: '#C8A97E #F5F0E8',
          }}
          className="featured-scroll"
        >
          {products.map(product => (
            <div
              key={product.id}
              style={{ flexShrink: 0, width: 280 }}
              onClick={e => { if (didDrag.current) e.preventDefault() }}
            >
              <ProductCard product={product} imageHeight={320} />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-center">
        <Link
          href="/shop"
          className="inline-block font-dm text-sm font-medium border border-ink text-ink hover:bg-ink hover:text-cream px-10 py-3.5 transition-all duration-300 tracking-wide"
        >
          View All
        </Link>
      </div>

      <style>{`
        .featured-scroll::-webkit-scrollbar { height: 4px; }
        .featured-scroll::-webkit-scrollbar-track { background: #F5F0E8; }
        .featured-scroll::-webkit-scrollbar-thumb { background: #C8A97E; border-radius: 2px; }
      `}</style>
    </section>
  )
}
