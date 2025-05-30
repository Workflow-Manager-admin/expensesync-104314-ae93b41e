import React, { useState } from "react";
import { supabase } from "./supabaseClient";

/**
 * PUBLIC_INTERFACE
 * Signup form for creating a new Supabase user with email and password.
 */
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSuccess(true);
  }

  return (
    <div style={{ maxWidth: 340, margin: "32px auto", background: "#222", padding: 24, borderRadius: 8 }}>
      <h2 style={{ color: "#fff" }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={inputStyle}
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          style={inputStyle}
          required
          type="password"
          placeholder="Password"
          value={password}
          minLength={6}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="btn btn-large" type="submit" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
      </form>
      {error && <div style={{ color: "#ff5555", marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: "#4FD1C5", marginTop: 8 }}>Signup successful, check your email for confirmation.</div>}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  fontSize: "1rem",
  marginBottom: "12px",
  background: "#222",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "4px"
};
