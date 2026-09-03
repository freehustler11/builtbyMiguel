import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

export interface UploadResult {
  fileUrl: string
  provider: 's3' | 'supabase' | 'local'
  key: string
}

/**
 * Returns current active storage provider name for UI display
 */
export function getStorageProviderInfo(): { provider: 's3' | 'supabase' | 'local'; name: string } {
  if (process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
    return {
      provider: 's3',
      name: process.env.S3_ENDPOINT?.includes('r2.cloudflarestorage.com')
        ? 'Cloudflare R2'
        : 'S3-Compatible Cloud',
    }
  }

  if (process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) {
    return {
      provider: 'supabase',
      name: 'Supabase Storage',
    }
  }

  return {
    provider: 'local',
    name: 'Local Server Storage',
  }
}

/**
 * Uploads a file buffer to the configured storage backend
 */
export async function uploadFileToStorage({
  filename,
  mimeType,
  buffer,
}: {
  filename: string
  mimeType: string
  buffer: Buffer
}): Promise<UploadResult> {
  const ext = path.extname(filename).toLowerCase() || '.bin'
  const cleanBase = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^\w-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
  const uniqueId = crypto.randomBytes(6).toString('hex')
  const key = `uploads/${Date.now()}-${cleanBase || 'file'}-${uniqueId}${ext}`

  // 1. Check for Supabase Storage
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, '')
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || 'media'

  if (supabaseUrl && supabaseKey) {
    try {
      const uploadEndpoint = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/${key}`
      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': mimeType,
          'x-upsert': 'true',
        },
        body: buffer,
      })

      if (res.ok) {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/${key}`
        return { fileUrl: publicUrl, provider: 'supabase', key }
      } else {
        const errText = await res.text()
        console.warn('Supabase upload warning, falling back to local:', errText)
      }
    } catch (err) {
      console.error('Supabase upload error, falling back to local:', err)
    }
  }

  // 2. Check for S3 / Cloudflare R2
  const s3Bucket = process.env.S3_BUCKET
  const s3AccessKey = process.env.S3_ACCESS_KEY_ID
  const s3SecretKey = process.env.S3_SECRET_ACCESS_KEY
  const s3Endpoint = process.env.S3_ENDPOINT?.replace(/\/+$/, '')
  const s3PublicUrl = process.env.S3_PUBLIC_URL?.replace(/\/+$/, '')

  if (s3Bucket && s3AccessKey && s3SecretKey) {
    try {
      // If S3 credentials are provided, we can upload using standard AWS SigV4 PUT
      const region = process.env.S3_REGION || 'auto'
      const host = s3Endpoint ? new URL(s3Endpoint).host : `${s3Bucket}.s3.${region}.amazonaws.com`
      const endpointUrl = s3Endpoint
        ? `${s3Endpoint}/${s3Bucket}/${key}`
        : `https://${host}/${key}`

      const now = new Date()
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
      const dateStamp = amzDate.slice(0, 8)
      const service = 's3'

      const payloadHash = crypto.createHash('sha256').update(buffer).digest('hex')
      const canonicalUri = s3Endpoint ? `/${s3Bucket}/${key}` : `/${key}`
      const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`
      const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'

      const canonicalRequest = `PUT\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`
      const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
      const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${crypto
        .createHash('sha256')
        .update(canonicalRequest)
        .digest('hex')}`

      const kDate = crypto.createHmac('sha256', `AWS4${s3SecretKey}`).update(dateStamp).digest()
      const kRegion = crypto.createHmac('sha256', kDate).update(region).digest()
      const kService = crypto.createHmac('sha256', kRegion).update(service).digest()
      const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest()
      const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex')

      const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${s3AccessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

      const res = await fetch(endpointUrl, {
        method: 'PUT',
        headers: {
          Host: host,
          'Content-Type': mimeType,
          'x-amz-date': amzDate,
          'x-amz-content-sha256': payloadHash,
          Authorization: authorizationHeader,
        },
        body: buffer,
      })

      if (res.ok) {
        const publicUrl = s3PublicUrl ? `${s3PublicUrl}/${key}` : endpointUrl
        return { fileUrl: publicUrl, provider: 's3', key }
      } else {
        const errText = await res.text()
        console.warn('S3 upload warning, falling back to local:', errText)
      }
    } catch (err) {
      console.error('S3 upload error, falling back to local:', err)
    }
  }

  // 3. Robust Local / VPS Storage Fallback
  const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  const localFilename = path.basename(key)
  const localFilePath = path.join(uploadsDir, localFilename)
  fs.writeFileSync(localFilePath, buffer)

  const publicUrl = `/uploads/${localFilename}`
  return {
    fileUrl: publicUrl,
    provider: 'local',
    key: `uploads/${localFilename}`,
  }
}

/**
 * Deletes a file from storage
 */
export async function deleteFileFromStorage(fileUrl: string): Promise<void> {
  // If local URL (/uploads/...)
  if (fileUrl.startsWith('/uploads/')) {
    const filename = path.basename(fileUrl)
    const localFilePath = path.resolve(process.cwd(), 'public', 'uploads', filename)
    if (fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath)
      } catch (e) {
        console.warn('Could not remove local file:', e)
      }
    }
    return
  }

  // If Supabase Storage
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, '')
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET || 'media'

  if (supabaseUrl && supabaseKey && fileUrl.includes(supabaseUrl)) {
    try {
      const match = fileUrl.split(`/object/public/${supabaseBucket}/`)[1]
      if (match) {
        await fetch(`${supabaseUrl}/storage/v1/object/${supabaseBucket}/${match}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${supabaseKey}` },
        })
      }
    } catch (e) {
      console.warn('Could not delete from Supabase:', e)
    }
  }
}
