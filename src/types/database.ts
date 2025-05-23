
export interface AnimeProgress {
  id: string;
  user_id: string;
  anime_list_id: string;
  current_episode: number;
  total_episodes: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  anime_id: string;
  anime_title: string;
  anime_icon?: string;
  achievement_type: string;
  unlocked_at: string;
  created_at: string;
}
