export const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  
  // 이미 완전한 URL인 경우 그대로 반환
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // ../uploads/community/filename.png 형태를 처리
  // VITE_SERVER_URL에서 /api 부분을 제거하고 이미지 경로와 조합
  const baseUrl = import.meta.env.VITE_SERVER_URL.replace('/api', '');
  
  // ../uploads를 /uploads로 변환
  const cleanPath = imagePath.replace('../', '/');
  
  return `${baseUrl}${cleanPath}`;
};