import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function generateSignedUploadUrl(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder,
  }
}

export async function uploadImage(
  imageData: string,
  options?: { folder?: string; public_id?: string }
) {
  const result = await cloudinary.uploader.upload(imageData, {
    folder: options?.folder,
    public_id: options?.public_id,
    overwrite: true,
  })
  return result
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId)
}

export function getOptimizedUrl(publicId: string, options?: { width?: number; height?: number; quality?: number }) {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: options?.quality ?? 'auto',
    width: options?.width,
    height: options?.height,
    crop: options?.width || options?.height ? 'fill' : undefined,
  })
}
