require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

["MONGO_URI", "EMAIL_USER", "EMAIL_PASS"].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing env var: ${key}`);
  }
});

app.use(cors({
  origin: [
    "https://globetrekker-travel-website.vercel.app/", 
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// Schemas and Models
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});
const Subscriber = mongoose.model("Subscriber", subscriberSchema);

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  gender: String,
  destination: String,
  package: String,
  date: String,
  notes: String,
  registeredAt: { type: Date, default: Date.now },
});
const Registration = mongoose.model("Registration", registrationSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

// Newsletter subscription
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(409).json({ message: "Already subscribed" });
    await Subscriber.create({ email });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: `GlobeTrekker <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to GlobeTrekker!",
      html: `<p>Thanks for subscribing to GlobeTrekker updates! 🌍</p>`,
    });
    res.json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Contact form submission
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "Please fill all fields" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Message - GlobeTrekker",
      html: `
        <h3>You've got a message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>`,
    });
    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Signup API
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ error: "Account exists, please login" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash });
    await user.save();
    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Identifier and password are required" });
    }
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(400).json({ error: "Account does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    res.json({ message: "Login successful", username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Register API with email and SMS to user's entered phone number
app.post("/register", async (req, res) => {
  const { name, email, phone, gender, destination, package: pkg, date, notes } = req.body;
  if (!name || !email || !phone || !gender || !destination || !pkg || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    // Save registration
    await Registration.create({ name, email, phone, gender, destination, package: pkg, date, notes });

    // Send email confirmation to user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `GlobeTrekker <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your GlobeTrekker Booking Confirmation",
      html: `
        <h2>Hi ${name},</h2>
        <p>Your booking for ${destination} on ${date} with the ${pkg} package is confirmed.</p>
        <p>Thank you for registering with GlobeTrekker.</p>`,
    });

    // Send SMS to the entered number using Twilio
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      const smsMessage = `Hi ${name}, your GlobeTrekker booking for ${destination} (${pkg}) on ${date} is confirmed! Thank you!`;
      try {
        await twilioClient.messages.create({
          body: smsMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone.startsWith("+") ? phone : "+91" + phone,
        });
        console.log(`SMS sent to ${phone}`);
      } catch (smsErr) {
        console.warn("SMS send error:", smsErr.message);
      }
    } else {
      console.warn("Twilio SMS not configured, skipping SMS");
    }

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("🔥 GlobeTrekker Backend Running Successfully!");
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});