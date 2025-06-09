import publicAxios from '../publicAxios';
import {
  NoticeResponse,
  NoticeParams,
} from './entity';

export const getNotices = async (params: NoticeParams = {}): Promise<NoticeResponse> => {
  const { page = 1, limit = 10 } = params;
  
  const { data } = await publicAxios.get<NoticeResponse>('/notices.php', {
    params: { page, limit },
  });

  return data;
};