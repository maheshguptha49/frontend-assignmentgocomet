import { configureStore } from "@reduxjs/toolkit";
import { taskApiSlice } from "./taskApiSlice";

export const store = configureStore({
  reducer: {
    [taskApiSlice.reducerPath]: taskApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
