import { put } from '@vercel/blob'

/**
 * Upload photo bytes to Vercel Blob under a stable path.
 * Returns the public URL.
 */
export async function uploadPhotoToBlob(
  beachId: string,
  photoIndex: number,
  bytes: ArrayBuffer
): Promise<string> {
  const pathname = `beaches/${beachId}/photo-${photoIndex}.jpg`
  const blob = await put(pathname, bytes, {
    access: 'public',
    contentType: 'image/jpeg',
    addRandomSuffix: false, // stable URL so we can overwrite on refresh
  })
  return blob.url
}
