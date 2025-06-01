import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BoardPage from './pages/BoardPage';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/Auth/LoginPage';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<BoardPage />}>
						<Route path="/" element={<IndexPage />} />
						<Route path="/auth" element={<LoginPage />} />
					</Route>
				</Routes>
				<ToastContainer />
			</BrowserRouter>
		</>
	);
}

export default App;
