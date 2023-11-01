const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwd = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://mofusa16:mofusa16@cluster0.cmeazsb.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB sucessfully");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: \n", err);
  });

app.listen(port, () => {
  console.log("Server is running on port : 8000");
});

const User = require("./models/user");
const Order = require("./models/order");

// function that sends verification mail to the user
const sendVerificationEmail = async (email, verificationToken) => {
  // creating nodemailer transport
  const transporter = nodemailer.createTransport({
    // consfiguring the email service
    service: "gmail",
    auth: {
      user: "mofusa.softwaretesting@gmail.com",
      pass: "qanj bspx ecmv jwri",
    },
  });

  const mailOptions = {
    from: "fjstore.com",
    to: email,
    subject: "Please verify your account",
    text: `Please click here to verify your email : http://localhost:3000/verify/${verificationToken}`,
  };
  // sending email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending verification email : \n", error);
  }
};

// endpoint to register in the app
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // checcking if the password matches
    if (password !== confirmPassword) {
      return res.status(422).json({ error: "Password does not match" });
    }
    // checking if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).send({ error: "Email Already Registered" });
    }
    // creating new user
    const newUser = new User({ name, email, password, confirmPassword });
    // generating and storing the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    // saving user to the database
    await newUser.save();
    // sending verification email to user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res.status(201).json({ message: "Please check your registered email for a verification link" });
  } catch (error) {
    console.log("Error Registering User: \n", error);
    res.status(500).json({ message: "Registration Failed!" });
  }
});

// endpoint to verify the email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    // finding user with the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid Verification Token" });
    }
    // if user matches, markiing them as verified
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "Email Successfully Verified" });
  } catch (error) {
    res.status(500).json({ message: "Verification Failed!" });
  }
});