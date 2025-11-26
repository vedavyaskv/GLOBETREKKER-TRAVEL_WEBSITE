import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://globetrekker-travel-website-2.onrender.com"
    : "http://localhost:5000";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate("/");
      } else {
        alert(data.error || "Error, try again.");
      }
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <section className="contact-section" style={{
      maxWidth: 600,
      margin: "150px auto 60px auto",
      padding: 30,
      backgroundColor: "#fff",
      borderRadius: 12,
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.06)",
      textAlign: "center",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#333"
    }}>
      <h1 style={{
        fontSize: 28,
        color: "#155ab6",
        marginBottom: 10,
      }}>Get in Touch</h1>
      <p style={{
        color: "#666",
        marginBottom: 30
      }}>
        Have a question, comment, or just want to say hello? Fill out the form below and we'll get back to you soon.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 20,
            border: "1px solid #ccc",
            borderRadius: 8,
            fontSize: 16,
            resize: "none"
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 20,
            border: "1px solid #ccc",
            borderRadius: 8,
            fontSize: 16,
            resize: "none"
          }}
        />
        <textarea
          name="message"
          rows={5}
          placeholder="Your Message..."
          required
          value={formData.message}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 20,
            border: "1px solid #ccc",
            borderRadius: 8,
            fontSize: 16,
            resize: "none"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 25px",
            fontSize: 16,
            backgroundColor: "#155ab6",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background 0.3s ease"
          }}
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
