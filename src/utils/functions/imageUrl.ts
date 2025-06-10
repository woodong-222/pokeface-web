export const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // URL 객체를 사용한 안전한 방법
  const serverUrl = new URL(import.meta.env.VITE_SERVER_URL);
  const baseUrl = `${serverUrl.protocol}//${serverUrl.host}`;
  
  // 경로가 '/'로 시작하지 않으면 추가
  const cleanPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
  
  return `${baseUrl}${cleanPath}`;
};