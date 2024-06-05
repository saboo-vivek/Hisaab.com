// reducer.js
import {
   ADD_EXPENSE,
   DELETE_EXPENSE,
   EDIT_EXPENSE,
   FETCH_EXPENSES,
} from "./actions";

const initialState =  [];


const expenseReducer = (state = initialState, action) => {
   switch (action.type) {
      case FETCH_EXPENSES:
         return {
            ...state,
            expenses: action.payload,
         };
      case ADD_EXPENSE:
         return {
            ...state,
            expenses: [...state.expenses, action.payload],
         };
      case DELETE_EXPENSE:
         return {
            ...state,
            expenses: state.expenses.filter(
               (expense) => expense.id !== action.payload
            ),
         };
      case EDIT_EXPENSE:
         return {
            ...state,
            expenses: state.expenses.map((expense) =>
               expense.id === action.payload.id ? action.payload : expense
            ),
         };
      default:
         return state;
   }
};

export default expenseReducer;
