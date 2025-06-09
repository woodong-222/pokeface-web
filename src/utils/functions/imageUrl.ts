export const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const baseUrl = import.meta.env.VITE_SERVER_URL.replace('/api', '');
  
  const cleanPath = imagePath.replace('../', '/');
  
  return `${baseUrl}${cleanPath}`;
};