import privateAxios from '../privateAxios';
import {
  PostsResponse,
  CreatePostRequest,
  CreatePostResponse,
  LikeRequest,
  LikeResponse,
  DeletePostRequest,
  DeletePostResponse,
  UploadImageResponse,
  PostsParams,
} from './entity';

// 게시글 목록 조회 (인증 필요)
export const getPosts = async (params: PostsParams = {}): Promise<PostsResponse> => {
  const { limit = 20, offset = 0 } = params;
  
  const { data } = await privateAxios.get<PostsResponse>('/community/posts.php', {
    params: { limit, offset },
  });

  return data;
};

// 게시글 작성 (인증 필요)
export const createPost = async (postData: CreatePostRequest): Promise<CreatePostResponse> => {
  // FormData 생성
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  
  if (postData.image) {
    formData.append('image', postData.image);
  }

  const { data } = await privateAxios.post<CreatePostResponse>('/community/create.php', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data;
};

// 게시글 삭제 (인증 필요)
export const deletePost = async (deleteData: DeletePostRequest): Promise<DeletePostResponse> => {
  const { data } = await privateAxios.delete<DeletePostResponse>('/community/delete.php', {
    data: deleteData,
  });
  return data;
};

// 좋아요 토글 (인증 필요)
export const toggleLike = async (likeData: LikeRequest): Promise<LikeResponse> => {
  const { data } = await privateAxios.post<LikeResponse>('/community/like.php', likeData);
  return data;
};

// 이미지 업로드 (인증 필요)
export const uploadImage = async (image: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('image', image);

  const { data } = await privateAxios.post<UploadImageResponse>('/community/upload.php', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data;
};