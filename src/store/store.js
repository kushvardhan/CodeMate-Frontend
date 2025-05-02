import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../slice/UserSlice';
import requestReducer from '../slice/RequestSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    request: requestReducer,
  },
})
