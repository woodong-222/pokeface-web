import { useState } from 'react';
import BlindIcon from 'src/assets/blind.svg';
import DeleteIcon from 'src/assets/delete.svg';
import EyeIcon from 'src/assets/eye.svg';
import Logo from 'src/assets/logo.svg';
import styles from './FindPasswordPage.module.scss';
import useChangePassword from './hooks/useChangePassword';
import useFindPassword from './hooks/useFindPassword';

const PASSWORDREG = /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W).{8,}.+$/;

export default function FindPasswordPage() {
	const { mutateAsync: findPassword, isError } = useFindPassword();
	const { mutateAsync: changePassword } = useChangePassword();

	const [id, setId] = useState('');
	const [name, setName] = useState('');
	const [step, setStep] = useState(1);

	const [password, setPassword] = useState('');
	const [passwordCheck, setPasswordCheck] = useState('');
	const [isBlind, setIsBlind] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	const handleStep = async () => {
		if (step === 1) {
			await findPassword({
				user_id: id,
				user_name: name,
			});

			if (!id || !name || isError) return;

			setStep((value) => value + 1);
		}

		if (step === 2) {
			if (!PASSWORDREG.test(password) || !PASSWORDREG.test(passwordCheck)) {
				setErrorMessage(
					'비밀번호는 영문, 특수문자, 숫자를 포함한 8자리 이상이어야 합니다.',
				);
				return;
			}
			if (password !== passwordCheck) {
				setErrorMessage('비밀번호가 일치하지 않습니다.');
				return;
			}

			setErrorMessage('');
			changePassword({
				user_id: id,
				new_user_pw: password,
				confirm_user_pw: passwordCheck,
			});
			setStep((value) => value + 1);
			return;
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.container__logo}>
				<Logo />
			</div>
			{step === 1 && (
				<div className={styles.box}>
					<div className={styles.form}>
						<div className={styles.form__input}>
							<input
								type="text"
								className={styles['form__input--text']}
								placeholder="아이디를 입력하세요."
								value={id}
								onChange={(e) => setId(e.target.value)}
							/>
							<button
								className={styles['form__input--delete']}
								onClick={() => setId('')}
								tabIndex={-1}
							>
								<DeleteIcon />
							</button>
						</div>
						<div className={styles.form__input}>
							<input
								type="text"
								className={styles['form__input--text']}
								placeholder="닉네임을 입력하세요."
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<button
								className={styles['form__input--delete']}
								onClick={() => setName('')}
								tabIndex={-1}
							>
								<DeleteIcon />
							</button>
						</div>
					</div>
					{errorMessage && (
						<div className={styles['error-message']}>{errorMessage}</div>
					)}
					<button className={styles.box__button} onClick={handleStep}>
						다음
					</button>
				</div>
			)}
			{step === 2 && (
				<div className={styles.box}>
					<div className={styles.form}>
						<div className={styles.form__input}>
							<input
								type="password"
								className={styles['form__input--text']}
								placeholder="새로운 비밀번호를 입력해주세요."
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								className={styles['form__input--delete']}
								onClick={() => setPassword('')}
								tabIndex={-1}
							>
								<DeleteIcon />
							</button>
						</div>
						<div className={styles.form__input}>
							<input
								type={isBlind ? 'password' : 'text'}
								className={styles['form__input--text']}
								placeholder="새로운 비밀번호를 한 번 더 입력해주세요."
								value={passwordCheck}
								onChange={(e) => setPasswordCheck(e.target.value)}
							/>
							<button
								className={styles['form__input--delete']}
								onClick={() => setIsBlind((value) => !value)}
							>
								{isBlind ? <BlindIcon /> : <EyeIcon />}
							</button>
							<button
								className={styles['form__input--delete']}
								onClick={() => setPasswordCheck('')}
								tabIndex={-1}
							>
								<DeleteIcon />
							</button>
						</div>
					</div>
					<div className={styles['error-message']}>
						{errorMessage || '\u00A0'}
					</div>
					<button className={styles.box__button} onClick={handleStep}>
						다음
					</button>
				</div>
			)}
		</div>
	);
}
