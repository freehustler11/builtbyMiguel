import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const logoBlackPath = path.resolve(rootDir, 'public', 'logo-black.png')
const icoPath = path.resolve(rootDir, 'public', 'favicon.ico')

// Read existing logo-black.png to package into valid ICO format
if (fs.existsSync(logoBlackPath)) {
  const pngBuffer = fs.readFileSync(logoBlackPath)
  
  // Create ICO header (6 bytes) + Directory Entry (16 bytes) + PNG Payload
  const icoHeader = Buffer.alloc(6)
  icoHeader.writeUInt16LE(0, 0) // Reserved
  icoHeader.writeUInt16LE(1, 2) // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4) // Number of images = 1

  const dirEntry = Buffer.alloc(16)
  dirEntry.writeUInt8(0, 0) // Width 0 = 256 or custom
  dirEntry.writeUInt8(0, 1) // Height 0 = 256 or custom
  dirEntry.writeUInt8(0, 2) // Color count
  dirEntry.writeUInt8(0, 3) // Reserved
  dirEntry.writeUInt16LE(1, 4) // Color planes
  dirEntry.writeUInt16LE(32, 6) // Bits per pixel
  dirEntry.writeUInt32LE(pngBuffer.length, 8) // Size of image data
  dirEntry.writeUInt32LE(22, 12) // Offset of image data (6 + 16 = 22)

  const icoBuffer = Buffer.concat([icoHeader, dirEntry, pngBuffer])
  fs.writeFileSync(icoPath, icoBuffer)
  console.log('✓ Successfully created public/favicon.ico')
}
