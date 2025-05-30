import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "./supabaseClient";

/**
 * React Context for authentication state.
 */
const AuthContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Provides authentication context to the app.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Get session from Supabase on app load
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * Returns user's authentication state from context.
 */
export function useAuth() {
  return useContext(AuthContext);
}
