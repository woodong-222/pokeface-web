import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from 'src/assets/logobutton.svg?react';
import Button1 from 'src/assets/button1.svg?react';
import Button2 from 'src/assets/button2.svg?react';
import Button3 from 'src/assets/button3.svg?react';
import Button4 from 'src/assets/button4.svg?react';
import Button5 from 'src/assets/button5.svg?react';
import styles from './NoticePage.module.scss';

interface NoticePost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isImportant: boolean;
}

export default function NoticePage() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<NoticePost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedNotice, setSelectedNotice] = useState<NoticePost | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const loadNotices = async () => {
    setIsLoading(true);
    
    try {
      // 새로운 API 사용 (상대 경로로 수정)
      const { getNotices } = await import('../../../api/notice');
      const result = await getNotices({ page: 1, limit: 20 });
      
      if (result.message === 'Success') {
        setNotices(result.data);
      } else {
        throw new Error(result.message || 'Failed to load notices');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      setIsLoading(false);
      
      // 에러 시 빈 배열로 설정
      setNotices([]);
    }
  };

  const handleNoticeClick = (notice: NoticePost) => {
    setSelectedNotice(notice);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedNotice(null);
  };

  useEffect(() => {
    loadNotices();
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
                  <h2>공지사항</h2>
                  <p>중요한 소식과 업데이트를 확인하세요</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.board}>
            <div className={styles.noticesContainer}>
              {isLoading ? (
                <div className={styles.loadingSection}>
                  <div className={styles.loadingSpinner}>⚪</div>
                  <p>공지사항을 불러오는 중...</p>
                </div>
              ) : (
                <div className={styles.noticesList}>
                  {notices.map(notice => (
                    <div 
                      key={notice.id} 
                      className={`${styles.noticeCard} ${notice.isImportant ? styles.important : ''}`}
                      onClick={() => handleNoticeClick(notice)}
                    >
                      <div className={styles.noticeHeader}>
                        <div className={styles.noticeTitleSection}>
                          {notice.isImportant && (
                            <span className={styles.importantBadge}>중요</span>
                          )}
                          <h3 className={styles.noticeTitle}>{notice.title}</h3>
                        </div>
                        <div className={styles.noticeInfo}>
                          <span className={styles.noticeDate}>{formatDate(notice.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className={styles.noticePreview}>
                        {notice.content.split('\n')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 공지사항 상세 모달 */}
      {showDetailModal && selectedNotice && (
        <div className={styles.modalOverlay} onClick={closeDetailModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleSection}>
                {selectedNotice.isImportant && (
                  <span className={styles.importantBadgeModal}>중요</span>
                )}
                <h3>{selectedNotice.title}</h3>
              </div>
              <button className={styles.closeButton} onClick={closeDetailModal}>×</button>
            </div>
            
            <div className={styles.modalInfo}>
              <span>작성일: {formatDate(selectedNotice.createdAt)}</span>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.noticeContent}>
                {selectedNotice.content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}