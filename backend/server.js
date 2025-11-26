require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Optional Twilio support
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Required environment warnings
["MONGO_URI", "EMAIL_USER", "EMAIL_PASS"].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing env var: ${key}`);
  }
});

// ⭐ FIXED CORS — removed trailing slash
app.use(
  cors({
    origin: [
      "https://globetrekker-travel-website.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Models
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

// Newsletter Subscription
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
      html: `<p>Thank you for subscribing to GlobeTrekker updates 🌍</p>`,
    });

    res.json({ message: "Subscription successful" });
  } catch (err) {
    console.error("Subscription error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Contact
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
        <h3>Message Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: "Account already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, email, passwordHash });

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) return res.status(400).json({ error: "Account does not exist" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Incorrect password" });

  res.json({
    message: "Login successful",
    username: user.username,
    email: user.email,
  });
});

// Trip Registration
app.post("/register", async (req, res) => {
  const { name, email, phone, gender, destination, package: pkg, date, notes } =
    req.body;

  if (!name || !email || !phone || !gender || !destination || !pkg || !date)
    return res.status(400).json({ error: "All fields are required" });

  try {
    await Registration.create({
      name,
      email,
      phone,
      gender,
      destination,
      package: pkg,
      date,
      notes,
    });

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("🔥 GlobeTrekker Backend Running Successfully!");
});

app.listen(PORT, () =>
  console.log(`🚀 Server live at https://globetrekker-travel-website-2.onrender.com`)
);
