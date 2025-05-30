import React, { useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./useAuth";
import Signup from "./Signup";
import Login from "./Login";
import Logout from "./Logout";

function AppContent() {
  const { user, authLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true); // toggle login/signup forms

  if (authLoading) {
    // Waiting for session restore
    return (
      <div className="app">
        <div style={{ color: "#fff", textAlign: "center", marginTop: "120px" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <div>
              {user ? (
                <Logout />
              ) : (
                <>
                  <button className="btn" style={{marginRight: 12}} onClick={() => setShowLogin(true)}>Sign In</button>
                  <button className="btn" onClick={() => setShowLogin(false)}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero">
            <div className="subtitle">{user ? "Welcome to ExpenseSync" : "AI Workflow Manager Template"}</div>
            <h1 className="title">expense_sync</h1>
            <div className="description">
              {user 
                ? `Logged in as: ${user.email}`
                : "Sign up or sign in with your Supabase account to start tracking expenses."
              }
            </div>
            {!user && (
              showLogin
                ? <Login />
                : <Signup />
            )}
            {user && (
              <>
                {/* Place main dashboard UI here when user is authenticated */}
                <button className="btn btn-large">Expense Dashboard (Coming Soon)</button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Top-level app wraps content in AuthProvider.
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;