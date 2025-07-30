import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function subirImagen(filePath: string, userId: string): Promise<UploadApiResponse> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `usuarios/${userId}`,
    });
    return result;
  } catch (error: any) {
    console.error('Error detallado de Cloudinary:', error);
    throw new Error('Error al subir imagen a Cloudinary: ' + (error.message || 'Sin mensaje'));
  }
}
