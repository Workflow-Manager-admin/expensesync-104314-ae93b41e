import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./useAuth";

/**
 * PUBLIC_INTERFACE
 * Categories - manage CRUD for expense categories of the logged-in user.
 * Exposes onCategoryChange prop for parent to refresh when list changes.
 */
export default function Categories({ onCategoryChange }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", color: "#E87A41" });

  // Fetch user's categories
  async function fetchCategories() {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (error) setError(error.message);
    setCategories(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (user) fetchCategories();
    // eslint-disable-next-line
  }, [user]);

  // Add or Edit Category
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!form.name.trim()) {
      setError("Category name is required.");
      setLoading(false);
      return;
    }
    try {
      if (editId) {
        // UPDATE
        const { error } = await supabase
          .from("categories")
          .update({ name: form.name.trim(), color: form.color })
          .eq("id", editId)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase
          .from("categories")
          .insert([{ name: form.name.trim(), color: form.color, user_id: user.id }]);
        if (error) throw error;
      }
      setForm({ name: "", color: "#E87A41" });
      setEditId(null);
      fetchCategories();
      if (onCategoryChange) onCategoryChange();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  // Delete
  async function handleDelete(id) {
    if (!window.confirm("Delete this category? All related expenses will become uncategorized.")) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.from("categories").delete().eq("id", id).eq("user_id", user.id);
    if (error) setError(error.message);
    fetchCategories();
    if (onCategoryChange) onCategoryChange();
    setLoading(false);
  }

  // Start editing
  function handleEdit(cat) {
    setEditId(cat.id);
    setForm({ name: cat.name, color: cat.color || "#E87A41" });
  }

  function handleCancel() {
    setEditId(null);
    setForm({ name: "", color: "#E87A41" });
    setError("");
  }

  return (
    <div style={{
      background: "#232323",
      padding: 18,
      borderRadius: 8,
      maxWidth: 360,
      margin: "8px 0",
      minHeight: 180
    }}>
      <h2 style={{margin: "0 0 14px 0", color: "#fff", fontSize:"1.3rem"}}>Categories</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10 }}>
          <input
            style={inputStyle}
            type="text"
            value={form.name}
            required
            maxLength={24}
            placeholder="Name"
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <input
            style={{...inputStyle, padding:"2px 4px", maxWidth:46, minWidth:32}}
            type="color"
            value={form.color}
            onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
          />
          <button className="btn" type="submit" disabled={loading}>{editId ? "Save" : "Add"}</button>
          {editId && <button className="btn" style={{background:"#444"}} onClick={handleCancel}>Cancel</button>}
      </form>
      {error && <div style={{ color: "#ff5555", marginBottom: 10 }}>{error}</div>}

      <table style={tableStyle}>
        <thead>
          <tr style={{color:"#E87A41"}}>
            <th>Color</th>
            <th>Name</th>
            <th style={{width:56}}></th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>
                <span style={{
                  background: cat.color || "#E87A41",
                  display: "inline-block",
                  width: 18,
                  height: 18,
                  borderRadius: 4
                }}></span>
              </td>
              <td>{cat.name}</td>
              <td>
                <button className="btn" style={{padding:"2px 8px",marginRight:4,fontSize:"0.95em"}} onClick={() => handleEdit(cat)} disabled={loading}>Edit</button>
                <button className="btn" style={{background:"#902020",padding:"2px 8px",fontSize:"0.95em"}} onClick={() => handleDelete(cat.id)} disabled={loading}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {categories.length === 0 && <div style={{ color: "#aaa", fontSize: "0.98em", marginTop: 6 }}>No categories yet.</div>}
      {loading && <div style={{ color: "#fff", fontSize: "0.95em", marginTop: 8 }}>Loading...</div>}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: 90,
  padding: "7px",
  fontSize: "1em",
  background: "#222",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "4px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "none",
  marginTop: 4
};
