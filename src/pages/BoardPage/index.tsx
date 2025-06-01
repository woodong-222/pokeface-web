import { Outlet } from 'react-router-dom';
import Footer from '../../components/Footer';
import styles from './BoardPage.module.scss';

export default function BoardPage() {
	return (
		<div className={styles.boardContainer}>
			<Outlet />
			<Footer />
		</div>
	);
}
