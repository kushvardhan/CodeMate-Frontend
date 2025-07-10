import { combineReducers, configureStore } from "@reduxjs/toolkit";
import connectionReducer from "../slice/ConnectionSlice";
import requestReducer from "../slice/RequestSlice";
import userReducer from "../slice/UserSlice";
import unseenSlice from "../slice/unseenSlice";

const appReducer = combineReducers({
  user: userReducer,
  request: requestReducer,
  connection: connectionReducer,
  unseenMessage: unseenSlice,
});

const rootReducer = (state, action) => {
  if (action.type === "user/logoutUser") {
    state = undefined;
  }
  

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
