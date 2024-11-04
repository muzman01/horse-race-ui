import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUser } from "../thunks/fetchUser";
import { User } from "../../types/user";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.error = null;
      state.loading = false;
    },
    clearUser(state) {
      state.user = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = { ...state.user, ...action.payload };
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateClickScore(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.click_score = (state.user.click_score ?? 0) + action.payload;
      }
    },
    updateTonAmount(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.ton_amount = (state.user.ton_amount ?? 0) + action.payload;
      }
    },
    updateClickPower(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.click_power = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload.user; // Kullanıcı verisi başarılı geldiğinde
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setUser,
  clearUser,
  updateUser,
  setLoading,
  setError,
  updateClickScore,
  updateClickPower,
  updateTonAmount
} = userSlice.actions;

export default userSlice.reducer;
