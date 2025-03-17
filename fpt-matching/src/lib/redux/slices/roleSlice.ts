import { userService } from "@/services/user-service";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface RoleState {
  currentRole: string | null;
  status: "idle" | "loading" | "failed";
}

const initialState: RoleState = {
  currentRole: null,
  status: "idle",
};

interface UserCache {
  role?: string;
}

export const updateUserCache = createAsyncThunk(
  "role/updateUserCache",
  async ({ newCache }: { newCache: UserCache }, { rejectWithValue }) => {
    try {
      const response = await userService.updateCache(newCache);
      return newCache;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

export const initializeRole = createAsyncThunk(
  "role/initialize",
  async (userCache: string | null) => {
    try {
      if (!userCache) return null;
      const parsedCache = JSON.parse(userCache);
      return parsedCache || null;
    } catch (error) {
      console.error("Error parsing userCache:", error);
      return null;
    }
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.currentRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserCache.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserCache.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload?.role) {
          state.currentRole = action.payload.role;
        }
      })
      .addCase(updateUserCache.rejected, (state) => {
        state.status = "failed";
      });
    builder.addCase(initializeRole.fulfilled, (state, action) => {
      state.currentRole = action.payload.role;
    });
  },
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;
