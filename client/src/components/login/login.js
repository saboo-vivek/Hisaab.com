import "./Login.css";
import { useState } from "react";
import { FloatingLabel, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "../reduxComp/actions";
import { NavLink } from "react-router-dom";
export default function Login() {
   const dispatch = useDispatch();
   const { loading, error } = useSelector((state) => state.auth);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();
   const BASE_URL = process.env.REACT_APP_BACKEND_API;
   async function handleLogin(e) {
      e.preventDefault();
      let obj = {
         email: email,
         password: password,
      };
      try {
         let response = await axios.post(`${BASE_URL}/login`, obj);
         alert(response.data.message);

         const { token } = response.data;
         localStorage.setItem("token", token);
         dispatch(loginSuccess(token));
         navigate("/home");
      } catch (error) {
         if (error.response) {
            alert(error.response.data.error);
         } else {
            alert("An unexpected error occurred. Please try again later.");
            dispatch(loginFailure(error.response.data));
            console.error("Error Signing Up:", error);
         }
      }
   }

   function handleSignUp() {
      navigate("/signup");
   }

   return (
      <>
         <div className="lbody background-image">
            <div className="container">
               <div className="row justify-content-center mt-5">
                  <div className="col-md-6">
                     <div className="contact-form">
                        <h2 className="text-center mb-4">Login</h2>
                        <form>
                           <div className="mb-3">
                              <input
                                 type="email"
                                 className="form-control"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 placeholder="Email"
                              />
                           </div>
                           <div className="mb-3">
                              <input
                                 type="password"
                                 className="form-control"
                                 id="password"
                                 name="password"
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
                                 placeholder="Password"
                              />
                           </div>

                           <div className="mb-3">
                              <button
                                 type="submit"
                                 className="loginButton"
                                 onClick={handleLogin}
                              >
                                 Login
                              </button>
                              <div className="forgetContainer">
                                 <NavLink
                                    to="/forgetpassword"
                                    className="forgetButton"
                                 >
                                    Forget Password?
                                 </NavLink>
                              </div>

                              <p className="span">Or New User</p>
                              <button
                                 type="submit"
                                 className="signupButton"
                                 onClick={handleSignUp}
                              >
                                 Create a new Account
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
