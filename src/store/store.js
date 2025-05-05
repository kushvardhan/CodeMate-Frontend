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

// This root reducer will reset all state when logout action is dispatched
const rootReducer = (state, action) => {
  // When logout action is detected, reset all state to initial values
  if (action.type === "user/logoutUser") {
    // Reset state to undefined so each reducer returns its initial state
    state = undefined;
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
