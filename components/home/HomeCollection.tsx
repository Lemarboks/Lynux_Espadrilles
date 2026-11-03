import Link from 'next/link'
import ProductCard from '@/components/shop/ProductCard'
import { products } from '@/lib/products'

export default function HomeCollection() {
  return (
    <section className="home-collection">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-cormorant text-ink text-center home-collection-title">Our Collection</h2>
        <div className="home-collection-grid">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex justify-center home-collection-more">
          <Link href="/shop" className="font-dm lx-button lx-button-outline">
            View all styles <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <style>{`
        .home-collection { padding: 44px 0 48px; }
        .home-collection-title { margin: 0 0 21px; font-size: 39px; font-weight: 400; line-height: 1.08; }
        .home-collection-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 26px 15px; }
        .home-collection-more { margin-top: 20px; }
        .home-collection-more .lx-button { min-width: 130px; min-height: 34px; }
        @media (max-width: 950px) {
          .home-collection-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 680px) {
          .home-collection { padding: 33px 0 36px; }
          .home-collection-title { font-size: 34px; }
          .home-collection-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 11px; }
        }
      `}</style>
    </section>
  )
}
