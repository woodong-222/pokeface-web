import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@bcsdlab/utils';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BlindIcon from 'src/assets/blind.svg?react';
import EyeIcon from 'src/assets/eye.svg?react';
import LockIcon from 'src/assets/lock.svg?react';
import ManIcon from 'src/assets/man.svg?react';
import Logo from 'src/assets/logo.svg?react';
import {SignupRequest} from '../../../api/auth/entity';
import useCheckNickname from './hooks/useCheckNickname';
import useSignup from './hooks/useSignup';
import styles from './SignupPage.module.scss';

export default function SignupPage() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({ mode: 'onChange' });

	const { mutate: signup } = useSignup();

	const { mutate: checkNickname, isError: isNicknameError } =
		useCheckNickname();

	const onSubmit = async (data: any) => {

		const submitData: SignupRequest = {
			user_id: data.id!,
			user_pw: data.password!,
			confirm_user_pw: data['password-check']!,
			user_name: nickname
		};

		if (nickname !== watch('nickname') || isNicknameError) {
			return;
		}

		signup(submitData);
	};

	const passwordRef = useRef(null);
	passwordRef.current = watch('password');

	const [isPasswordBlind, setIsPasswordBlind] = useState(true);
	const [isPasswordCheckBlind, setIsPasswordCheckBlind] = useState(true);

	const [nickname, setNickname] = useState('');

	const handlePasswordShow = () => {
		if (isPasswordBlind) {
			setIsPasswordBlind(false);
		} else {
			setIsPasswordBlind(true);
		}
	};

	const handlePasswordCheckShow = () => {
		if (isPasswordCheckBlind) {
			setIsPasswordCheckBlind(false);
		} else {
			setIsPasswordCheckBlind(true);
		}
	};

	const handleCheckNickname = (nickname: string) => {
		if (!nickname) {
			toast('닉네임을 입력해주세요.', { type: 'warning' });
			return;
		}

		setNickname(nickname);
		checkNickname(nickname);
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
			<form className={styles.container__form} onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.container__auth}>
					<div
						className={cn({
							[styles.container__input]: true,
							[styles['container__input--error']]: !!errors.id,
						})}
					>
						<ManIcon />
						<input
							className={styles['container__input--field']}
							placeholder="아이디 (필수)"
							type="text"
							{...register('id', {
								required: '아이디를 입력해주세요.',
							})}
						/>
					</div>
					<div
						className={cn({
							[styles.container__input]: true,
							[styles['container__input--error']]: !!errors.password,
						})}
					>
						<LockIcon />
						<input
							className={styles['container__input--field']}
							placeholder="비밀번호 (필수)"
							type={isPasswordBlind ? 'password' : 'text'}
							{...register('password', {
								required: { value: true, message: '비밀번호를 입력해주세요.' },
								minLength: {
									value: 8,
									message: '비밀번호는 8자리 이상이어야 합니다.',
								},
								pattern: {
									value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W).+$/,
									message: '비밀번호는 영문, 특수문자, 숫자를 포함해야 합니다.',
								},
							})}
						/>
						<button
							type="button"
							className={styles['container--password-hide']}
							onClick={handlePasswordShow}
							tabIndex={-1}
						>
							{isPasswordBlind ? <BlindIcon /> : <EyeIcon />}
						</button>
					</div>
					<div
						className={cn({
							[styles.container__input]: true,
							[styles['container__input--error']]: !!errors['password-check'],
						})}
					>
						<LockIcon />
						<input
							className={styles['container__input--field']}
							placeholder="비밀번호 확인 (필수)"
							type={isPasswordCheckBlind ? 'password' : 'text'}
							{...register('password-check', {
								required: {
									value: true,
									message: '비밀번호 확인을 입력해주세요.',
								},
								validate: (value) =>
									value === passwordRef.current ||
									'비밀번호가 일치하지 않습니다.',
							})}
						/>
						<button
							type="button"
							className={styles['container--password-hide']}
							onClick={handlePasswordCheckShow}
							tabIndex={-1}
						>
							{isPasswordCheckBlind ? <BlindIcon /> : <EyeIcon />}
						</button>
					</div>
				</div>
				{(errors.id || errors.password || errors['password-check']) && (
					<div className={styles['error-container']}>
						{errors.id && (
							<div className={styles['error-message']}>
								{errors.id.message as string}
							</div>
						)}
						{errors.password && (
							<div className={styles['error-message']}>
								{errors.password.message as string}
							</div>
						)}
						{errors['password-check'] && (
							<div className={styles['error-message']}>
								{errors['password-check'].message as string}
							</div>
						)}
					</div>
				)}
				<div className={styles['input-container']}>
					<div
						className={cn({
							[styles['input-container__input']]: true,
							[styles['input-container__input--error']]: !!errors.nickname,
						})}
					>
						<ManIcon />
						<input
							className={styles['input-container__input--field']}
							placeholder="닉네임 (필수)"
							type="text"
							{...register('nickname', {
								required: { value: true, message: '닉네임을 입력해주세요.' },
							})}
						/>
					</div>
					<button
						type="button"
						className={styles['input-container--check']}
						onClick={() => handleCheckNickname(watch('nickname'))}
					>
						중복확인
					</button>
				</div>
				{(errors.nickname ||
					watch('nickname') ||
					watch('nickname', '') !== nickname) && (
					<div className={styles['error-container']}>
						{errors.nickname && (
							<div className={styles['error-message']}>
								{errors.nickname.message as string}
							</div>
						)}
						{watch('nickname') && watch('nickname') !== nickname && (
							<div className={styles['check-message']}>
								닉네임 중복확인을 해주세요.
							</div>
						)}
					</div>
				)}
				<button type="submit" className={styles['container--submit']}>
					가입
				</button>
			</form>
		</div>
	);
}
