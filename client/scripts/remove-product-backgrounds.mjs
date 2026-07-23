/**
 * Remove studio white backgrounds from product photos → transparent PNG.
 * Uses edge flood-fill so white labels on packaging stay intact.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsRoot = path.resolve(__dirname, '../public/products')

const TOLERANCE = 38
const FULL_MAX = 1400
const CARD_MAX = 600

function isWhiteish(r, g, b, tolerance = TOLERANCE) {
  return 255 - r <= tolerance && 255 - g <= tolerance && 255 - b <= tolerance
}

function removeWhiteBackground(data, width, height, channels) {
  const visited = new Uint8Array(width * height)
  const queue = new Int32Array(width * height * 2)
  let head = 0
  let tail = 0

  const push = (x, y) => {
    const idx = y * width + x
    if (visited[idx]) return
    const i = idx * channels
    if (!isWhiteish(data[i], data[i + 1], data[i + 2])) return
    visited[idx] = 1
    data[i + 3] = 0
    queue[tail++] = x
    queue[tail++] = y
  }

  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }

  while (head < tail) {
    const x = queue[head++]
    const y = queue[head++]
    if (x > 0) push(x - 1, y)
    if (x < width - 1) push(x + 1, y)
    if (y > 0) push(x, y - 1)
    if (y < height - 1) push(x, y + 1)
  }
}

async function processToPng(inputPath, outputPath, maxSize) {
  let pipeline = sharp(inputPath).rotate().ensureAlpha()

  const meta = await pipeline.metadata()
  const scale = Math.min(1, maxSize / Math.max(meta.width ?? maxSize, meta.height ?? maxSize))
  if (scale < 1) {
    pipeline = pipeline.resize({
      width: Math.round((meta.width ?? maxSize) * scale),
      height: Math.round((meta.height ?? maxSize) * scale),
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true })
  const buffer = Buffer.from(data)
  removeWhiteBackground(buffer, info.width, info.height, info.channels)

  const tmp = `${outputPath}.tmp`
  await sharp(buffer, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png({ compressionLevel: 9, effort: 7 })
    .toFile(tmp)

  await fs.rename(tmp, outputPath)
}

async function main() {
  const dirs = await fs.readdir(productsRoot, { withFileTypes: true })
  let processed = 0

  for (const dir of dirs) {
    if (!dir.isDirectory() || dir.name.startsWith('_')) continue

    const folder = path.join(productsRoot, dir.name)
    const files = await fs.readdir(folder)

    for (const name of files) {
      if (!/\.(jpe?g|png)$/i.test(name) || /-card\./i.test(name)) continue

      const inputPath = path.join(folder, name)
      const ext = path.extname(name).toLowerCase()
      const base = name.slice(0, -ext.length)
      const fullOut = path.join(folder, `${base}.png`)
      const cardOut = path.join(folder, `${base}-card.png`)

      await processToPng(inputPath, fullOut, FULL_MAX)
      await processToPng(inputPath, cardOut, CARD_MAX)

      if (ext === '.jpg' || ext === '.jpeg') {
        await fs.unlink(inputPath).catch(() => {})
      }

      await fs.unlink(path.join(folder, `${base}-card.jpg`)).catch(() => {})

      processed++
      console.log(`✓ ${dir.name}/${base}.png`)
    }
  }

  console.log(`\nProcessed ${processed} product images (full + card PNG with transparency).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
