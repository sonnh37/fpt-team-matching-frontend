import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IdeaRequestState {
  totalPending: number;
  totalAssignReviewer: number;
}

const initialState: IdeaRequestState = {
  totalPending: 0,
  totalAssignReviewer: 0,
};

const ideaRequestSlice = createSlice({
  name: "ideaRequest",
  initialState,
  reducers: {
    setTotalPending: (state, action: PayloadAction<number>) => {
      state.totalPending = action.payload;
    },
    setTotalAssignReviewer: (state, action: PayloadAction<number>) => {
      state.totalAssignReviewer = action.payload;
    },
  },
});

export const { setTotalPending, setTotalAssignReviewer } = ideaRequestSlice.actions;
export default ideaRequestSlice.reducer;
