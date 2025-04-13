// store/store.ts
import {configureStore} from '@reduxjs/toolkit';
import userSlice from "@/lib/redux/slices/userSlice";
import ideaRequestSlice from './slices/ideaRequestSlice';
import cacheReducer from "./slices/cacheSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        ideaRequest: ideaRequestSlice,
        cache: cacheReducer,
    },
});

// Định nghĩa RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;