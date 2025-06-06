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
}

export default function HuntPage() {
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [catchResult, setCatchResult] = useState<CatchResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
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
      alert('파일 크기는 10MB 이하만 업로드 가능합니다.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, GIF, WEBP 형식의 이미지만 업로드 가능합니다.');
      return;
    }

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

  const handleCatchPokemon = async () => {
    if (!selectedImage) return;
    
    setIsUploading(true);
    
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/catch-pokemon', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // 임시 결과 시뮬레이션
      setTimeout(() => {
        const mockResult: CatchResult = {
          pokemonId: 25,
          pokemonName: '피카츄',
          pokemonImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
          isNew: Math.random() > 0.3,
          evolutionStage: 1
        };
        
        setCatchResult(mockResult);
        setShowResult(true);
        setIsUploading(false);
      }, 2000);
    } catch (error) {
      console.error('포켓몬 포획 실패:', error);
      setIsUploading(false);
      alert('포켓몬 포획에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
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

      {/* 포획 결과 모달 */}
      {showResult && catchResult && (
        <div className={styles.modalOverlay} onClick={closeResultModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeResultModal}>×</button>
            
            <div className={styles.resultHeader}>
              <h2>{catchResult.isNew ? '새로운 포켓몬을 발견했습니다!' : '이미 등록된 포켓몬입니다!'}</h2>
            </div>
            
            <div className={styles.resultBody}>
              <div className={styles.pokemonCard}>
                <img src={catchResult.pokemonImage} alt={catchResult.pokemonName} />
                <h3>{catchResult.pokemonName}</h3>
                <p>No. {String(catchResult.pokemonId).padStart(4, '0')}</p>
                <div className={styles.evolutionStage}>
                  진화 단계: {catchResult.evolutionStage}
                </div>
              </div>
            </div>
            
            <div className={styles.resultActions}>
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