// 커뮤니티 관련 API 타입 정의

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorProfilePokemonId: number;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  isAuthor: boolean; // 작성자 여부 추가
  image?: string;
}

export interface PostsResponse {
  message: string;
  posts: CommunityPost[];
  pagination?: {
    limit: number;
    offset: number;
    count: number;
  };
}

export interface CreatePostRequest {
  title: string;
  content: string;
  image?: File;
}

export interface CreatePostResponse {
  message: string;
  post: CommunityPost;
}

export interface DeletePostRequest {
  postId: number;
}

export interface DeletePostResponse {
  message: string;
  postId: number;
}

export interface LikeRequest {
  postId: number;
}

export interface LikeResponse {
  message: string;
  postId: number;
  isLiked: boolean;
  likeCount: number;
}

export interface UploadImageResponse {
  message: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface PostsParams {
  limit?: number;
  offset?: number;
}