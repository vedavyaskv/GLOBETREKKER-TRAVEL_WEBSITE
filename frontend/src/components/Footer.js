import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  const emailRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailRef.current.value) {
      emailRef.current.focus();
      emailRef.current.style.border = '2px solid #d32f2f';
      return;
    }
    emailRef.current.style.border = '';
    alert("Subscribed!");
  };

  const iconStyle = {
    color: '#d9e4ec',
    fontSize: 22,
    marginRight: 16,
    verticalAlign: 'middle',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  };

  return (
    <footer style={{
      background: '#07406e',
      color: '#fff',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '38px 32px 0 32px',
        gap: 20,
      }}>
        {/* Brand + About */}
        <div style={{ flex: 2, minWidth: 260 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            minHeight: 48,
          }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: 40, height: 40, background: '#fff', borderRadius: 6, marginRight: 8 }} />
            <span style={{ fontWeight: 700, fontSize: 22 }}>GlobeTrekker</span>
          </div>
          <p style={{ color: '#e6e6e6', fontWeight: 400, fontSize: 16, lineHeight: 1.7, marginBottom: 25 }}>
            GlobeTrekker brings your travel dreams to life with curated destinations,
            seamless planning, and unforgettable experiences.
          </p>
        </div>
        {/* Quick Links - aligned inline */}
        <div style={{
          flex: 1,
          minWidth: 165,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}>
          <h3 style={{
            margin: 0,
            color: '#fff',
            fontWeight: 600,
            fontSize: 18,
            height: 48,
            display: 'flex',
            alignItems: 'center'
          }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
            <li><Link to="/register" style={{ color: '#b8c8dc', textDecoration: 'none' }}>Register</Link></li>
            <li><Link to="/about" style={{ color: '#b8c8dc', textDecoration: 'none' }}>About Us</Link></li>
            <li><Link to="/contact" style={{ color: '#b8c8dc', textDecoration: 'none' }}>Contact Us</Link></li>
          </ul>
        </div>
        {/* Newsletter */}
        <div style={{ flex: 1.8, minWidth: 270 }}>
          <div style={{
            fontSize: 19,
            fontWeight: 600,
            marginBottom: 18,
            minHeight: 48,
            display: 'flex',
            alignItems: 'center'
          }}>
            Subscribe to our newsletter for updates &amp; news
          </div>
          <form style={{ display: 'flex', gap: 10, marginBottom: 16 }} onSubmit={handleSubmit}>
            <input
              ref={emailRef}
              type="email"
              required
              placeholder="Enter Your Email"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 25,
                outline: 'none',
                border: 'none',
                fontSize: 16,
                background: '#eee',
                color: '#222'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '11px 28px 10px 28px',
                borderRadius: 25,
                background: 'white',
                color: '#07406e',
                border: '2px solid #fff',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 1,
                cursor: 'pointer',
                transition: 'background 0.2s,color 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#07406e'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#07406e'; }}
            >
              SUBSCRIBE
            </button>
          </form>
          <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
            {[{
              href: "https://facebook.com",
              icon: <FaFacebookF />
            }, {
              href: "https://twitter.com",
              icon: <FaTwitter />
            }, {
              href: "https://instagram.com",
              icon: <FaInstagram />
            }, {
              href: "https://youtube.com",
              icon: <FaYoutube />
            }, {
              href: "https://linkedin.com",
              icon: <FaLinkedinIn />
            }].map(({ href, icon }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={iconStyle}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.18)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* Divider and bottom row */}
      <div style={{
        display: 'flex',
        borderTop: '1px solid #2362a4',
        marginTop: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 15,
        padding: '14px 32px 14px 32px',
        color: '#b8c8dc',
        maxWidth: 1200,
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <div style={{ flex: 1, minWidth: 220, textAlign: 'left' }}>
          © 2025 GlobeTrekker. All rights reserved.
        </div>
        <div style={{ flex: 2, textAlign: 'right' }}>
          <Link to="/privacy" style={{ color: '#b8c8dc', margin: '0 10px', textDecoration: 'none' }}>Privacy Policy</Link>
          <span>|</span>
          <Link to="/terms" style={{ color: '#b8c8dc', margin: '0 10px', textDecoration: 'none' }}>Terms & Conditions</Link>
          <span>|</span>
          <Link to="/faq" style={{ color: '#b8c8dc', margin: '0 10px', textDecoration: 'none' }}>FAQ</Link>
        </div>
      </div>
    </footer>
  );
}
