import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from 'src/assets/logobutton.svg?react';
import Button1 from 'src/assets/button1.svg?react';
import Button2 from 'src/assets/button2.svg?react';
import Button3 from 'src/assets/button3.svg?react';
import Button4 from 'src/assets/button4.svg?react';
import Button5 from 'src/assets/button5.svg?react';
import styles from './MypagePage.module.scss';

interface UserInfo {
  id: string;
  user_name: string;
  user_id: string;
  joinDate: string;
  profilePokemonId: number; // 프로필 포켓몬 도감 번호
  totalPokemon: number;
  caughtPokemon: number;
  completionRate: number;
  lastLoginDate: string;
}

interface UserStats {
  totalCatches: number;
  evolutionCount: number;
  rarePokemonCount: number;
  favoriteType: string;
}

export default function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const getPokemonImageUrl = (pokemonId: number): string => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  };

  const loadUserInfo = async () => {
    setIsLoading(true);
    
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/user/me');
      // const userData = await response.json();
      
      // 임시 사용자 데이터
      setTimeout(() => {
        const mockUserInfo: UserInfo = {
          id: 'user123',
          user_name: '포켓몬마스터',
          user_id: 'pokemonmaster@example.com',
          joinDate: '2024-01-15',
          profilePokemonId: 25, // 피카츄
          totalPokemon: 151,
          caughtPokemon: 87,
          completionRate: 57.6,
          lastLoginDate: '2025-06-06'
        };

        const mockUserStats: UserStats = {
          totalCatches: 134,
          evolutionCount: 23,
          rarePokemonCount: 5,
          favoriteType: '불꽃'
        };

        setUserInfo(mockUserInfo);
        setUserStats(mockUserStats);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('accessToken');
      
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    loadUserInfo();
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
                  <h2>마이페이지</h2>
                  <p>내 정보와 포켓몬 수집 현황을 확인하세요</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.board}>
            {isLoading ? (
              <div className={styles.loadingSection}>
                <div className={styles.loadingSpinner}>⚪</div>
                <p>사용자 정보를 불러오는 중...</p>
              </div>
            ) : (
              <div className={styles.contentSection}>
                {/* 사용자 프로필 */}
                <div className={styles.profileCard}>
                  <div className={styles.profileHeader}>
                    <div className={styles.avatarSection}>
                      <div className={styles.avatar}>
                        <img 
                          src={getPokemonImageUrl(userInfo?.profilePokemonId || 25)} 
                          alt={`프로필 포켓몬 No.${userInfo?.profilePokemonId}`}
                          onError={(e) => {
                            // 이미지 로드 실패 시 기본 포켓몬으로 대체
                            (e.target as HTMLImageElement).src = getPokemonImageUrl(25);
                          }}
                        />
                      </div>
                      <div className={styles.userBasicInfo}>
                        <h3>{userInfo?.user_name}</h3>
                        <p>{userInfo?.user_id}</p>
                        <span className={styles.joinDate}>
                          가입일: {userInfo?.joinDate && formatDate(userInfo.joinDate)}
                        </span>
                      </div>
                    </div>
                    <button 
                      className={styles.logoutButton}
                      onClick={() => setShowLogoutModal(true)}
                    >
                      로그아웃
                    </button>
                  </div>
                </div>

                {/* 포켓몬 수집 현황 */}
                <div className={styles.statsGrid}>
                  <div className={styles.statsCard}>
                    <h4>포켓몬 도감</h4>
                    <div className={styles.progressSection}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${userInfo?.completionRate || 0}%` }}
                        ></div>
                      </div>
                      <div className={styles.progressText}>
                        <span>{userInfo?.caughtPokemon} / {userInfo?.totalPokemon}</span>
                        <span>{userInfo?.completionRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.statsCard}>
                    <h4>총 포획 횟수</h4>
                    <div className={styles.statValue}>
                      {userStats?.totalCatches || 0}회
                    </div>
                  </div>

                  <div className={styles.statsCard}>
                    <h4>진화 성공</h4>
                    <div className={styles.statValue}>
                      {userStats?.evolutionCount || 0}회
                    </div>
                  </div>

                  <div className={styles.statsCard}>
                    <h4>희귀 포켓몬</h4>
                    <div className={styles.statValue}>
                      {userStats?.rarePokemonCount || 0}마리
                    </div>
                  </div>

                  <div className={styles.statsCard}>
                    <h4>선호 타입</h4>
                    <div className={styles.statValue}>
                      {userStats?.favoriteType || '없음'}
                    </div>
                  </div>

                  <div className={styles.statsCard}>
                    <h4>최근 접속</h4>
                    <div className={styles.statValue}>
                      {userInfo?.lastLoginDate && formatDate(userInfo.lastLoginDate)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLogoutModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>로그아웃</h3>
            <p>정말로 로그아웃 하시겠습니까?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowLogoutModal(false)}
              >
                취소
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}