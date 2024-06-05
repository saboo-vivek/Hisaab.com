import React from "react";
import "./Footer.css";
function Footer() {
   return (
      <div>
         <footer className="footer background-image-footer">
            <div className="footer-content">
               <div className="footer-section">
                  <h3>Contact Us</h3>
                  <p>Email: info@example.com</p>
                  <p>Phone: +1 123-456-7890</p>
               </div>
               <div className="footer-section">
                  <h3>Address</h3>
                  <p>123 Main Street</p>
                  <p>City, Country</p>
               </div>
               <div className="footer-section">
                  <h3>Follow Us</h3>
                  <p>Facebook | Twitter | Instagram</p>
               </div>
            </div>
            <div className="footer-bottom">
               <p>&copy; 2024 Your Company Name. All rights reserved.</p>
            </div>
         </footer>
      </div>
   );
}

export default Footer;
