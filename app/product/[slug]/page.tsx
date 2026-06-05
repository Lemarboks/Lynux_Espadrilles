import { getAllProducts } from '@/lib/products'
import ProductPageClient from '@/components/product/ProductPageClient'

export async function generateStaticParams() {
  return getAllProducts().map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProductPageClient slug={slug} />
}
