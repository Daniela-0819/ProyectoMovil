import {
  CLOUDINARY_IMAGE_URL,
  CLOUDINARY_VIDEO_URL,
  CLOUDINARY_UPLOAD_PRESET,
  VIDEO_MAX_DURATION,
} from './cloudinary';

// Upload Image
export const uploadImageToCloudinary = async uri => {
  try {
    const data = new FormData();
    data.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_IMAGE_URL, {
      method: 'POST',
      body: data,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const file = await res.json();
    return file.secure_url;
  } catch (error) {
    console.log('Error al subir imagen:', error);
    return null;
  }
};

// upload video (16-second limit)
export const uploadVideoToCloudinary = async (uri, duration) => {
  try {
    console.log('=== INICIO SUBIDA VIDEO ===');
    console.log('URI:', uri);
    console.log('Duration:', duration);
    console.log('Preset:', CLOUDINARY_UPLOAD_PRESET);
    console.log('URL:', CLOUDINARY_VIDEO_URL);

    const data = new FormData();

    // Format for React Native
    const file = {
      uri: uri,
      type: 'video/mp4',
      name: `video_${Date.now()}.mp4`,
    };

    console.log('File object:', file);

    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    console.log('Enviando petición a Cloudinary...');

    const res = await fetch(CLOUDINARY_VIDEO_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: data,
    });

    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);

    const responseText = await res.text();
    console.log('Response text:', responseText);

    if (!res.ok) {
      console.error('ERROR - Status:', res.status);
      console.error('ERROR - Response:', responseText);

      // Try parsing the error
      try {
        const errorJson = JSON.parse(responseText);
        throw new Error(`Cloudinary error: ${errorJson.error?.message || responseText}`);
      } catch (e) {
        throw new Error(`Upload failed with status ${res.status}: ${responseText}`);
      }
    }

    const file_response = JSON.parse(responseText);
    console.log('Upload exitoso:', file_response);

    // Get the actual duration of the uploaded video
    const actualDuration = file_response.duration || duration || 0;

    return {
      url: file_response.secure_url,
      duration: actualDuration,
      publicId: file_response.public_id,
      format: file_response.format,
    };
  } catch (error) {
    console.error('=== ERROR SUBIDA VIDEO ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    throw error;
  }
};
