// store/store.ts
import {configureStore} from '@reduxjs/toolkit';
import userSlice from "@/lib/redux/slices/userSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
    },
});

// Định nghĩa RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;