import { v2 } from 'cloudinary';

const cloudinary = v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handleUpload(file: string) {
  const res = await cloudinary.uploader.upload(file, { resource_type: 'auto' });
  return res;
}

export async function handleDelete(public_id: string) {
  const res = await cloudinary.uploader.destroy(public_id);
  return res;
}
