import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from 'src/assets/logobutton.svg?react';
import Button1 from 'src/assets/button1.svg?react';
import Button2 from 'src/assets/button2.svg?react';
import Button3 from 'src/assets/button3.svg?react';
import Button4 from 'src/assets/button4.svg?react';
import Button5 from 'src/assets/button5.svg?react';
import styles from './AlbumPage.module.scss';
import { getImageUrl } from '../../../utils/functions/imageUrl';

interface CaptureRecord {
  id: number;
  pokemonName?: string; // 옵셔널로 변경
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
      // API 모듈 사용
      const { getAlbum } = await import('../../../api/pokemon');
      const result = await getAlbum({ page: 1, limit: 50, order: 'desc' });
      
      if (result.message === 'Success') {
        // API 데이터를 컴포넌트 형식에 맞게 변환
        const transformedData = result.data.map(record => ({
          id: record.id,
          pokemonName: '', // PokeAPI에서 가져올 예정이므로 빈 문자열
          pokemonNumber: record.pokemonNumber,
          originalImage: record.originalImage,
          captureDate: record.captureDate
        }));
        
        setCaptureHistory(transformedData);
      } else {
        throw new Error(result.message || 'Failed to load capture history');
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('포획 기록 로드 실패:', error);
      setIsLoading(false);
      
      // 인증 에러 시 홈으로 이동
      if (error?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/');
      } else {
        // 에러 시 빈 배열로 설정
        setCaptureHistory([]);
      }
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
              ) : captureHistory.length === 0 ? (
                <div className={styles.loadingSection}>
                  <p>사진이 없습니다. 포켓몬을 포획해보세요!</p>
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
                          src={getImageUrl(record.originalImage) || ''} 
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
                    src={getImageUrl(selectedRecord.originalImage) || ''} 
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