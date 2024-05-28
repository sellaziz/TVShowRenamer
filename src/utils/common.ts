export type EpisodeDetails = {
  show_name: string;
  episode_number: number;
  season_number: number;
  poster_path: string | null;
  show_poster_path: string | null;
  episode_name: string | null;
};

export type File = {
  id: string;
  original_name: string;
  extension: string;
  new_name: string;
  show_name: string;
  path?: string;
  episode_details?: EpisodeDetails | null;
}
