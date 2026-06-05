const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function img(src: string): string {
  if (!src) return src
  if (src.startsWith('http') || src.startsWith('//')) return src
  return `${BASE_PATH}${src}`
}
