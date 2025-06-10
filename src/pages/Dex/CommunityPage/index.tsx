import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from 'src/assets/logobutton.svg?react';
import Button1 from 'src/assets/button1.svg?react';
import Button2 from 'src/assets/button2.svg?react';
import Button3 from 'src/assets/button3.svg?react';
import Button4 from 'src/assets/button4.svg?react';
import Button5 from 'src/assets/button5.svg?react';
import styles from './CommunityPage.module.scss';
import { getPosts, createPost, toggleLike, deletePost } from '../../../api/community';
import type { CommunityPost } from '../../../api/community/entity';
import { getImageUrl } from '../../../utils/functions/imageUrl';

interface NewPostState {
  title: string;
  content: string;
  image: File | null;
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showWriteModal, setShowWriteModal] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<NewPostState>({
    title: '',
    content: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  
  const handleLogoClick = () => {
    navigate('/');
  };
  
  const getPokemonImageUrl = (pokemonId: number): string => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - kstDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;

    return kstDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const loadPosts = async () => {
    setIsLoading(true);
    
    try {
      const result = await getPosts({ limit: 20, offset: 0 });
      
      if (result.message === 'Success') {
        setPosts(result.posts);
      } else {
        throw new Error(result.message || 'Failed to load posts');
      }
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const result = await toggleLike({ postId });
      
      if (result.message === 'Success') {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: result.isLiked,
                  likeCount: result.likeCount
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    setDeletingPostId(postId);

    try {
      const result = await deletePost({ postId });
      
      if (result.message === 'Post deleted successfully') {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        alert('게시글이 삭제되었습니다.');
      } else {
        throw new Error(result.message || 'Failed to delete post');
      }
    } catch (error: any) {
      console.error('게시글 삭제 실패:', error);
      alert(error.response?.data?.message || '게시글 삭제에 실패했습니다.');
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하만 업로드 가능합니다.');
        return;
      }

      setNewPost(prev => ({ ...prev, image: file }));
      
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

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await createPost({
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        image: newPost.image || undefined
      });
      
      if (result.message === 'Post created successfully') {
        setPosts(prev => [result.post, ...prev]);
        setShowWriteModal(false);
        setNewPost({ title: '', content: '', image: null });
        setImagePreview(null);
        alert('게시글이 작성되었습니다.');
      } else {
        throw new Error(result.message || 'Failed to create post');
      }
    } catch (error: any) {
      console.error('게시글 작성 실패:', error);
      alert(error.response?.data?.message || '게시글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
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
              ) : posts.length === 0 ? (
                <div className={styles.loadingSection}>
                  <p>게시글이 없습니다.</p>
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
                        {post.isAuthor && (
                          <button 
                            className={styles.deleteButtonTop}
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingPostId === post.id}
                          >
                            {deletingPostId === post.id ? '삭제 중...' : '🗑️'}
                          </button>
                        )}
                      </div>
                      
                      <div className={styles.postContent}>
                        <h3 className={styles.postTitle}>{post.title}</h3>
                        <p className={styles.postText}>{post.content}</p>
                        {post.image && (
                          <div className={styles.postImage}>
                            <img 
                              src={getImageUrl(post.image) || ''} 
                              alt="게시글 이미지"
                            />
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
                disabled={isSubmitting}
              />
              
              <textarea
                placeholder="내용을 입력하세요"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className={styles.contentTextarea}
                maxLength={1000}
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </div>
                )}
                <p className={styles.uploadNote}>최대 5MB, JPG/PNG/GIF 형식만 지원</p>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton} 
                onClick={closeWriteModal}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button 
                className={styles.submitButton} 
                onClick={handleSubmitPost}
                disabled={isSubmitting}
              >
                {isSubmitting ? '작성 중...' : '작성완료'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}