import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../../api/auth';

export default function useLogin() {
	const navigate = useNavigate();

	const { mutate, isError } = useMutation({
		mutationFn: login,

		onSuccess: (data) => {
			localStorage.setItem('accessToken', data.token);
			navigate('/');
		},

		onError: () => {
		},
	});

	return { mutate, isError };
}
