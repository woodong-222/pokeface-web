import { useNavigate } from 'react-router-dom';
import styles from './NonLoginView.module.scss';
import Logo from 'src/assets/logo.svg?react';

export default function NonLoginView() {
	const navigate = useNavigate();

	return (
		<div className={styles.container}>
			<div
				className={styles.container__logo}
				onClick={() => navigate('/')}
				style={{ cursor: 'pointer' }}
			>
				<Logo />
			</div>
			<div className={styles.container__frame}>
				<button
					className={styles.container__button}
					onClick={() => navigate('/auth')}
				>
					로그인
				</button>
				<button
					className={styles.container__button}
					onClick={() => navigate('/auth/signup')}
				>
					회원가입
				</button>
			</div>
		</div>
	);
}
