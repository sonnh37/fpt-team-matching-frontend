// store/store.ts
import {configureStore} from '@reduxjs/toolkit';
import userSlice from "@/lib/redux/slices/userSlice";
import cacheReducer from "./slices/cacheSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        cache: cacheReducer,
    },
});

// Định nghĩa RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;