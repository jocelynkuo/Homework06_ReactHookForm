import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../slice/MessageSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
  },
});

export default store;
