import privateAxios from '../privateAxios';
import {
	CaptureRequest,
	CaptureResponse,
	AlbumResponse,
	AlbumParams,
	UserPokemonResponse,
} from './entity';

export const capturePokemon = async (captureData: CaptureRequest): Promise<CaptureResponse> => {
	const formData = new FormData();
	formData.append('image', captureData.image);

	const { data } = await privateAxios.post<CaptureResponse>('/pokemon/capture.php', formData, {
		headers: {
		'Content-Type': 'multipart/form-data',
		},
	});

	return data;
};

export const getAlbum = async (params: AlbumParams = {}): Promise<AlbumResponse> => {
	const { page = 1, limit = 20, order = 'desc' } = params;
	
	const { data } = await privateAxios.get<AlbumResponse>('/pokemon/album.php', {
		params: { page, limit, order },
	});

	return data;
};

export const getUserPokemons = async (): Promise<UserPokemonResponse> => {
	const { data } = await privateAxios.get<UserPokemonResponse>('/pokemon/user_pokemon.php');
	return data;
};