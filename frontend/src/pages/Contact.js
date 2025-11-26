import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://globetrekker-travel-website-2.onrender.com";

export default function Contact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert(data.message || "Message sent successfully!");
        navigate("/");
      } else {
        alert(data.error || "Error submitting form. Try again.");
      }
    } catch (err) {
      setLoading(false);
      alert("Network error. Please try again later.");
      console.error(err);
    }
  };

  return (
    <section
      className="contact-section"
      style={{
        maxWidth: 600,
        margin: "150px auto 60px auto",
        padding: 30,
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.06)",
        textAlign: "center",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#333",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          color: "#155ab6",
          marginBottom: 10,
        }}
      >
        Get in Touch
      </h1>
      <p
        style={{
          color: "#666",
          marginBottom: 30,
        }}
      >
        Have a question or want to connect? Fill out the form below and we'll get back to you shortly.
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
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 25px",
            fontSize: 16,
            backgroundColor: loading ? "#888" : "#155ab6",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background 0.3s ease"
          }}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
