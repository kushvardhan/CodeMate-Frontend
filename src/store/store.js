import { combineReducers, configureStore } from "@reduxjs/toolkit";
import connectionReducer from "../slice/ConnectionSlice";
import requestReducer from "../slice/RequestSlice";
import userReducer from "../slice/UserSlice";

// Create a root reducer with a special case for logout
const appReducer = combineReducers({
  user: userReducer,
  request: requestReducer,
  connection: connectionReducer,
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
