import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BoardPage from './pages/BoardPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import FindPasswordPage from './pages/Auth/FindPasswordPage';
import IndexPage from './pages/IndexPage';
import HuntPage from './pages/Dex/HuntPage';
import AlbumPage from './pages/Dex/AlbumPage';
import CommunityPage from './pages/Dex/CommunityPage';
import NoticePage from './pages/Dex/NoticePage';
import MypagePage from './pages/Dex/MypagePage';
import SamplePage from './pages/Dex/SamplePage';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<BoardPage />}>
						<Route path="/" element={<IndexPage />} />
						<Route path="/auth" element={<LoginPage />} />
						<Route path="/auth/signup" element={<SignupPage />} />
						<Route path="/auth/find-pw" element={<FindPasswordPage />} />
						<Route path="/hunt" element={<HuntPage />} />
						<Route path="/album" element={<AlbumPage />} />
						<Route path="/community" element={<CommunityPage />} />
						<Route path="/notice" element={<NoticePage />} />
						<Route path="/mypage" element={<MypagePage />} />
						<Route path="/sample" element={<SamplePage />} />
					</Route>
				</Routes>
				<ToastContainer />
			</BrowserRouter>
		</>
	);
}

export default App;
