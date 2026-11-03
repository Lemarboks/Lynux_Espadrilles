'use client'

import { useMemo, useState } from 'react'
import { Product } from '@/types'
import ProductCard from './ProductCard'

const FILTERS = ['All styles', 'Sandals', 'Slippers', 'Leather']

const SORTS = {
  featured: { label: 'Featured', compare: () => 0 },
  'price-low': { label: 'Price: low to high', compare: (a: Product, b: Product) => a.price - b.price },
  'price-high': { label: 'Price: high to low', compare: (a: Product, b: Product) => b.price - a.price },
  name: { label: 'Name: A to Z', compare: (a: Product, b: Product) => a.name.localeCompare(b.name) },
} as const

type SortKey = keyof typeof SORTS

export default function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('All styles')
  const [sort, setSort] = useState<SortKey>('featured')

  const visible = useMemo(
    () => products
      .filter(p => filter === 'All styles' || p.category === filter)
      .sort(SORTS[sort].compare),
    [products, filter, sort],
  )

  return (
    <section className="lx-container font-dm">
      <div className="lx-shop-toolbar">
        <div className="lx-filter-tabs" role="group" aria-label="Filter by category">
          {FILTERS.map(f => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="lx-shop-controls">
          <span>{visible.length} {visible.length === 1 ? 'style' : 'styles'}</span>
          <label htmlFor="sort-products">Sort</label>
          <select id="sort-products" value={sort} onChange={e => setSort(e.target.value as SortKey)}>
            {Object.entries(SORTS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
      </div>

      <div className="lx-shop-grid">
        {visible.map(product => <ProductCard key={product.id} product={product} />)}
      </div>

      <style>{`
        .lx-shop-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 13px 0; border-bottom: 1px solid #DFCFC4; }
        .lx-filter-tabs { display: flex; flex-wrap: wrap; gap: 5px; }
        .lx-filter-tabs button {
          padding: 6px 13px; border: 1px solid #DFCFC4; border-radius: 30px; background: transparent;
          color: var(--color-ink); font-size: 9px; cursor: pointer;
        }
        .lx-filter-tabs button[aria-pressed="true"] { border-color: var(--color-ink); background: var(--color-ink); color: var(--color-cream); }
        .lx-shop-controls { display: flex; align-items: center; gap: 10px; color: var(--color-ink-light); font-size: 10px; white-space: nowrap; }
        .lx-shop-controls select { padding: 7px 22px 7px 9px; border: 0; background: transparent; color: var(--color-ink); font-size: 10px; }
        .lx-shop-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 31px 17px; padding: 10px 0 90px; }
        @media (max-width: 680px) {
          .lx-shop-toolbar { flex-direction: column; align-items: flex-start; gap: 10px; }
          .lx-shop-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 11px; padding-bottom: 60px; }
        }
      `}</style>
    </section>
  )
}
