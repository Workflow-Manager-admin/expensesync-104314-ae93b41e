import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./useAuth";

/**
 * PUBLIC_INTERFACE
 * Button to log out the current user.
 */
export default function Logout() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  }

  return (
    <button className="btn" onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Log Out"}
    </button>
  );
}
