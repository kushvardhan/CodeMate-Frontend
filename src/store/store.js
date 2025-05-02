import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../slice/UserSlice';
import requestReducer from '../slice/RequestSlice';
import connectionReducer from '../slice/ConnectionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    request: requestReducer,
    connection: connectionReducer,
  },
})
