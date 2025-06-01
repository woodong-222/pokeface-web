import privateAxios from '../privateAxios';
import publicAxios from '../publicAxios';
import {
	LoginRequest,
	SignupRequest,
	MeResponse,
	NicknameCheckRequest,
	PasswordFindRequest,
	PasswordChangeRequest,
} from './entity';

export const signup = async (userData: SignupRequest) => {
	const { data } = await publicAxios.post('/register/register.php', userData);

	return data;
};

export const login = async (loginData: LoginRequest) => {

	const { data } = await publicAxios.post('/login.php', loginData);

	return data;
};

export const getMe = async (): Promise<MeResponse> => {
	const { data } = await privateAxios.get<MeResponse>('/me.php');

	return data;
};

export const checkNicknameDuplicate = async (
	nickname: NicknameCheckRequest,
) => {
	const { data } = await publicAxios.get('/register/nickname.php', {
		params: nickname,
	});

	return data;
};

export const findPassword = async (passwordFindData: PasswordFindRequest) => {
	const { data } = await publicAxios.post('/password/find.php', passwordFindData);

	return data;
};

export const changePassword = async (
	passwordChangeData: PasswordChangeRequest,
) => {
	const { data } = await publicAxios.patch(
		'/password/reset.php',
		passwordChangeData,
	);

	return data;
};
