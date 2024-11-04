// types/market.ts
export interface Market {
  id: any; // UUID as a string since we will handle BSON encoding/decoding
  item_name: string;
  item_slug: string;
  reputation_points: number;
  price: number;
  seller: number; // Telegram ID of the seller
}
