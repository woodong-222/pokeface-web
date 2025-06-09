import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from 'src/assets/logobutton.svg?react';
import Button1 from 'src/assets/button1.svg?react';
import Button2 from 'src/assets/button2.svg?react';
import Button3 from 'src/assets/button3.svg?react';
import Button4 from 'src/assets/button4.svg?react';
import Button5 from 'src/assets/button5.svg?react';
import styles from './HuntPage.module.scss';

interface CatchResult {
  pokemonId: number;
  pokemonName: string;
  pokemonImage: string;
  isNew: boolean;
  evolutionStage: number;
  evolved?: boolean;
}

interface CaptureResponse {
  message: string;
  result: CatchResult;
  error?: string;
}

export default function HuntPage() {
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [catchResult, setCatchResult] = useState<CatchResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      showError('파일 크기는 10MB 이하만 업로드 가능합니다.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showError('JPG, PNG, GIF, WEBP 형식의 이미지만 업로드 가능합니다.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const getKoreanErrorMessage = (error: string): string => {
    const errorMappings: { [key: string]: string } = {
      '얼굴을 감지할 수 없습니다. 명확한 얼굴이 포함된 이미지를 사용해주세요.': '얼굴을 감지할 수 없습니다.\n\n명확한 얼굴이 포함된 이미지를 사용해주세요.',
      'Face detection failed': '얼굴 인식에 실패했습니다.\n\n다른 이미지를 시도해보세요.',
      'No face detected': '얼굴이 감지되지 않았습니다.\n\n인물이 선명하게 나온 사진을 업로드해주세요.',
      'Multiple faces detected': '여러 명의 얼굴이 감지되었습니다.\n\n한 명의 인물만 나온 사진을 사용해주세요.',
      'Image upload failed': '이미지 업로드에 실패했습니다.\n\n다시 시도해주세요.',
      'Invalid image type': '지원하지 않는 이미지 형식입니다.\n\nJPG, PNG, GIF, WEBP 형식만 사용가능합니다.',
      'File too large': '파일 크기가 너무 큽니다.\n\n10MB 이하의 파일을 사용해주세요.',
      'No available starter Pokemon': '더 이상 배정할 수 있는 포켓몬이 없습니다.\n\n관리자에게 문의해주세요.'
    };

    for (const [key, value] of Object.entries(errorMappings)) {
      if (error.includes(key) || key.includes(error)) {
        return value;
      }
    }

    if (error.includes('network') || error.includes('fetch')) {
      return '네트워크 연결을 확인해주세요.\n\n잠시 후 다시 시도해주세요.';
    }

    if (error.includes('401') || error.includes('Unauthorized')) {
      return '로그인이 필요합니다.\n\n다시 로그인해주세요.';
    }

    return `오류가 발생했습니다.\n\n${error}`;
  };

  const handleCatchPokemon = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/pokemon/capture.php`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data: CaptureResponse = await response.json();
      
      if (!response.ok || data.message === 'Face detection failed') {
        const errorMsg = data.error || data.message || 'Unknown error';
        const koreanMsg = getKoreanErrorMessage(errorMsg);
        showError(koreanMsg);
        return;
      }
      
      if (data.message === 'Pokemon captured successfully' && data.result) {
        setCatchResult(data.result);
        setShowResult(true);
      } else {
        throw new Error(data.message || 'Failed to capture pokemon');
      }
    } catch (error: any) {
      console.error('포켓몬 포획 실패:', error);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        localStorage.removeItem('accessToken');
        navigate('/login');
        return;
      }
      
      const koreanMsg = getKoreanErrorMessage(error.message);
      showError(koreanMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setCatchResult(null);
    setShowResult(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeResultModal = () => {
    setShowResult(false);
    setTimeout(() => {
      setCatchResult(null);
    }, 300);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setTimeout(() => {
      setErrorMessage('');
    }, 300);
  };

  const handleViewAlbum = () => {
    navigate('/album');
  };

  const isRarePokemon = (pokemonId: number): boolean => {
    const rarePokemon = [131, 132, 143, 144, 145, 146, 150, 151];
    return rarePokemon.includes(pokemonId);
  };

  const getRarePokemonMessage = (pokemonId: number): string => {
    const messages: { [key: number]: string } = {
      131: '라프라스는 포켓몬을 3단계까지 진화시켜야 만날 수 있는 희귀한 포켓몬입니다!',
      132: '메타몽은 동일한 인물의 사진을 다시 업로드했을 때 나타나는 신비한 포켓몬입니다!',
      143: '잠만보는 15마리 이상의 포켓몬을 포획한 트레이너에게만 나타납니다!',
      144: '프리저는 전설의 얼음 포켓몬입니다!',
      145: '썬더는 전설의 전기 포켓몬입니다!',
      146: '파이어는 전설의 불꽃 포켓몬입니다!',
      150: '뮤츠는 개발자만이 만날 수 있는 특별한 포켓몬입니다!',
      151: '뮤는 모든 포켓몬을 수집한 진정한 포켓몬 마스터에게만 나타나는 환상의 포켓몬입니다!'
    };
    return messages[pokemonId] || '희귀한 포켓몬을 발견했습니다!';
  };

  return (
    <>
      <div className={styles.backgroundDexWrapper}></div>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <div className={styles.top}>
            <div className={styles.buttons}>
              <Logo className={styles.logo} onClick={handleLogoClick} />
              <div className={styles.subButtons}>
                <div className={styles.buttonWrapper} onClick={() => navigate('/hunt')} data-tooltip="야생포켓몬 포획">
                  <Button1 />
                </div>
                <div className={styles.buttonWrapper} onClick={() => navigate('/album')} data-tooltip="앨범">
                  <Button2 />
                </div>
                <div className={styles.buttonWrapper} onClick={() => navigate('/community')} data-tooltip="커뮤니티">
                  <Button3 />
                </div>
                <div className={styles.buttonWrapper} onClick={() => navigate('/notice')} data-tooltip="공지사항">
                  <Button4 />
                </div>
                <div className={styles.buttonWrapper} onClick={() => navigate('/mypage')} data-tooltip="마이페이지">
                  <Button5 />
                </div>
              </div>
            </div>
            <div className={styles.dexControls}>
              <div className={styles.dexScreenContainer}>
                <div className={styles.huntTitle}>
                  <h2>야생 포켓몬 포획</h2>
                  <p>인물 사진을 업로드하여 새로운 포켓몬을 발견해보세요!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.board}>
            <div className={styles.uploadSection}>
              <div 
                className={`${styles.uploadArea} ${isDragOver ? styles.dragOver : ''} ${selectedImage ? styles.hasImage : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                
                {selectedImage ? (
                  <div className={styles.imagePreview}>
                    <img src={selectedImage} alt="업로드된 이미지" />
                    <div className={styles.imageOverlay}>
                      <p>다른 이미지로 변경하려면 클릭하세요</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.uploadContent}>
                    <div className={styles.uploadIcon}>📷</div>
                    <h3>인물 사진을 드래그하거나 클릭하여 업로드</h3>
                    <p className={styles.uploadSubtext}>
                      최대 10MB, JPG, PNG, GIF, WEBP 형식만 지원
                    </p>
                  </div>
                )}
              </div>
              
              {selectedImage && (
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.catchButton}
                    onClick={handleCatchPokemon}
                    disabled={isUploading}
                  >
                    {isUploading ? '포획 중...' : '포켓몬 포획하기!'}
                  </button>
                  <button 
                    className={styles.resetButton}
                    onClick={handleReset}
                    disabled={isUploading}
                  >
                    다시 선택
                  </button>
                </div>
              )}
            </div>
            
            {isUploading && (
              <div className={styles.loadingSection}>
                <div className={styles.pokeball}>⚪</div>
                <p>야생 포켓몬을 찾고 있습니다...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 에러 모달 */}
      {showErrorModal && (
        <div className={styles.modalOverlay} onClick={closeErrorModal}>
          <div className={`${styles.modalContent} ${styles.errorModal}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeErrorModal}>×</button>
            
            <div className={styles.errorHeader}>
              <h2>오류 발생</h2>
            </div>
            
            <div className={styles.errorBody}>
              <div className={styles.errorMessage}>
                {errorMessage.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
            
            <div className={styles.errorActions}>
              <button className={styles.confirmButton} onClick={closeErrorModal}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 포획 결과 모달 */}
      {showResult && catchResult && (
        <div className={styles.modalOverlay} onClick={closeResultModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeResultModal}>×</button>
            
            <div className={styles.resultHeader}>
              <h2>
                {catchResult.isNew 
                  ? (isRarePokemon(catchResult.pokemonId) 
                      ? '✨ 희귀 포켓몬을 발견했습니다! ✨' 
                      : '새로운 포켓몬을 발견했습니다!')
                  : (catchResult.evolved 
                      ? '🎉 포켓몬이 진화했습니다! 🎉'
                      : '이미 등록된 포켓몬입니다!')
                }
              </h2>
              {!catchResult.isNew && (
                <p className={styles.evolutionInfo}>
                  {catchResult.evolved 
                    ? `${catchResult.evolutionStage}단계로 진화했습니다!`
                    : `같은 포켓몬을 다시 잡으면 진화할 수 있어요! (현재 ${catchResult.evolutionStage}단계)`
                  }
                </p>
              )}
              {isRarePokemon(catchResult.pokemonId) && (
                <p className={styles.rareInfo}>
                  {getRarePokemonMessage(catchResult.pokemonId)}
                </p>
              )}
            </div>
            
            <div className={styles.resultBody}>
              <div className={`${styles.pokemonCard} ${isRarePokemon(catchResult.pokemonId) ? styles.rarePokemon : ''} ${catchResult.evolved ? styles.evolvedPokemon : ''}`}>
                <img src={catchResult.pokemonImage} alt={catchResult.pokemonName} />
                <h3>{catchResult.pokemonName}</h3>
                <p>No. {String(catchResult.pokemonId).padStart(3, '0')}</p>
                <div className={styles.evolutionStage}>
                  진화 단계: {catchResult.evolutionStage}
                </div>
                {isRarePokemon(catchResult.pokemonId) && (
                  <div className={styles.rareBadge}>
                    희귀 포켓몬
                  </div>
                )}
                {catchResult.evolved && (
                  <div className={styles.evolvedBadge}>
                    진화!
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.resultActions}>
              <button className={styles.albumButton} onClick={handleViewAlbum}>
                앨범 보기
              </button>
              <button className={styles.confirmButton} onClick={closeResultModal}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}