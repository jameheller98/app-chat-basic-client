import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/User/userSlice";
import chatReducer from "./features/Chat/chatSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
