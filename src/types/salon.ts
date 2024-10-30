export interface Table {
    table_id: number;
    players: any[]; // Oyuncuların isimleri veya kimlikleri
    bet_amount: number; // Bahis miktarı
    game_state: "Waiting" | "Ready" | "Started" | "Completed"; // Oyunun durumu
  }
  
  export interface Salon {
    salon_id: number;
    name: string; // Salon ismi (Bronz, Demir, Silver vs.)
    entry_fee: number; // Giriş ücreti
    tables: Table[]; // Salon içindeki masalar
    created_at: number; // Unix zaman damgası
  }
  
