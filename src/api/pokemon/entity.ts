// 포켓몬 관련 API 타입 정의

export interface CaptureRecord {
  id: number;
  pokemonName?: string; // 옵셔널로 추가 (클라이언트에서 추가할 수 있음)
  pokemonNumber: number;
  originalImage: string;
  captureDate: string;
}

export interface CaptureRequest {
  image: File;
}

export interface CaptureResponse {
  message: string;
  capture_id: number;
  pokemon_number: number;
  image_path: string;
}

export interface AlbumResponse {
  message: string;
  data: CaptureRecord[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface AlbumParams {
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
}

export interface UserPokemon {
  pokemon_id: number;
  evolution_stage: number;
  captured_at: string;
  updated_at: string;
}

export interface UserPokemonResponse {
  message: string;
  pokemons: UserPokemon[];
  count: number;
}