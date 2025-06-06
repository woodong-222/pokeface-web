import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from 'src/assets/logobutton.svg?react';
import Button1 from 'src/assets/button1.svg?react';
import Button2 from 'src/assets/button2.svg?react';
import Button3 from 'src/assets/button3.svg?react';
import Button4 from 'src/assets/button4.svg?react';
import Button5 from 'src/assets/button5.svg?react';
import styles from './AlbumPage.module.scss';

interface CaptureRecord {
  id: number;
  pokemonName: string;
  pokemonNumber: number;
  originalImage: string;
  captureDate: string;
}

export default function AlbumPage() {
  const navigate = useNavigate();
  const [captureHistory, setCaptureHistory] = useState<CaptureRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<CaptureRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPokemonImageUrl = (pokemonNumber: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonNumber}.png`;
  };

  const loadCaptureHistory = async () => {
    setIsLoading(true);
    
    try {
      // TODO: 실제 API 호출로 대체
      setTimeout(() => {
        const mockCaptureHistory: CaptureRecord[] = [
          {
            id: 1,
            pokemonName: '피카츄',
            pokemonNumber: 25,
            originalImage: '/uploads/user1.jpg',
            captureDate: '2025-06-06T14:30:00Z'
          },
          {
            id: 2,
            pokemonName: '파이리',
            pokemonNumber: 4,
            originalImage: '/uploads/user2.jpg',
            captureDate: '2025-06-06T12:15:00Z'
          },
          {
            id: 3,
            pokemonName: '꼬부기',
            pokemonNumber: 7,
            originalImage: '/uploads/user3.jpg',
            captureDate: '2025-06-05T16:45:00Z'
          },
          {
            id: 4,
            pokemonName: '이상해씨',
            pokemonNumber: 1,
            originalImage: '/uploads/user4.jpg',
            captureDate: '2025-06-05T10:20:00Z'
          },
          {
            id: 5,
            pokemonName: '라이츄',
            pokemonNumber: 26,
            originalImage: '/uploads/user5.jpg',
            captureDate: '2025-06-04T18:00:00Z'
          },
          {
            id: 6,
            pokemonName: '푸린',
            pokemonNumber: 39,
            originalImage: '/uploads/user6.jpg',
            captureDate: '2025-06-04T09:30:00Z'
          }
        ];
        
        setCaptureHistory(mockCaptureHistory.sort((a, b) => new Date(b.captureDate).getTime() - new Date(a.captureDate).getTime()));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('포획 기록 로드 실패:', error);
      setIsLoading(false);
    }
  };

  const handleRecordClick = (record: CaptureRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRecord(null);
  };

  useEffect(() => {
    loadCaptureHistory();
  }, []);

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
                <div className={styles.pageTitle}>
                  <h2>포획 앨범</h2>
                  <p>당신의 포켓몬 포획 기록을 확인하세요</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.board}>
            <div className={styles.albumContainer}>
              {isLoading ? (
                <div className={styles.loadingSection}>
                  <div className={styles.loadingSpinner}>⚪</div>
                  <p>포획 기록을 불러오는 중...</p>
                </div>
              ) : (
                <div className={styles.captureGrid}>
                  {captureHistory.map(record => (
                    <div 
                      key={record.id} 
                      className={styles.captureCard}
                      onClick={() => handleRecordClick(record)}
                    >
                      <div className={styles.pokemonImageContainer}>
                        <img 
                          src={record.originalImage} 
                          alt="업로드된 인물 사진"
                          className={styles.pokemonImage}
                        />
                      </div>
                      
                      <div className={styles.captureInfo}>
                        <div className={styles.pokemonInfo}>
                          <span className={styles.pokemonNumber}>No.{record.pokemonNumber.toString().padStart(3, '0')}</span>
                          <h3 className={styles.pokemonName}>{record.pokemonName}</h3>
                        </div>
                        <div className={styles.captureDate}>
                          {formatDate(record.captureDate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 포획 상세 모달 */}
      {showDetailModal && selectedRecord && (
        <div className={styles.modalOverlay} onClick={closeDetailModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleSection}>
                <span className={styles.pokemonNumberModal}>No.{selectedRecord.pokemonNumber.toString().padStart(3, '0')}</span>
                <h3>{selectedRecord.pokemonName}</h3>
              </div>
              <button className={styles.closeButton} onClick={closeDetailModal}>×</button>
            </div>
            
            <div className={styles.modalInfo}>
              <span>포획일시: {formatDate(selectedRecord.captureDate)}</span>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.imageComparison}>
                <div className={styles.imageSection}>
                  <h4>업로드한 사진</h4>
                  <img 
                    src={selectedRecord.originalImage} 
                    alt="업로드된 사진"
                    className={styles.originalImage}
                  />
                </div>
                <div className={styles.arrowSection}>
                  <span className={styles.arrow}>→</span>
                </div>
                <div className={styles.imageSection}>
                  <h4>포획된 포켓몬</h4>
                  <img 
                    src={getPokemonImageUrl(selectedRecord.pokemonNumber)} 
                    alt={selectedRecord.pokemonName}
                    className={styles.capturedImageLarge}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}