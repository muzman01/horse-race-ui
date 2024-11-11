// store/thunks/fetchLeaderboard.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../index";
import { LeaderboardResponse } from "../../types/leaderboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchLeaderboard = createAsyncThunk<
  LeaderboardResponse, // Başarılı olduğunda dönecek tür
  void, // Parametre yok
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("leaderboard/fetchLeaderboard", async (_, thunkAPI) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_leaderboard`);

    if (!response.ok) {
      return thunkAPI.rejectWithValue("Leaderboard verisi alınamadı");
    }

    const data = await response.json();
    const leaderboard: LeaderboardResponse = data.result; // API’den gelen kullanıcı verisi
    return leaderboard;
  } catch (error) {
    return thunkAPI.rejectWithValue("Leaderboard verisi alınamadı");
  }
});
