import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./useAuth";
import ExpenseForm from "./ExpenseForm";

/**
 * PUBLIC_INTERFACE
 * Expenses - CRUD for user expenses, using ExpenseForm for add/edit.
 */
export default function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch user's categories
  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id) // Ensures client-side data isolation by user
      .order("created_at", { ascending: true });
    setCategories(data || []);
  }

  // Fetch user's expenses
  async function fetchExpenses() {
    setLoading(true);
    setError("");
    // Include category as a joined column for display and always filter by user_id
    const { data, error } = await supabase
      .from("expenses")
      .select("*, category:categories(id, name, color)")
      .eq("user_id", user.id) // Ensures client-side data isolation by user
      .order("date", { ascending: false });
    if (error) setError(error.message);
    setExpenses(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchExpenses();
    }
    // eslint-disable-next-line
  }, [user]);

  // Add expense
  async function handleAdd(expense) {
    setLoading(true);
    setError("");
    // Ensure outgoing data is in correct shape: never pass blank string for category_id
    const outgoing = {
      ...expense,
      category_id: expense.category_id ? expense.category_id : null,
      user_id: user.id,
    };
    const { error } = await supabase
      .from("expenses")
      .insert([outgoing]);
    if (error) {
      setError(error.message);
      setLoading(false);
      return; // Don't close form or reload if failed
    } else {
      setShowForm(false);
      fetchExpenses();
    }
    setLoading(false);
  }

  // Edit expense
  async function handleEdit(expense) {
    setLoading(true);
    setError("");
    if (!editingId) return;
    const { error } = await supabase
      .from("expenses")
      .update(expense)
      .eq("id", editingId)
      .eq("user_id", user.id);
    if (error) setError(error.message);
    setEditingId(null);
    fetchExpenses();
    setLoading(false);
  }

  // Delete expense
  async function handleDelete(id) {
    if (!window.confirm("Delete this expense?")) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.from("expenses").delete().eq("id", id).eq("user_id", user.id);
    if (error) setError(error.message);
    fetchExpenses();
    setLoading(false);
  }

  // Find category for display by id
  function getCategory(catId) {
    return categories.find(cat => cat.id === catId);
  }

  return (
    <div style={{
      background: "#232323",
      padding: 20,
      borderRadius: 8,
      margin: "8px 0",
      minHeight: 220
    }}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10}}>
        <h2 style={{margin:"0 0 0 2px", color: "#fff", fontSize:"1.38rem"}}>Expenses</h2>
        {showForm
          ? <button className="btn" onClick={() => setShowForm(false)}>Cancel</button>
          : <button className="btn" onClick={() => setShowForm(true)}>Add Expense</button>
        }
      </div>
      {showForm &&
        <ExpenseForm
          categories={categories}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      }
      {error && <div style={{ color: "#ff5555", marginBottom: 8 }}>{error}</div>}
      <table style={tableStyle}>
        <thead>
          <tr style={{color: "#F6E05E"}}>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Notes</th>
            <th style={{width:70}}></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            editingId === exp.id
              ? (
                <tr key={exp.id}>
                  <td colSpan={6}>
                    <ExpenseForm
                      mode="edit"
                      categories={categories}
                      initialData={{
                        amount: exp.amount,
                        currency: exp.currency,
                        date: exp.date,
                        category_id: exp.category_id,
                        notes: exp.notes
                      }}
                      onSubmit={vals => handleEdit(vals)}
                      onCancel={() => setEditingId(null)}
                      loading={loading}
                    />
                  </td>
                </tr>
              )
              : (
                <tr key={exp.id}>
                  <td>{exp.date}</td>
                  <td>
                    {exp.category ?
                      (<span style={{display:"inline-block",paddingRight:6}}>
                        <span style={{
                          display:"inline-block",
                          width:12, height:12,
                          background:exp.category.color || "#E87A41",
                          borderRadius:3,
                          marginRight:3
                        }}/>
                        {exp.category.name}
                      </span>)
                      : <span style={{color:"#999"}}>Uncategorized</span>
                    }
                  </td>
                  <td style={{fontWeight:600}}>{exp.amount?.toFixed ? exp.amount.toFixed(2) : exp.amount}</td>
                  <td>{exp.currency}</td>
                  <td>{exp.notes}</td>
                  <td>
                    <button className="btn" style={{padding:"2px 8px",marginRight:4,fontSize:"0.97em"}} onClick={() => setEditingId(exp.id)} disabled={loading}>Edit</button>
                    <button className="btn" style={{background:"#902020",padding:"2px 8px",fontSize:"0.97em"}} onClick={() => handleDelete(exp.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              )
          ))}
        </tbody>
      </table>
      {expenses.length === 0 && <div style={{ color: "#aaa", fontSize: "1em", marginTop: 6 }}>No expenses yet.</div>}
      {loading && <div style={{ color: "#fff", fontSize: "0.95em", marginTop: 8 }}>Loading...</div>}
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "none"
};
