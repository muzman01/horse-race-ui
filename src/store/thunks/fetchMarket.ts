// store/thunks/fetchSalons.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState, AppDispatch } from "../index";
import { Market } from "../../types/market";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMarket = createAsyncThunk<
  Market[], // Thunk başarılı olduğunda dönecek tür
  void, // Parametre yok
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("market/fetchMarket", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${API_BASE_URL}/market`);

    if (!response.ok) {
      return thunkAPI.rejectWithValue("Salon verisi alınamadı");
    }

    const data = await response.json();
    const market: Market[] = data.result; // Kullanıcı verisi
    return market;
  } catch (error) {
    return thunkAPI.rejectWithValue("Salon verisi alınamadı");
  }
});
