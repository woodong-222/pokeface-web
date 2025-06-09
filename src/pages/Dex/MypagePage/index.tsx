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
  username: string;
  user_id: string;
  joinDate: string;
  profilePokemonId: number;
  totalPokemon: number;
  caughtPokemon: number;
  completionRate: number;
  lastLoginDate: string;
}

interface UserStats {
  totalCatches: number;
  evolutionCount: number;
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
      const { getMe } = await import('../../../api/user');
      const result = await getMe();
      
      if (result.message === 'Success') {
        const mockUserInfo: UserInfo = {
          id: result.user.id,
          username: result.user.username,
          user_id: result.user.user_id,
          joinDate: result.user.joinDate?.split('T')[0] || '2024-01-15',
          profilePokemonId: result.user.profilePokemonId,
          totalPokemon: result.stats.totalPokemon,
          caughtPokemon: result.stats.caughtPokemon,
          completionRate: result.stats.completionRate,
          lastLoginDate: result.stats.lastLoginDate || new Date().toISOString().split('T')[0]
        };

        const mockUserStats: UserStats = {
          totalCatches: result.stats.totalCatches,
          evolutionCount: result.stats.evolutionCount
        };

        setUserInfo(mockUserInfo);
        setUserStats(mockUserStats);
      } else {
        throw new Error(result.message || 'Failed to load user info');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      setIsLoading(false);
      
      localStorage.removeItem('accessToken');
      navigate('/');
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
                <div className={styles.profileCard}>
                  <div className={styles.profileHeader}>
                    <div className={styles.avatarSection}>
                      <div className={styles.avatar}>
                        <img 
                          src={getPokemonImageUrl(userInfo?.profilePokemonId || 25)} 
                          alt={`프로필 포켓몬 No.${userInfo?.profilePokemonId}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getPokemonImageUrl(25);
                          }}
                        />
                      </div>
                      <div className={styles.userBasicInfo}>
                        <h3>{userInfo?.username}</h3>
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