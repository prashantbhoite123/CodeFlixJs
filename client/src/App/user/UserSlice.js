import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
}

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    SignInstart: (state) => {
      ;(state.loading = true), (state.error = null)
    },
    signSuccess: (state, action) => {
      ;(state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null)
    },
    signinFail: (state, action) => {
      ;(state.loading = false), (state.error = action.payload)
    },
    updateStart: (state, action) => {
      ;(state.loading = true), (state.error = null)
    },
    updateSuccess: (state, action) => {
      ;(state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null)
    },
    updateFail: (state, action) => {
      ;(state.loading = false), (state.error = action.payload)
    },
    deleteUserStart: (state) => {
      ;(state.loading = true), (state.error = null)
    },
    deleteUserSuccess: (state) => {
      ;(state.currentUser = null), (state.loading = false), (state.error = null)
    },
    deleteUserFail: (state, action) => {
      ;(state.loading = false), (state.error = action.payload)
    },
    signOutSuccess: (state) => {
      ;(state.currentUser = null), (state.loading = false)
      state.error = null
    },
  },
})

export const {
  SignInstart,
  signSuccess,
  signinFail,
  updateStart,
  updateSuccess,
  updateFail,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFail,
  signOutSuccess,
} = userSlice.actions

export default userSlice.reducer
