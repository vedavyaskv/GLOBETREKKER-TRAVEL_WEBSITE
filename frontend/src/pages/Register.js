import React, { useState, useEffect } from 'react';

export default function Register() {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://globetrekker-travel-website-2.onrender.com"
      : "http://localhost:5000";

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
  }, []);

  const handleChangeEmail = (e) => {
    setUserEmail(e.target.value);
  };

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 7);
  const minDateString = minDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.username = username;
    data.email = userEmail;

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setShowModal(true);
        e.target.reset();
        setUserEmail('');
        setTimeout(() => setShowModal(false), 3000);
      } else {
        const errData = await res.json();
        alert(`❌ Registration failed: ${errData.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <section
        className="register-section"
        style={{
          maxWidth: 700,
          margin: 'auto',
          background: 'white',
          padding: 40,
          borderRadius: 15,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          fontFamily: "'Poppins', sans-serif",
          color: '#333',
        }}
      >
        <h1
          style={{
            fontSize: '2.4rem',
            color: '#07406e',
            marginBottom: 30,
            textAlign: 'center',
            marginTop: 70,
          }}
        >
          Register for Your Dream Trip
        </h1>
        <form
          onSubmit={handleSubmit}
          className="register-form"
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            disabled
            style={{
              padding: 12,
              fontSize: 16,
              borderRadius: 10,
              border: '1px solid #ccc',
              backgroundColor: '#f0f0f0',
            }}
          />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            style={{ padding: 12, fontSize: 16, borderRadius: 10, border: '1px solid #ccc' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userEmail}
            onChange={handleChangeEmail}
            required
            style={{ padding: 12, fontSize: 16, borderRadius: 10, border: '1px solid #ccc' }}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            required
            style={{ padding: 12, fontSize: 16, borderRadius: 10, border: '1px solid #ccc' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <label>Gender</label>
            <label>
              <input type="radio" name="gender" value="Male" required /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" required /> Female
            </label>
            <label>
              <input type="radio" name="gender" value="Other" required /> Other
            </label>
          </div>
          <select
            name="destination"
            required
            style={{ padding: 12, fontSize: 16, borderRadius: 10, border: '1px solid #ccc' }}
            defaultValue=""
          >
            <option value="" disabled>Select Destination</option>
            <option>Interlaken</option>
            <option>Male</option>
            <option>Rome</option>
            <option>Dubai</option>
            <option>Phuket</option>
            <option>Queenstown</option>
            <option>Paris</option>
            <option>Kyoto</option>
            <option>Sydney</option>
          </select>
          <select
            name="package"
            required
            style={{ padding: 12, fontSize: 16, borderRadius: 10, border: '1px solid #ccc' }}
            defaultValue=""
          >
            <option value="" disabled>Select Package</option>
            <option>Voyager Package</option>
            <option>Discoverer Package</option>
            <option>Explorer Package</option>
            <option>Globetrotter Package</option>
          </select>
          <label htmlFor="travel-date" style={{ fontWeight: 600, fontSize: 16 }}>
            Select Travel Date
          </label>
          <input
            type="date"
            id="travel-date"
            name="date"
            required
            min={minDateString}
            style={{ padding: 12, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <textarea
            name="notes"
            placeholder="Any special requests or notes..."
            style={{
              padding: 12,
              minHeight: 100,
              fontSize: 16,
              borderRadius: 10,
              border: '1px solid #ccc',
              resize: 'vertical',
            }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <input
              type="checkbox"
              name="terms"
              required
              style={{ width: 18, height: 18, accentColor: '#07406e', cursor: 'pointer' }}
            />
            I accept the Terms & Conditions.
          </label>
          <button
            type="submit"
            style={{
              backgroundColor: '#07406e',
              color: 'white',
              padding: 14,
              border: 'none',
              borderRadius: 25,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0c2d48')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#07406e')}
          >
            Submit
          </button>
        </form>
      </section>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: 40,
              borderRadius: 10,
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <h2 style={{ marginBottom: 10, color: '#07406e' }}>🎉 Success!</h2>
            <p style={{ fontSize: 18 }}>
              Congratulations, your registration is complete! A confirmation email has been sent.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
