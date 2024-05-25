import { EpisodeDetails } from '../utils/common.ts';

async function fetchEpisodeDetails(showName: string, seasonNumber: number, episodeNumber: number, apiKey: string): Promise<EpisodeDetails> {
    const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${showName}`);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error('TV show not found');
    }
    const tvShowId = data.results[0].id;

    const episodeResponse = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${apiKey}`);
    const episodeData = await episodeResponse.json();

    return {
        show_name: data.results[0].name,
        season_number: seasonNumber,
        episode_number: episodeNumber,
        poster_path: episodeData.still_path || null,
        show_poster_path: data.results[0].poster_path || null,
        episode_name: episodeData.name || null
    };
}

export default fetchEpisodeDetails;