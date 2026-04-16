import { createId } from './ids'
import type { VehiclePhoto } from '../types/app'

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error(`Could not read file: ${file.name}`))
    reader.readAsDataURL(file)
  })
}

export async function fileListToVehiclePhotos(fileList: FileList | null) {
  if (!fileList || fileList.length === 0) {
    return [] as VehiclePhoto[]
  }

  const files = Array.from(fileList)
  const photos = await Promise.all(
    files.map(async (file, index) => ({
      id: createId(),
      name: file.name,
      dataUrl: await readAsDataUrl(file),
      isPrimary: index === 0,
    })),
  )

  return photos
}
