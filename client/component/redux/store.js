// redux/store.js ==> to store data
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';// to chane data

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
