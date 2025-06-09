// 공지사항 관련 API 타입 정의

export interface NoticePost {
	id: number;
	title: string;
	content: string;
	isImportant: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface NoticeResponse {
	message: string;
	data: NoticePost[];
	pagination: {
		current_page: number;
		total_pages: number;
		total_count: number;
		limit: number;
		has_next: boolean;
		has_prev: boolean;
	};
}

export interface NoticeParams {
	page?: number;
	limit?: number;
}