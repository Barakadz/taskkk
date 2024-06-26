// redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: '',
  lastName: '',
   phoneNumber:'',
  mail:'',
  department:'',
  job:'',
  loggedIn: 'false',
  directeur:''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.mail = action.payload.mail;
      state.phoneNumber = action.payload.phoneNumber;
      state.department = action.payload.department;
      state.job = action.payload.job;
      state.directeur = action.payload.directeur;


       state.loggedIn =  action.payload.loggedIn;
    },
    clearUser(state) {
      state.firstName = '';
      state.lastName = '';
      state.mail = '';
      state.phoneNumber = ''; 
      state.department = '';
      state.job = '';
      state.directeur = '';

       state.loggedIn = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
