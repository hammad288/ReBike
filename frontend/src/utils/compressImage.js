/**
 * Compresses an image File using the Canvas API.
 * Resizes to maxWidth/maxHeight while maintaining aspect ratio,
 * then encodes as JPEG at the given quality (0–1).
 *
 * @param {File} file       - The image file to compress
 * @param {number} maxSize  - Maximum width OR height in pixels (default 1024)
 * @param {number} quality  - JPEG quality 0–1 (default 0.75)
 * @returns {Promise<string>} - Compressed base64 data URL
 */
const compressImage = (file, maxSize = 1024, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down if either dimension exceeds maxSize
      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Always output as JPEG for maximum compression
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = objectUrl;
  });
};

export default compressImage;
