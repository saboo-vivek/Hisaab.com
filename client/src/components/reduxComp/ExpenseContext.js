import React, { useState, createContext, useContext } from "react";
import axios from "axios";

const ExpenseContext = createContext();

export const useExpenseContext = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
   const token = localStorage.getItem("token");

   const parseJwt = (token) => {
      try {
         return JSON.parse(atob(token.split(".")[1]));
      } catch (e) {
         return null;
      }
   };
   const decodeToken = parseJwt(token);

   const categories = [
      "Choose Category...",
      "Books",
      "Electronics",
      "Vehicles",
      "Food",
      "Shopping",
      "Rent",
      "Bill",
      "Travel",
   ];
   const BASE_URL = process.env.REACT_APP_BACKEND_API;
   const handlePremium = async () => {
      try {
         const response = await axios.get(`${BASE_URL}/purchase/premium`, {
            headers: { Authorization: token },
         });

         const { key_id, order } = response.data;

         const options = {
            key: key_id,
            order_id: order.id,
            handler: async function (response) {
               try {
                  const res = await axios.post(
                     `${BASE_URL}/purchase/updatetransactionstatus`,
                     {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                     },
                     { headers: { Authorization: token } }
                  );

                  alert("You are a premium user");
                  localStorage.setItem("token", res.data.token);
               } catch (err) {
                  console.error("Error updating transaction status:", err);
                  alert("Failed to update transaction status");
               }
            },
         };

         const rzp1 = new window.Razorpay(options);
         rzp1.open();

         rzp1.on("payment.failed", async function (response) {
            try {
               console.error("Payment failed", response.error);

               await axios.post(
                  `${BASE_URL}/purchase/updatetransactionfail`,
                  {
                     order_id: options.order_id,
                     payment_id: response.error.metadata.payment_id,
                  },
                  { headers: { Authorization: token } }
               );

               alert("Payment failed");
            } catch (err) {
               console.error("Error handling failed payment:", err);
               alert("Failed to handle payment failure");
            }
         });
      } catch (error) {
         console.error("Error purchasing premium:", error);
         alert("Failed to initiate premium purchase");
      }
   };

   const downloadExpenses = async () => {
      console.log("download btn clicked");
      try {
         let response = await axios.get(`${BASE_URL}/download`, {
            headers: { Authorization: token },
         });
         console.log("response", response);
         if (response.status === 200) {
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = "myexpense.csv";
            a.click();
         } else {
            throw new Error(response.data.message);
         }
      } catch (err) {
         console.error("Error while downloading:", err);
         alert("Failed to download");
      }
   };

   return (
      <ExpenseContext.Provider
         value={{
            handlePremium,
            categories,
            downloadExpenses,
         }}
      >
         {children}
      </ExpenseContext.Provider>
   );
};
