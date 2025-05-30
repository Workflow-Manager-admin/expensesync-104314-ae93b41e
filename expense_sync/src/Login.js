import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./useAuth";

/**
 * PUBLIC_INTERFACE
 * Login form for existing users (email + password).
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
  }

  if (user) return null;
  return (
    <div style={{ maxWidth: 340, margin: "32px auto", background: "#222", padding: 24, borderRadius: 8 }}>
      <h2 style={{ color: "#fff" }}>Sign In</h2>
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
          onChange={e => setPassword(e.target.value)}
        />
        <button className="btn btn-large" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
      </form>
      {error && <div style={{ color: "#ff5555", marginTop: 8 }}>{error}</div>}
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
