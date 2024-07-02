import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      console.log(state.currentUser);
      state.loading = false;
      state.error = false;
    },
    signInError: (state) => {
      state.loading = false;
      state.error = true;
    },
    signOut: (state) => {
      state.currentUser = null;
    },
  },
});

export const { signInStart, signInSuccess, signInError, signOut } =
  userSlice.actions;

export default userSlice.reducer;
