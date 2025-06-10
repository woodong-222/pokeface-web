interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

export const compressImage = (
  file: File,
  options: CompressOptions = {}
): Promise<File> => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.6,
    maxSizeKB = 128
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Image compression failed'));
            return;
          }

          const sizeKB = blob.size / 1024;
          console.log(`압축 결과: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(sizeKB / 1024).toFixed(2)}MB`);

          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

export const getFileSizeInfo = (file: File) => {
  const sizeKB = file.size / 1024;
  const sizeMB = sizeKB / 1024;
  
  return {
    bytes: file.size,
    kb: Math.round(sizeKB * 100) / 100,
    mb: Math.round(sizeMB * 100) / 100,
    formatted: sizeMB > 1 ? `${sizeMB.toFixed(1)}MB` : `${sizeKB.toFixed(0)}KB`
  };
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'JPEG, PNG, WebP 형식만 지원됩니다.' };
  }

  const maxSize = 20 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: '파일 크기는 20MB 이하여야 합니다.' };
  }

  return { isValid: true };
};
