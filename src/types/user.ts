// types/user.ts
export interface Boost {
    level: number;
    start_time: number; // Unix timestamp, başlangıç zamanı
    duration_days: number; // Boost kaç gün sürecek
  }
  
  export interface ReferenceLevel {
    total_reference_required: number; // Level tamamlamak için gereken toplam referans
    is_started: boolean; // Level başladı mı?
    is_finished: boolean; // Level bitti mi?
    current_reference: number; // Mevcut referans sayısı
  }
  
  export interface References {
    level1: ReferenceLevel;
    level2: ReferenceLevel;
    level3: ReferenceLevel;
    level4: ReferenceLevel;
  }
  
  export interface User {
    telegram_id: number; // Zorunlu alan
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    language_code?: string;
    hp?: number; // Tab Tab puanlarından kazanılan HP
    ton_amount?: number; // Kullanıcının TON miktarı
    wallet_address?: string;
  
    click_score?: number; // Toplam tıklama puanı
    click_power?: number; // Her tıklamada kazanacağı puan
  
    boost?: Boost; // Kullanıcının Boost bilgisi
    references?: References; // Referans sistemi
  }
  