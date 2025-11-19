import { CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET } from "./cloudinary";

export const uploadImageToCloudinary = async (uri) => {
  try {
    const data = new FormData();

    data.append("file", {
      uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: data,
    });

    const file = await res.json();
    return file.secure_url;
  } catch (error) {
    console.log("Error al subir imagen:", error);
    return null;
  }
};