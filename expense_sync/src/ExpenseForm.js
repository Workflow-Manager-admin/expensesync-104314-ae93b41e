import React, { useState, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * ExpenseForm - a reusable form for creating or updating an expense.
 * Props:
 *   onSubmit(expenseData)    - called with form data on save
 *   onCancel()               - (optional) called when the user cancels
 *   initialData              - (optional) for editing: { amount, currency, date, notes, category_id }
 *   categories               - [{id, name, color}]
 *   loading                  - disable submit button if true
 *   mode                     - 'create' | 'edit'
 */
export default function ExpenseForm({
  onSubmit,
  onCancel,
  initialData = {},
  categories = [],
  loading = false,
  mode = "create"
}) {
  // State for each field
  const [amount, setAmount] = useState(initialData.amount || "");
  const [currency, setCurrency] = useState(initialData.currency || "USD");
  const [date, setDate] = useState(initialData.date || "");
  const [categoryId, setCategoryId] = useState(initialData.category_id || "");
  const [notes, setNotes] = useState(initialData.notes || "");
  const [error, setError] = useState("");

  // Reset form if initialData changes (when switching edit targets)
  useEffect(() => {
    setAmount(initialData.amount || "");
    setCurrency(initialData.currency || "USD");
    setDate(initialData.date || "");
    setCategoryId(initialData.category_id || "");
    setNotes(initialData.notes || "");
    setError("");
  }, [initialData]);

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || !currency || !date) {
      setError("Amount, currency, and date are required.");
      return;
    }
    if (isNaN(Number(amount))) {
      setError("Amount must be a number.");
      return;
    }
    // Ensure category_id is null, not empty string
    onSubmit({
      amount: parseFloat(amount),
      currency,
      date,
      category_id: categoryId ? categoryId : null,
      notes: notes.trim()
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Amount</label>
          <input
            style={inputStyle}
            type="number"
            min="0"
            step="0.01"
            value={amount}
            required
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
          />
        </div>
        <div style={{ flexBasis: 100 }}>
          <label style={labelStyle}>Currency</label>
          <input
            style={inputStyle}
            type="text"
            value={currency}
            required
            onChange={e => setCurrency(e.target.value.toUpperCase().slice(0,4))}
            placeholder="Currency"
          />
        </div>
        <div style={{ flexBasis: 150 }}>
          <label style={labelStyle}>Date</label>
          <input
            style={inputStyle}
            type="date"
            value={date}
            required
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div style={{ flexBasis: 170 }}>
          <label style={labelStyle}>Category</label>
          <select
            style={inputStyle}
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map(cat =>
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            )}
          </select>
        </div>
        <div style={{ flexGrow: 2, minWidth: 170 }}>
          <label style={labelStyle}>Notes</label>
          <input
            style={inputStyle}
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes"
            maxLength={64}
          />
        </div>
        <div>
          <button className="btn" style={{marginRight:8}} type="submit" disabled={loading}>
            {loading ? (mode === "edit" ? "Saving..." : "Adding...") : (mode === "edit" ? "Save" : "Add")}
          </button>
          {onCancel && (
            <button className="btn" style={{background:"#444"}} onClick={e => {e.preventDefault(); onCancel();}}>Cancel</button>
          )}
        </div>
      </div>
      {error && <div style={{ color: "#ff5555", marginTop: 8 }}>{error}</div>}
    </form>
  );
}

const labelStyle = {
  color: "#fff",
  fontWeight: 500,
  fontSize: "0.93rem",
  display: "block",
  marginBottom: 2
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  fontSize: "1rem",
  background: "#222",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "4px",
  marginBottom: 4
};
