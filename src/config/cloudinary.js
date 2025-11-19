export const CLOUDINARY_CLOUD_NAME = "dlx7f7t2x";
export const CLOUDINARY_UPLOAD_PRESET = "uploads";

export const CLOUDINARY_IMAGE_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const CLOUDINARY_VIDEO_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

// General URL (for images)
export const CLOUDINARY_URL = CLOUDINARY_IMAGE_URL;

// Updated limits
export const VIDEO_MAX_DURATION = 16; // seconds
export const VIDEO_MAX_SIZE = 20 * 1024 * 1024; // 20MB for safety
export const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Configuration validation
console.log('Cloudinary Config:', {
  cloudName: CLOUDINARY_CLOUD_NAME,
  preset: CLOUDINARY_UPLOAD_PRESET,
  videoUrl: CLOUDINARY_VIDEO_URL
});