import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMarket } from "../thunks/fetchMarket";

import { Market } from "../../types/market";

interface MarketState {
  market: Market[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  market: [],
  loading: false,
  error: null,
};

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    // WebSocket'ten gelen veriyi güncellemek için reducer
    updateMarket: (state, action: PayloadAction<Market[]>) => {
      state.market = action.payload; // WebSocket'ten gelen verileri state'e kaydet
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMarket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchMarket.fulfilled,
      (state, action: PayloadAction<Market[]>) => {
        state.market = action.payload; // API'den gelen salon verisi
        state.loading = false;
        state.error = null;
      }
    );
    builder.addCase(fetchMarket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string; // Hata mesajı
    });
  },
});

// `updateSalons` action'ını dışa aktar
export const { updateMarket } = marketSlice.actions;

export default marketSlice.reducer;
