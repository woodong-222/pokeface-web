import useTokenState from '../../hooks/useTokenState.ts';
import DexPage from '../DexPage/index.tsx';
import NonLoginView from './NonLoginView/index.tsx';

export default function IndexPage() {
	const token = useTokenState();
	return token ? <DexPage /> : <NonLoginView />;
}
