import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import salonReducer from "./slices/salonSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    salon: salonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
