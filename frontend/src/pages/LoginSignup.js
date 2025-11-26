import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Link as MuiLink,
  IconButton,
  InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const API_BASE_URL = "https://globetrekker-travel-website-2.onrender.com";

export default function LoginSignup() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    emailOrUsername: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleShowPassword() {
    setShowPassword((show) => !show);
  }

  function toggleShowConfirmPassword() {
    setShowConfirmPassword((show) => !show);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (isSignup && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const url = isSignup
      ? `${API_BASE_URL}/signup`
      : `${API_BASE_URL}/login`;

    const payload = isSignup
      ? {
          username: formData.username,
          email: formData.emailOrUsername,
          password: formData.password,
        }
      : { identifier: formData.emailOrUsername, password: formData.password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        if (!isSignup) {
          if (data.username) localStorage.setItem("username", data.username);
          if (data.email) localStorage.setItem("email", data.email);
          window.dispatchEvent(new CustomEvent("username-changed", { detail: data.username }));
          window.dispatchEvent(new CustomEvent("email-changed", { detail: data.email }));
          alert(data.message);
          navigate("/");
        } else {
          alert(data.message);
        }
      }
    } catch {
      setError("Network error");
    }
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: "background.default",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 2
    }}>
      <Box sx={{
        maxWidth: 360,
        width: "100%",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Typography variant="h4" gutterBottom align="center">
          {isSignup ? "Sign Up" : "Log In"}
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
          )}
          <TextField
            label={isSignup ? "Email" : "Username / Email"}
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            type={isSignup ? "email" : "text"}
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {isSignup && (
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowConfirmPassword}
                      edge="end"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {isSignup ? "Sign Up" : "Log In"}
          </Button>
        </form>
        <Typography sx={{ mt: 2 }} align="center">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <MuiLink component="button" onClick={() => setIsSignup(false)} color="primary">
                Log in
              </MuiLink>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <MuiLink component="button" onClick={() => setIsSignup(true)} color="primary">
                Sign up
              </MuiLink>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
}
