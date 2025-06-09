export interface SignupRequest {
	user_id: string;
	user_pw: string;
	confirm_user_pw: string;
	user_name: string;
}

export interface LoginRequest {
	user_id: string;
	user_pw: string;
}

export interface LoginResponse {
	message?: string;
	token: string;
}

export interface SignupResponse {
	message: string;
}

export interface MeResponse {
	user_id: string;
	user_name: string;
}

export interface NicknameCheckRequest {
	user_name: string;
}

export interface NicknameCheckResponse {
	message: string;
	available?: boolean;
}

export interface PasswordFindRequest {
	user_id: string;
	user_name: string;
}

export interface PasswordChangeRequest {
	user_id: string;
	new_user_pw: string;
	confirm_user_pw: string;
}