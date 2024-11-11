// types/leaderboard.ts

export interface HpData {
  telegram_id: number;
  hp: number;
  username: string;
  photo_url: string;
}

export interface GameData {
  telegram_id: number;
  username: string;
  wins: number;
  photo_url: string;
}

export interface LeaderboardResponse {
  hp: HpData[];
  game: GameData[];
}
