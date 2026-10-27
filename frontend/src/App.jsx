
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/expenses`;

function App() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

const [editingId, setEditingId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to load expenses");
      }
      const data = await response.json();
      setExpenses(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

const [form, setForm] = useState({
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().slice(0, 10)
});

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.title.trim() || Number(form.amount) <= 0) {
    setError("Enter a valid title and positive amount");
    return;
  }

  try {
    const response = await fetch(
  editingId ? `${API_URL}/${editingId}` : API_URL,
  {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) throw new Error("Failed to add expense");
setEditingId(null);
    setForm({
      title: "",
      amount: "",
      category: "Food",
      date: new Date().toISOString().slice(0, 10)
    });

    await fetchExpenses();
  } catch (err) {
    setError(err.message);
  }
};

const handleEdit = (expense) => {
  setEditingId(expense._id);
  setForm({
    title: expense.title,
    amount: String(expense.amount),
    category: expense.category,
    date: expense.date.slice(0, 10)
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleDelete = async (id) => {
  if (!window.confirm("Delete this expense?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to delete expense");
    }

    await fetchExpenses();
    setError("");
  } catch (err) {
    setError(err.message);
  }
};

  return (
    <main>
      <h1>Personal Expense Tracker</h1>
      <h2>Total Spent: ₹{total.toFixed(2)}</h2>
      {error && <p>{error}</p>}
      <p>Expenses loaded: {expenses.length}</p>
      
<form onSubmit={handleSubmit}>
  <h2>Add New Expense</h2>

  <input
    type="text"
    name="title"
    placeholder="Expense Title"
    value={form.title}
    onChange={handleChange}
    required
  />

  <input
    type="number"
    name="amount"
    placeholder="Amount"
    min="0.01"
    step="0.01"
    value={form.amount}
    onChange={handleChange}
    required
  />

  <select
    name="category"
    value={form.category}
    onChange={handleChange}
  >
    {["Food", "Travel", "Bills", "Shopping", "Other"].map(
      (category) => (
        <option key={category} value={category}>
          {category}
        </option>
      )
    )}
  </select>

  <input
    type="date"
    name="date"
    value={form.date}
    onChange={handleChange}
    required
  />

  
<button type="submit">
  {editingId ? "Update Expense" : "Add Expense"}
</button>

</form>

<section>
  <h2>Expense History</h2>

  {expenses.length === 0 ? (
    <p>No expenses recorded yet.</p>
  ) : (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.title}</td>
              <td>₹{Number(expense.amount).toFixed(2)}</td>
              <td>{expense.category}</td>
              <td>{new Date(expense.date).toLocaleDateString("en-IN")}</td>
              <td>
                <button type="button" onClick={() => handleEdit(expense)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(expense._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

    </main>
  );
}

export default App;
