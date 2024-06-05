// authReducer.js
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "./actions";

const initialState = {
   token: localStorage.getItem("token") || null,
   isAuthenticated: !!localStorage.getItem("token"),
   error: null,
};

const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case LOGIN_SUCCESS:
         return {
            ...state,
            token: action.payload,
            isAuthenticated: true,
            error: null,
         };
      case LOGIN_FAILURE:
         return {
            ...state,
            error: action.payload,
         };
      case LOGOUT:
         return {
            ...state,
            token: null,
            isAuthenticated: false,
         };
      default:
         return state;
   }
};

export default authReducer;
