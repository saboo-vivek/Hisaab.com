import "./home.css";
import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addExpense } from "../reduxComp/actions";
import { useExpenseContext } from "../reduxComp/ExpenseContext";


const Home = () => {
   const {categories}=useExpenseContext();
   const [formData, setFormData] = useState({
      price: "",
      description: "",
      category: "",
   });
   const [expAlert, setExpAlert] = useState(false);
   
   const dispatch = useDispatch();
   const { expenses } = useSelector((state) => state.expenses);
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const token = localStorage.getItem("token");
   const parseJwt = (token) => {
      try {
         return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
         return null;
      }
   };
   const decodeToken = parseJwt(token);
   const BASE_URL = process.env.REACT_APP_BACKEND_API;
   
   const handleAddExpense = async (e) => {
      e.preventDefault();
      console.log("decoded token:", decodeToken);
      try {
         const res = await axios.post(
            `${BASE_URL}/addexpense`,
            formData,
            {
               headers: { Authorization: token },
            }
         );
         if (res.status === 200) {
            dispatch(addExpense(res.data));
            console.log(expenses);
            setFormData({
               price: "",
               description: "",
               category: "",
            });
            
            setExpAlert(true);
            setTimeout(() => setExpAlert(false), 2000);
         }
      } catch (error) {
         console.error("Error posting data:", error);
      }
   };

   return (
      <div className="homebody background-image">
         <div>
            {expAlert && (
               <Alert key="primary" className="alertclass" variant="primary">
                  New Expense Added.
               </Alert>
            )}

            <form id="formId">
               <div className="container">
                  <h2>Add Expenses</h2>
               </div>
               <hr />

               <input
                  type="number"
                  id="expense"
                  name="price"
                  placeholder="Choose Expense price..."
                  required
                  value={formData.price}
                  onChange={handleChange}
               />

               <input
                  type="text"
                  id="description"
                  name="description"
                  required
                  placeholder="Write Something (Description)..."
                  value={formData.description}
                  onChange={handleChange}
               />

               <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
               >
                  {categories.map((cat) => (
                     <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                     </option>
                  ))}
               </select>

               <button className="formId-button" onClick={handleAddExpense}>
                  Add Expense
               </button>
            </form>
         </div>
         
      </div>
   );
};

export default Home;

