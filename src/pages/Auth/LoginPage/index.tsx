import { SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlindIcon from 'src/assets/blind.svg';
import DeleteIcon from 'src/assets/delete.svg';
import EyeIcon from 'src/assets/eye.svg';
import Logo from 'src/assets/logo.svg';
import useLogin from '../SignupPage/hooks/useLogin';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
	const navigate = useNavigate();
	const [id, setId] = useState('');
	const [pw, setPw] = useState('');
	const [showPw, setShowPw] = useState<boolean>(false);

	const { mutate: login, isError } = useLogin();

	const currentId = (e: { target: { value: SetStateAction<string> } }) => {
		setId(e.target.value);
	};

	const currentPw = (e: { target: { value: SetStateAction<string> } }) => {
		setPw(e.target.value);
	};

	const deleteIdHandler = () => {
		setId('');
	};

	const deletePwHandler = () => {
		setPw('');
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login({
			user_id: id,
			user_pw: pw,
		});

		return;
	};

	const toggleShowPw = () => {
		setShowPw((prev) => !prev);
	};

	return (
		<div className={styles.container}>
			<div
				className={styles.container__logo}
				onClick={() => navigate('/')}
				style={{ cursor: 'pointer' }}
			>
				<Logo />
			</div>
			<form className={styles.container__form} onSubmit={onSubmit}>
				<div className={styles.container__input}>
					<div className={styles['container__input--field-id']}>
						<input
							placeholder="아이디를 입력하세요."
							className={styles['container__input--text']}
							onChange={currentId}
							value={id}
						/>
						<button
							type="button"
							onClick={deleteIdHandler}
							className={styles['container__input--icon']}
							tabIndex={-1}
						>
							<DeleteIcon />
						</button>
					</div>

					<div className={styles['container__input--field-pw']}>
						<input
							type={showPw ? 'text' : 'password'}
							placeholder="비밀번호를 입력하세요."
							className={styles['container__input--text']}
							onChange={currentPw}
							value={pw}
						/>
						<div className={styles['container__input--icons']}>
							<button
								type="button"
								onClick={toggleShowPw}
								className={styles['container__input--icon']}
								tabIndex={-1}
							>
								{showPw ? <EyeIcon /> : <BlindIcon />}
							</button>
							<button
								type="button"
								onClick={deletePwHandler}
								className={styles['container__input--icon']}
								tabIndex={-1}
							>
								<DeleteIcon />
							</button>
						</div>
					</div>
				</div>
				<div>
					<div className={styles.error}>
						{isError ? '아이디 또는 비밀번호를 다시 확인해 주세요.' : '\u00A0'}
					</div>
					<button className={styles.container__submit} type="submit">
						로그인
					</button>
				</div>
				<div className={styles['container__find-wrap']}>
				<button
					type="button"
					className={styles['container__find-wrap__button']}
					onClick={() => navigate('/auth/find-pw')}
				>
					비밀번호 찾기
				</button>
				<div>|</div>
				<button
					type="button"
					className={styles['container__find-wrap__button']}
					onClick={() => navigate('/auth/signup')}
				>
					회원가입
				</button>
			</div>
			</form>
		</div>
	);
}
