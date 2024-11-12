import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/user";

interface FetchUserArgs {
  telegram_id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  hash: any;
  initData: any;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        initData,
        hash,
      } = args;

      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Init-Data": initData || "", // initData'yi başlık olarak ekleyin
          "X-Hash": hash || "", // hash'i başlık olarak ekleyin
        },
        body: JSON.stringify({
          telegram_id,
          first_name,
          last_name,
          username,
          photo_url,
          language_code,
        }),
      });

      if (!response.ok) {
        throw new Error("Kullanıcı verisi alınamadı");
      }

      const data = await response.json();
      const user: User = data.result[0];
      const token: string = data.result[1];

      localStorage.setItem("token", token);

      return { user, token };
    } catch (error) {
      return thunkAPI.rejectWithValue("Kullanıcı verisi alınamadı");
    }
  }
);
