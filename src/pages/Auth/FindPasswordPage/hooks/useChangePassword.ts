import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { changePassword, login } from '../../../../api/auth';
import { PasswordChangeRequest, LoginRequest } from '../../../../api/auth/entity';

export default function useChangePassword() {
	const navigate = useNavigate();

	const { mutateAsync, isError } = useMutation({
		mutationFn: async (data: PasswordChangeRequest) => {
			await changePassword(data);

			const loginData: LoginRequest = {
				user_id: data.user_id,
				user_pw: data.new_user_pw,
			};

			await login(loginData);
		},

		onSuccess: () => {
			toast('비밀번호 변경이 완료되었습니다.', { type: 'success' });
			navigate('/');
		},

		onError: () => {
			toast('서버 오류가 발생했습니다.', { type: 'error' });
		},
	});

	return { mutateAsync, isError };
}
