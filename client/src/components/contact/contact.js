import "./contact.css";
import React, { useState } from "react";
import MyNavbar from "../navbar/MyNavbar";
import Footer from "../footer/Footer";
import axios from "axios";

const ContactUs = () => {
   const [formData, setFormData] = useState({
      name: "",
      phone: "",
      message: "",
   });
   const token = localStorage.getItem("token");
   const BASE_URL = process.env.REACT_APP_BACKEND_API;
   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("CONTACT US BUTTON CLICKED");
      try {
         let response = await axios.post(`${BASE_URL}/contactus`, formData, {
            headers: { Authorization: token },
         });
         setFormData({
            name: "",
            phone: "",
            message: "",
         });
         console.log("RESPONSE : ", response);
      } catch (error) {
         console.error("Error storing data:", error);
      }
   };

   return (
      <div className="cbody background-image">
         <div className="container">
            <div className="row justify-content-center mt-5">
               <div className="col-md-6">
                  <div className="contact-form">
                     <h2 className="text-center mb-4">Contact Us</h2>
                     <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                           <input
                              type="text"
                              className="form-control"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Name"
                           />
                        </div>
                        <div className="mb-3">
                           <input
                              type="phone"
                              className="form-control"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Phone"
                           />
                        </div>
                        <div className="mb-3">
                           <textarea
                              className="form-control"
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="Message"
                           />
                        </div>
                        <div className="mb-3">
                           <button type="submit" className="contactButton">
                              Submit
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ContactUs;
