import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import salonReducer from "./slices/salonSlice";
import martketReducer from "./slices/marketSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    salon: salonReducer,
    market: martketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
