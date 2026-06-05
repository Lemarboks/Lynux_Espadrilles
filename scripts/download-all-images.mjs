import { createWriteStream, existsSync, mkdirSync, statSync, unlinkSync, readFileSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images')
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })
const delay = ms => new Promise(r => setTimeout(r, ms))

// Known images with fixed filenames
const knownImages = [
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Ariana-Strips.png", filename: "ariana.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-12.jpg", filename: "carnero-slipper.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-PRODUCT-SHOTS_-49.jpg", filename: "florencia-cerrada.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2025/12/Lucia-Leopard-Print.png", filename: "lucia-wedge.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/LynettShoe3-800x800.jpg", filename: "renata.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-14.jpg", filename: "the-bella.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/The-Lynux-Multi-Color.png", filename: "the-lynux.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/The-Lynux-Multi-Color2.png", filename: "the-lynux-2.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-5.jpg", filename: "the-lynux-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-6.jpg", filename: "the-lynux-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-7.jpg", filename: "the-lynux-5.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-X-CONTENT-X-FINALS-11-scaled.jpg", filename: "the-lynux-6.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-2-9-scaled.jpg", filename: "the-lynux-7.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-LIFESTYLE-6-scaled.jpg", filename: "the-lynux-8.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/the-Mule-Leopard.webp", filename: "the-mule.webp" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/NERINE-VISSER-X-PRODUCT-SHOTS_-4.jpg", filename: "the-mule-2.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/NERINE-VISSER-X-LYNUX-X-CONTENT-X-FINALS-2-scaled.jpg", filename: "the-mule-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/NERINE-VISSERR-X-LYNUX-X-CONTENT-X-FINAL-3-scaled.jpg", filename: "the-mule-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/The-Mule-Leopard-Print.webp", filename: "the-mule-5.webp" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-36-scaled.jpg", filename: "the-tina.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Valeira-Multi-Color.png", filename: "valeria.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Ximera-800x800.jpg", filename: "ximera-leather.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/FLORENCIA-CERRADA.jpg", filename: "about-hero.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/LynettShoe2.jpg", filename: "homepage-banner.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/04/Lynux-Espadrilles-Logo-Name-removebg-preview-1-e1681983614777.png", filename: "logo.png" },
]

// Additional scraped images
const scraped = JSON.parse(readFileSync(path.join(__dirname, 'scraped-data.json'), 'utf8'))
const scrapedImages = []
for (const product of scraped) {
  product.images.forEach((url, i) => {
    const ext = url.match(/\.(jpg|jpeg|png|webp)$/i)?.[1] || 'jpg'
    scrapedImages.push({ url, filename: `${product.slug}-scraped-${i+1}.${ext}` })
  })
}

const allImages = [...knownImages]
// Add scraped images that aren't already covered
for (const img of scrapedImages) {
  if (!allImages.some(k => k.url === img.url)) {
    allImages.push(img)
  }
}

async function downloadOne(url, filename, attempt = 1) {
  const dest = path.join(OUTPUT_DIR, filename)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const ws = createWriteStream(dest)
    await pipeline(res.body, ws)
    const size = statSync(dest).size
    if (size === 0) { unlinkSync(dest); throw new Error('0 bytes') }
    console.log(`SUCCESS ${filename} (${(size/1024).toFixed(1)}KB)`)
    return true
  } catch (err) {
    if (existsSync(dest)) { try { unlinkSync(dest) } catch {} }
    if (attempt < 3) { await delay(1000); return downloadOne(url, filename, attempt + 1) }
    console.log(`FAILED ${filename} — ${err.message}`)
    return false
  }
}

let ok = 0, fail = 0, failed = []
for (const { url, filename } of allImages) {
  const success = await downloadOne(url, filename)
  if (success) ok++; else { fail++; failed.push(filename) }
  await delay(300)
}

console.log(`\nDownloaded: ${ok}/${allImages.length}`)
if (failed.length) { console.log('Failed:'); failed.forEach(f => console.log(' -', f)) }
