// store/thunks/fetchSalons.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Salon } from "../../types/salon";
import { RootState, AppDispatch } from "../index";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSalons = createAsyncThunk<
  Salon[], // Thunk başarılı olduğunda dönecek tür
  void, // Parametre yok
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("salon/fetchSalons", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${API_BASE_URL}/salons`);

    if (!response.ok) {
      return thunkAPI.rejectWithValue("Salon verisi alınamadı");
    }

    const data = await response.json();
    const salon: Salon[] = data.result; // Kullanıcı verisi
    return salon;
  } catch (error) {
    return thunkAPI.rejectWithValue("Salon verisi alınamadı");
  }
});
