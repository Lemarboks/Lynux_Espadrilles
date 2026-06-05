import { createWriteStream, existsSync, mkdirSync, statSync, unlinkSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images')
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })
const delay = ms => new Promise(r => setTimeout(r, ms))

const images = [
  // ARIANA
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Ariana-Strips.png", filename: "ariana.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-PRODUCT-SHOTS_-38-scaled.jpg", filename: "ariana-2.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-2-15-scaled.jpg", filename: "ariana-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-LYNUX-2-scaled.jpg", filename: "ariana-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-LYNUX-2-3-scaled.jpg", filename: "ariana-5.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-XLIFESTYLE-2-scaled.jpg", filename: "ariana-6.jpg" },
  // CARNERO SLIPPER
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-12.jpg", filename: "carnero-slipper.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-11.jpg", filename: "carnero-slipper-2.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-X-CONTENT-X-FINALS-scaled.jpg", filename: "carnero-slipper-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-X-CONTRNT-X-7-scaled.jpg", filename: "carnero-slipper-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/LynettShoe1.jpg", filename: "carnero-slipper-5.jpg" },
  // FLORENCIA CERRADA
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-PRODUCT-SHOTS_-49.jpg", filename: "florencia-cerrada.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/07/lynux-espadrilles-63-of-66-scaled.jpg", filename: "florencia-cerrada-2.jpg" },
  // LUCIA WEDGE
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2025/12/Lucia-Leopard-Print.png", filename: "lucia-wedge.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2025/12/Lucia-Leopard-Print2.png", filename: "lucia-wedge-2.png" },
  // RENATA
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/LynettShoe3.jpg", filename: "renata.jpg" },
  // THE BELLA
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-14.jpg", filename: "the-bella.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-13.jpg", filename: "the-bella-2.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-15-scaled.jpg", filename: "the-bella-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-16-scaled.jpg", filename: "the-bella-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-17.jpg", filename: "the-bella-5.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-18-scaled.jpg", filename: "the-bella-6.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/LynettShoe6.jpg", filename: "the-bella-7.jpg" },
  // THE LYNUX
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/The-Lynux-Multi-Color.png", filename: "the-lynux.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/The-Lynux-Multi-Color2.png", filename: "the-lynux-2.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-5.jpg", filename: "the-lynux-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-6.jpg", filename: "the-lynux-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-7.jpg", filename: "the-lynux-5.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-X-CONTENT-X-FINALS-11-scaled.jpg", filename: "the-lynux-6.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-2-9-scaled.jpg", filename: "the-lynux-7.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-LIFESTYLE-6-scaled.jpg", filename: "the-lynux-8.jpg" },
  // THE MULE
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/the-Mule-Leopard.webp", filename: "the-mule.webp" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/NERINE-VISSER-X-PRODUCT-SHOTS_-4.jpg", filename: "the-mule-2.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/NERINE-VISSER-X-LYNUX-X-CONTENT-X-FINALS-2-scaled.jpg", filename: "the-mule-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/NERINE-VISSERR-X-LYNUX-X-CONTENT-X-FINAL-3-scaled.jpg", filename: "the-mule-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/The-Mule-Leopard-Print.webp", filename: "the-mule-5.webp" },
  // THE TINA
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-36-scaled.jpg", filename: "the-tina.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/LynettShoe4.jpg", filename: "the-tina-2.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-35-scaled.jpg", filename: "the-tina-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-34.jpg", filename: "the-tina-4.jpg" },
  // VALERIA
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Valeira-Multi-Color.png", filename: "valeria.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Valeira-Orange.png", filename: "valeria-orange.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-PRODUCT-SHOTS_-28.jpg", filename: "valeria-2.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-PRODUCT-SHOTS_-20.jpg", filename: "valeria-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-PRODUCT-SHOTS_-21-scaled.jpg", filename: "valeria-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-PRODUCT-SHOTS_-23.jpg", filename: "valeria-5.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-PRODUCT-SHOTS_-30-scaled.jpg", filename: "valeria-6.jpg" },
  // XIMERA LEATHER
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Ximera.jpg", filename: "ximera-leather.jpg" },
  // STATIC ASSETS
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/FLORENCIA-CERRADA.jpg", filename: "about-hero.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/LynettShoe2.jpg", filename: "homepage-banner.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/04/Lynux-Espadrilles-Logo-Name-removebg-preview-1-e1681983614777.png", filename: "logo.png" },
]

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
    console.log(`SUCCESS ${filename} (${(size / 1024).toFixed(1)}KB)`)
    return true
  } catch (err) {
    if (existsSync(dest)) { try { unlinkSync(dest) } catch {} }
    if (attempt < 3) { console.log(`RETRY ${filename} (attempt ${attempt + 1})`); await delay(1000); return downloadOne(url, filename, attempt + 1) }
    console.log(`FAILED ${filename} — ${err.message}`)
    return false
  }
}

let ok = 0, fail = 0
const failed = []
for (const { url, filename } of images) {
  const success = await downloadOne(url, filename)
  if (success) ok++; else { fail++; failed.push(filename) }
  await delay(300)
}
console.log(`\nDownloaded: ${ok}/${images.length} files`)
if (failed.length) { console.log('Failed:'); failed.forEach(f => console.log(' -', f)) }
