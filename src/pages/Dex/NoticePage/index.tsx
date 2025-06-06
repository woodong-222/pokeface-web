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
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/notices');
      // const noticesData = await response.json();
      
      // 임시 공지사항 데이터
      setTimeout(() => {
        const mockNotices: NoticePost[] = [
          {
            id: 1,
            title: '포켓페이스 서비스 오픈 안내',
            content: `안녕하세요! 포켓페이스 서비스가 드디어 오픈되었습니다!

포켓페이스는 인물 사진을 업로드하여 포켓몬을 수집하는 새로운 방식의 도감 서비스입니다.

주요 기능:
• 야생 포켓몬 포획: 인물 사진을 업로드하여 포켓몬 포획
• 포켓몬 진화: 같은 포켓몬을 여러 번 포획하여 진화시키기
• 커뮤니티: 다른 트레이너들과 소통하기
• 앨범: 포획 히스토리 확인하기

많은 관심과 참여 부탁드립니다!

포켓페이스 운영팀 드림`,
            createdAt: '2025-06-06T09:00:00Z',
            isImportant: true
          },
          {
            id: 2,
            title: '이용약관 및 개인정보처리방침 안내',
            content: `서비스 이용을 위한 약관 및 개인정보처리방침을 안내드립니다.

개인정보 수집 및 이용:
• 업로드된 인물 사진은 포켓몬 매칭을 위해서만 사용됩니다
• 얼굴 벡터 데이터만 저장되며, 원본 사진은 저장되지 않습니다
• 수집된 정보는 제3자에게 제공되지 않습니다

커뮤니티 이용 규칙:
• 타인에게 불쾌감을 주는 게시글 금지
• 개인정보 노출 금지
• 광고성 게시글 금지

문의사항은 고객센터로 연락 부탁드립니다.`,
            createdAt: '2025-06-04T11:00:00Z',
            isImportant: false
          },
          {
            id: 3,
            title: '포켓몬 진화 시스템 업데이트',
            content: `포켓몬 진화 시스템이 업데이트되었습니다.

변경 내용:
• 모든 포켓몬은 1단계부터 시작
• 같은 포켓몬을 2번째 포획 시 2단계로 진화
• 3번째 포획 시 최종 진화 형태 완성
• 이브이는 특별히 4단계까지 진화 가능

희귀 포켓몬 포획 조건:
• 뮤: 모든 포켓몬 수집 완료 시
• 뮤츠: 개발자 얼굴 사진 업로드 시
• 잠만보: 포켓몬 15마리 포획 시
• 라프라스: 포켓몬 3번 이상 진화 시
• 메타몽: 동일 인물 재업로드 시

더 자세한 내용은 도감에서 확인하실 수 있습니다.`,
            createdAt: '2025-06-05T14:30:00Z',
            isImportant: true
          },
          {
            id: 4,
            title: '모바일 앱 출시 예정 안내',
            content: `포켓페이스 모바일 앱 출시를 준비 중입니다!

예정 기능:
• 카메라로 직접 촬영하여 포켓몬 포획
• 푸시 알림을 통한 새 포켓몬 알림
• 오프라인에서도 도감 확인 가능
• 친구 추가 및 포켓몬 교환 기능

출시 일정:
• iOS: 2025년 7월 예정
• Android: 2025년 8월 예정

많은 기대 부탁드립니다!`,
            createdAt: '2025-06-02T13:20:00Z',
            isImportant: false
          }
        ];
        
        setNotices(mockNotices.sort((a, b) => b.id - a.id)); // ID 역순 정렬 (최신순)
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      setIsLoading(false);
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