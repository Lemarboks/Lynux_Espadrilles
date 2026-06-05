import { writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const delay = ms => new Promise(r => setTimeout(r, ms))

const pages = [
  { slug: "ariana", url: "https://lynuxespadrilles.co.za/product/ariana/" },
  { slug: "carnero-slipper", url: "https://lynuxespadrilles.co.za/product/carnero-slipper/" },
  { slug: "florencia-cerrada", url: "https://lynuxespadrilles.co.za/product/florencia-cerrada/" },
  { slug: "lucia-wedge", url: "https://lynuxespadrilles.co.za/product/lucia-wedge/" },
  { slug: "renata", url: "https://lynuxespadrilles.co.za/product/renata-2/" },
  { slug: "the-bella", url: "https://lynuxespadrilles.co.za/product/the-bella/" },
  { slug: "the-lynux", url: "https://lynuxespadrilles.co.za/product/the-lynux/" },
  { slug: "the-mule", url: "https://lynuxespadrilles.co.za/product/the-mule/" },
  { slug: "the-tina", url: "https://lynuxespadrilles.co.za/product/the-tina/" },
  { slug: "valeria", url: "https://lynuxespadrilles.co.za/product/valeria-in-white/" },
  { slug: "ximera-leather", url: "https://lynuxespadrilles.co.za/product/ximera-leather/" }
]

async function scrapePage(slug, url) {
  console.log(`\nScraping ${slug}...`)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(30000)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const html = await res.text()

    // Extract all wp-content image URLs
    const imgRegex = /https?:\/\/lynuxespadrilles\.co\.za\/wp-content\/uploads\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi
    const allImgs = [...new Set([...html.matchAll(imgRegex)].map(m => m[0]))]

    // Filter out thumbnails and keep full-size only
    const images = allImgs.filter(u =>
      !/-\d+x\d+\./.test(u) &&
      !u.includes('/plugins/') &&
      !u.includes('dummy') &&
      !u.includes('-scaled') === false || true  // keep scaled too
    ).filter(u => !/-\d+x\d+\./.test(u) && !u.includes('/plugins/') && !u.includes('dummy'))

    // Extract colours from WooCommerce select
    const colours = []

    // Method 1: select options for colour attribute
    const selectMatch = html.match(/name="attribute_pa_colo(?:u)?r"[^>]*>([\s\S]*?)<\/select>/i)
    if (selectMatch) {
      const optRegex = /<option[^>]*value="([^"]+)"[^>]*>([^<]+)<\/option>/gi
      let m
      while ((m = optRegex.exec(selectMatch[1])) !== null) {
        if (m[1] && m[1] !== '') colours.push(m[2].trim())
      }
    }

    // Method 2: look for colour swatches in variation form
    if (colours.length === 0) {
      const swatchRegex = /data-value="([^"]+)"[^>]*class="[^"]*swatch[^"]*"/gi
      let m
      while ((m = swatchRegex.exec(html)) !== null) {
        const val = m[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        if (!colours.includes(val)) colours.push(val)
      }
    }

    // Method 3: look for pa_colour in JSON variation data
    if (colours.length === 0) {
      const jsonMatch = html.match(/\"variations\":\s*(\[[\s\S]*?\])/i) ||
                        html.match(/variation_data[^=]*=\s*(\{[\s\S]*?\});/i)
      if (jsonMatch) {
        const colourInJson = [...jsonMatch[1].matchAll(/"attribute_pa_colo(?:u)?r"\s*:\s*"([^"]+)"/gi)]
        colourInJson.forEach(m => {
          const name = m[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          if (!colours.includes(name)) colours.push(name)
        })
      }
    }

    // Method 4: look for wc-variation-form data
    if (colours.length === 0) {
      const attrMatch = [...html.matchAll(/pa_colo(?:u)?r['"]\s*:\s*['"]([^'"]+)['"]/gi)]
      attrMatch.forEach(m => {
        const name = m[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        if (!colours.includes(name)) colours.push(name)
      })
    }

    console.log(`  Images found: ${images.length}`)
    console.log(`  Colours found: ${colours.length > 0 ? colours.join(', ') : 'NONE'}`)
    console.log(`  Images:`)
    images.forEach(img => console.log(`    ${img}`))

    return { slug, colours, images }
  } catch (err) {
    console.log(`  ERROR: ${err.message}`)
    return { slug, colours: [], images: [], error: err.message }
  }
}

const results = []
for (const { slug, url } of pages) {
  const data = await scrapePage(slug, url)
  results.push(data)
  await delay(500)
}

const outputPath = path.join(__dirname, 'scraped-data.json')
writeFileSync(outputPath, JSON.stringify(results, null, 2))
console.log(`\nSaved to scripts/scraped-data.json`)
console.log(`\n=== SUMMARY ===`)
results.forEach(r => {
  console.log(`${r.slug}: ${r.colours.length} colours, ${r.images.length} images`)
})
