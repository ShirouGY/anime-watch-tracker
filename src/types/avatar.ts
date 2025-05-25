
export interface AvatarOption {
  url: string;
  isPremium: boolean;
  name: string;
  animeId?: string;
  animeTitle?: string;
  isUnlocked?: boolean;
}

export interface AvatarFile {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}
