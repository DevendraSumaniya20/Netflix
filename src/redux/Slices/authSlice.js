import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: '',
    password: '',
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    clearCredentials: state => {
      state.email = '';
      state.password = '';
    },
  },
});

export const {setEmail, setPassword, clearCredentials} = authSlice.actions;
export default authSlice.reducer;
