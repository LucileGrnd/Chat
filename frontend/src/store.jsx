import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true };
  }
  if (action.type === "set-messages") {
    console.log("action: ", action);
    return { ...state, msgs: action.messages };
  }
  if (action.type === "logout") {
    console.log("action: ", action);
    return { ...state, loggedIn: false };
  }
  if (action.type === "delete") {
    console.log("action: ", action);
    return { ...state, delete: true };
  }
  if (action.type === "active") {
    return { ...state, actives: action.active };
  }
  if (action.type === "admin") {
    return { ...state, admin: true };
  }
  return state;
};

let store = createStore(
  reducer,
  { msgs: [], loggedIn: false, delete: false, actives: [], admin: false },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
