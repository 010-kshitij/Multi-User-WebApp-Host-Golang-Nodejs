import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: "",
    name: "",
    username: "",
    email: "",
    token: "",
    isLoggedIn: false
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setUsername: (state, action) => {
        state.username = action.payload;
    },
    setEmail: (state, action) => {
        state.email = action.payload;
    }, 
    setToken: (state, action) => {
        state.token = action.payload;
    }, 
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setId, setName, setUsername, setEmail, setToken, setIsLoggedIn } = userSlice.actions;

export default userSlice.reducer;