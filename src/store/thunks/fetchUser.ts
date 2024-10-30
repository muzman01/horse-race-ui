// store/thunks/fetchUser.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/user";

interface FetchUserArgs {
  telegram_id: number; // Zorunlu alan
  first_name?: string; // İsteğe bağlı
  last_name?: string; // İsteğe bağlı
  username?: string; // İsteğe bağlı
  photo_url?: string; // İsteğe bağlı
  language_code?: string; // İsteğe bağlı
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // .env dosyasından URL'yi alıyoruz

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (args: FetchUserArgs, thunkAPI) => {
    try {
      const {
        telegram_id,
        first_name,
        last_name,
        username,
        photo_url,
        language_code,
      } = args;

      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telegram_id, // Zorunlu alan
          first_name, // İsteğe bağlı
          last_name, // İsteğe bağlı
          username, // İsteğe bağlı
          photo_url, // İsteğe bağlı
          language_code, // İsteğe bağlı
        }),
      });

      if (!response.ok) {
        throw new Error("Kullanıcı verisi alınamadı");
      }

      const data = await response.json();
      const user: User = data.result[0]; // Kullanıcı verisi
      const token: string = data.result[1]; // Token

      // Token'ı localStorage'e kaydet
      localStorage.setItem("token", token);

      // Redux state'e kullanıcı verisi ve token döner
      return { user, token };
    } catch (error) {
      return thunkAPI.rejectWithValue("Kullanıcı verisi alınamadı");
    }
  }
);
