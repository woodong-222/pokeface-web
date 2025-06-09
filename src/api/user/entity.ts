export interface UserInfo {
	id: string;
	username: string;
	user_id: string;
	joinDate: string;
	profilePokemonId: number;
}

export interface UserStats {
	totalPokemon: number;
	caughtPokemon: number;
	completionRate: number;
	totalCatches: number;
	evolutionCount: number;
	lastLoginDate: string;
	recentCaptures: number;
	favoritePokemonNumber: number | null;
	favoritePokemonCount: number;
}

export interface MeResponse {
	message: string;
	user: UserInfo;
	stats: UserStats;
}

export interface UserStatsResponse {
	message: string;
	data: {
		total_captures: number;
		unique_pokemon_count: number;
		completion_rate: number;
		total_pokemon_count: number;
		last_capture_date: string | null;
		recent_captures_7days: number;
		favorite_pokemon: Array<{
			pokemon_number: number;
			count: number;
		}>;
	};
}