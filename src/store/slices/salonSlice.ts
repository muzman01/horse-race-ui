import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSalons } from "../thunks/fetchSalons";
import { Salon } from "../../types/salon";

interface SalonState {
  salons: Salon[];
  loading: boolean;
  error: string | null;
}

const initialState: SalonState = {
  salons: [],
  loading: false,
  error: null,
};

const salonSlice = createSlice({
  name: "salon",
  initialState,
  reducers: {
    // WebSocket'ten gelen veriyi güncellemek için reducer
    updateSalons: (state, action: PayloadAction<Salon[]>) => {
      state.salons = action.payload; // WebSocket'ten gelen verileri state'e kaydet
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSalons.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchSalons.fulfilled,
      (state, action: PayloadAction<Salon[]>) => {
        state.salons = action.payload; // API'den gelen salon verisi
        state.loading = false;
        state.error = null;
      }
    );
    builder.addCase(fetchSalons.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string; // Hata mesajı
    });
  },
});

// `updateSalons` action'ını dışa aktar
export const { updateSalons } = salonSlice.actions;

export default salonSlice.reducer;
