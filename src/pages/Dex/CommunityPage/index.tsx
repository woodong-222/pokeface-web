import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from 'src/assets/logobutton.svg?react';
import Button1 from 'src/assets/button1.svg?react';
import Button2 from 'src/assets/button2.svg?react';
import Button3 from 'src/assets/button3.svg?react';
import Button4 from 'src/assets/button4.svg?react';
import Button5 from 'src/assets/button5.svg?react';
import styles from './CommunityPage.module.scss';

interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorProfilePokemonId: number;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  image?: string;
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showWriteModal, setShowWriteModal] = useState<boolean>(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const getPokemonImageUrl = (pokemonId: number): string => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const loadPosts = async () => {
    setIsLoading(true);
    
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/community/posts');
      // const postsData = await response.json();
      
      // 임시 게시글 데이터
      setTimeout(() => {
        const mockPosts: CommunityPost[] = [
          {
            id: 1,
            title: '드디어 피카츄를 잡았어요',
            content: '3일 동안 찾아다녔는데 드디어 만났네요! 너무 귀여워서 계속 보고 있어요 ㅎㅎ\n포켓몬 도감도 한 칸 더 채워졌고 기분이 너무 좋아요!',
            author: '포켓몬마스터',
            authorProfilePokemonId: 25,
            createdAt: '2025-06-06T10:30:00Z',
            likeCount: 15,
            isLiked: false,
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
          },
          {
            id: 2,
            title: '1세대 포켓몬 중에 뭐가 제일 귀여운 것 같나요?',
            content: '개인적으로는 이브이가 제일 귀여운 것 같아요. 진화형도 다양하고 털도 복슬복슬해서 안고 싶어요!',
            author: '우동이',
            authorProfilePokemonId: 133,
            createdAt: '2025-06-06T09:15:00Z',
            likeCount: 8,
            isLiked: true
          },
          {
            id: 3,
            title: '내 첫 번째 진화 성공했습니다!',
            content: '꼬부기를 어니부기로 진화시켰어요!\n진화하는 순간 정말 감동적이었습니다 ㅠㅠ\n\n다음 목표는 거북왕으로 만드는 것!\n언제쯤 될지 모르겠지만 열심히 해볼게요~',
            author: '신입트레이너',
            authorProfilePokemonId: 7,
            createdAt: '2025-06-06T07:20:00Z',
            likeCount: 12,
            isLiked: false,
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png'
          }
        ];
        
        setPosts(mockPosts.sort((a, b) => b.id - a.id)); // ID 역순 정렬 (최신순)
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      // TODO: 실제 API 호출로 대체
      // await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
      
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
              }
            : post
        )
      );
    } catch (error) {
      console.error('추천 실패:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하만 업로드 가능합니다.');
        return;
      }

      setNewPost(prev => ({ ...prev, image: file }));
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      // TODO: 실제 API 호출로 대체
      // const formData = new FormData();
      // formData.append('title', newPost.title);
      // formData.append('content', newPost.content);
      // if (newPost.image) formData.append('image', newPost.image);
      // await fetch('/api/community/posts', { method: 'POST', body: formData });
      
      // 임시로 새 게시글 추가
      const tempPost: CommunityPost = {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        author: '현재사용자',
        authorProfilePokemonId: 25,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        isLiked: false,
        image: imagePreview || undefined
      };

      setPosts(prev => [tempPost, ...prev]);
      setShowWriteModal(false);
      setNewPost({ title: '', content: '', image: null });
      setImagePreview(null);
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  const closeWriteModal = () => {
    setShowWriteModal(false);
    setNewPost({ title: '', content: '', image: null });
    setImagePreview(null);
  };

  useEffect(() => {
    loadPosts();
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
                  <h2>커뮤니티</h2>
                  <p>포켓몬 트레이너들과 자유롭게 소통해보세요</p>
                </div>
                <button 
                  className={styles.writeButtonTop}
                  onClick={() => setShowWriteModal(true)}
                >
                  ✏️ 글쓰기
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.board}>
            <div className={styles.postsContainer}>
              {isLoading ? (
                <div className={styles.loadingSection}>
                  <div className={styles.loadingSpinner}>⚪</div>
                  <p>게시글을 불러오는 중...</p>
                </div>
              ) : (
                <div className={styles.postsList}>
                  {posts.map(post => (
                    <div key={post.id} className={styles.postCard}>
                      <div className={styles.postHeader}>
                        <div className={styles.authorInfo}>
                          <div className={styles.authorAvatar}>
                            <img 
                              src={getPokemonImageUrl(post.authorProfilePokemonId)} 
                              alt={`${post.author} 프로필`}
                            />
                          </div>
                          <div className={styles.authorDetails}>
                            <span className={styles.authorName}>{post.author}</span>
                            <span className={styles.postTime}>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.postContent}>
                        <h3 className={styles.postTitle}>{post.title}</h3>
                        <p className={styles.postText}>{post.content}</p>
                        {post.image && (
                          <div className={styles.postImage}>
                            <img src={post.image} alt="게시글 이미지" />
                          </div>
                        )}
                      </div>

                      <div className={styles.postActions}>
                        <button 
                          className={`${styles.likeButton} ${post.isLiked ? styles.liked : ''}`}
                          onClick={() => handleLike(post.id)}
                        >
                          {post.isLiked ? '❤️' : '🤍'} {post.likeCount}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <div className={styles.modalOverlay} onClick={closeWriteModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>새 글 작성</h3>
              <button className={styles.closeButton} onClick={closeWriteModal}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className={styles.titleInput}
                maxLength={100}
              />
              
              <textarea
                placeholder="내용을 입력하세요"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className={styles.contentTextarea}
                maxLength={1000}
              />

              <div className={styles.imageUploadSection}>
                <label htmlFor="imageUpload" className={styles.imageUploadLabel}>
                  이미지 첨부 (선택)
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="미리보기" />
                    <button 
                      className={styles.removeImageButton}
                      onClick={() => {
                        setImagePreview(null);
                        setNewPost(prev => ({ ...prev, image: null }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
                <p className={styles.uploadNote}>최대 5MB, JPG/PNG/GIF 형식만 지원</p>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={closeWriteModal}>
                취소
              </button>
              <button className={styles.submitButton} onClick={handleSubmitPost}>
                작성완료
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}