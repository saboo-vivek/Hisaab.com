const User = require("../models/user");
// const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// exports.getLoginpage = (req, res) => {
//    res.sendFile(path.join(__dirname, "../screen/login.html"));
// };

// exports.getHome = (req, res) => {
//    res.sendFile(path.join(__dirname, "../screen/signup.html"));
// };

exports.postSignup = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      // Check if name, email, and password are provided
      if (!name || !email || !password) {
         return res.status(400).json({ error: "Name, email, and password are required" });
      }

      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(403).json({ error: "User already exists" });
      }

      // Hash the password
      bcrypt.hash(password, 10, async (err, hash) => {
         if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ error: "Internal server error" });
         }

         // Create a new user with hashed password
         const newUser = new User({
            name: name,
            email: email,
            password: hash,
         });
         await newUser.save();

         return res.status(201).json({ message: "Signed up successfully" });
      });
   } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Internal server error" });
   }
};



exports.postLogin = async (req, res, next) => {
   try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
         return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await User.findOne({ email });

      if (!user) {
         // User not found
         return res.status(404).json({ error: "User not found" });
      }

      // Compare passwords
      bcrypt.compare(password, user.password, async (err, response) => {
         if (err) {
            // Error while comparing passwords
            console.error("Error comparing passwords:", err);
            return res.status(500).json({ error: "Internal server error" });
         }

         if (response) {
            // Passwords match, generate token
            const token = jwt.sign(
               {
                  _id: user._id,
                  ispremiumuser: user.ispremiumuser,
               },
               process.env.TOKEN_KEY
            );

            return res.status(200).json({
               message: "Login successful",
               token: token,
            });
         } else {
            // Passwords don't match
            return res.status(401).json({ error: "Invalid credentials" });
         }
      });
   } catch (err) {
      // Catch any unexpected errors
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Internal server error" });
   }
};





// exports.postLogin = async (req, res, next) => {
//    try {
//       const { email, password } = req.body;
//       if (
//          password == null ||
//          email == null ||
//          email.length === 0 ||
//          password.length === 0
//       ) {
//          res.status(400).json({ err: "bad  parameters" });
//       }
//       // console.log(email, password);
//       const user = await User.findOne({ email });

//       if (user) {
//          console.log(user);
//          bcrypt.compare(password, user.password, async (err, response) => {
//             if (response == true) {
//                const token = await jwt.sign(
//                   {
//                      _id: user._id,
//                      ispremiumuser: user.ispremiumuser,
//                   },
//                   process.env.TOKEN_KEY
//                );

//                res.status(200).json({
//                   message: "Login successful",
//                   token: token,
//                });
//             } else {
//                res.status(401).json({ message: "bad credentials" });
//             }
//          });
//       } else {
//          res.status(404).json({ message: "user not found" });
//       }
//    } catch (err) {
//       console.log(err);
//       res.status(500).json(err);
//    }
// };


//exports.postSignup = async (req, res) => {
   //    // console.log(req.body);
   //    try {
   //       const { name, email, password } = req.body;
   //       if (
   //          name.length === 0 ||
   //          name == null ||
   //          password == null ||
   //          email == null ||
   //          email.length === 0 ||
   //          password.length === 0
   //       ) {
   //          res.status(400).json({ err: "bad  parameters" });
   //       }
   //       const user = await User.findOne({ email });
   //       if (user) {
   //          res.status(403).json({ failed: "User Already Exists", error: "user exists" });
   //       } else {
   //          console.log(">> in else");
   //          bcrypt.hash(password, 10, async (err, hash) => {
   //             const data = await new User({
   //                name: name,
   //                email: email,
   //                password: hash,
   //             });
   //             data.save();
   //             res.status(201).json({ message: "signed up successfully" });
   //          });
   //       }
   //    } catch (err) {
   //       console.log(err);
   //       res.status(500).json({ error: err });
   //    }
   // };