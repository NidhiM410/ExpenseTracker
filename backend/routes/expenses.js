
const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch expenses"
    });
  }
});

module.exports = router;

const validateExpense = (data) => {
  const { title, amount, category, date } = data;
  return (
    typeof title === "string" &&
    title.trim().length > 0 &&
    Number.isFinite(Number(amount)) &&
    amount !== "" &&
    Number(amount) > 0 &&
    ["Food", "Travel", "Bills", "Shopping", "Other"].includes(category) &&
    date &&
    !isNaN(new Date(date).getTime())
  );
};

// ADD
router.post("/", async (req, res) => {
  try {
    if (!validateExpense(req.body)) {
      return res.status(400).json({ message: "Invalid expense details" });
    }
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to add expense" });
  }
});

// EDIT
router.put("/:id", async (req, res) => {
  try {
    if (!validateExpense(req.body)) {
      return res.status(400).json({ message: "Invalid expense details" });
    }
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: "Failed to update expense" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete expense" });
  }
});
