require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

["MONGO_URI", "RESEND_API_KEY", "EMAIL_FROM"].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing env var: ${key}`);
  }
});

app.use(cors({
  origin: [
    "https://globetrekker-travel-website.vercel.app",
    /\.vercel\.app$/,
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// Schemas & Models
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

// ===================== SUBSCRIBE =====================
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(409).json({ message: "Already subscribed" });

    await Subscriber.create({ email });

    await resend.emails.send({
      from: `GlobeTrekker <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "🎉 Welcome to GlobeTrekker!",
      html: `<p>Thanks for subscribing to GlobeTrekker updates! 🌍</p>`,
    });

    res.json({ message: "Subscription successful" });
  } catch (error) {
    console.error("SUBSCRIBE ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===================== CONTACT =====================
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ error: "Please fill all fields" });

  try {
    await resend.emails.send({
      from: "GlobeTrekker Contact <onboarding@resend.dev>",
      to: process.env.EMAIL_ADMIN,
      subject: "New Contact Message - GlobeTrekker",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("CONTACT ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ===================== SIGNUP =====================
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(409).json({ error: "Account exists, please login" });

    const passwordHash = await bcrypt.hash(password, 10);
    await new User({ username, email, passwordHash }).save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===================== LOGIN =====================
app.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) return res.status(400).json({ error: "Account does not exist" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    res.json({ message: "Login successful", username: user.username, email: user.email });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===================== REGISTER =====================
app.post("/register", async (req, res) => {
  const { name, email, phone, gender, destination, package: pkg, date, notes } = req.body;

  if (!name || !email || !phone || !gender || !destination || !pkg || !date)
    return res.status(400).json({ error: "All fields are required" });

  try {
    await Registration.create({ name, email, phone, gender, destination, package: pkg, date, notes });

    // Try to send admin email (ignore failure)
    try {
      await resend.emails.send({
        from: "GlobeTrekker Alerts <onboarding@resend.dev>",
        to: process.env.EMAIL_ADMIN,
        subject: `New Booking - ${name}`,
        html: `
          <h2>New Trip Registration</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Destination:</b> ${destination}</p>
          <p><b>Package:</b> ${pkg}</p>
          <p><b>Date:</b> ${date}</p>
          <p><b>Notes:</b> ${notes || "None"}</p>
        `,
      });
    } catch (emailError) {
      console.error("EMAIL ERROR (ignored):", emailError);
    }

    // Always send success to frontend
    res.json({ message: "Registration successful" });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/", (req, res) => {
  res.send("🔥 GlobeTrekker Backend Running Successfully!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
