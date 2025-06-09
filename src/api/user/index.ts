import privateAxios from '../privateAxios';
import {
	MeResponse,
	UserStatsResponse,
} from './entity';

export const getMe = async (): Promise<MeResponse> => {
	const { data } = await privateAxios.get<MeResponse>('/user/me.php');
	return data;
};

export const getUserStats = async (): Promise<UserStatsResponse> => {
	const { data } = await privateAxios.get<UserStatsResponse>('/user/stats.php');
	return data;
};