// store/slices/leaderboardSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchLeaderboard } from "../thunks/fetchLeaderboard";
import { HpData, GameData, LeaderboardResponse } from "../../types/leaderboard";

interface LeaderboardState {
  hp: HpData[];
  game: GameData[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  hp: [],
  game: [],
  loading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLeaderboard.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchLeaderboard.fulfilled,
      (state, action: PayloadAction<LeaderboardResponse>) => {
        state.hp = action.payload.hp;
        state.game = action.payload.game;
        state.loading = false;
        state.error = null;
      }
    );
    builder.addCase(fetchLeaderboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default leaderboardSlice.reducer;
