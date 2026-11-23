const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const CATEGORIES = ['Food', 'Rent', 'Books', 'Transport', 'Fun', 'Income', 'Other'];

// In-memory storage for the MVP (a database comes in Sprint 2)
let transactions = [];
let nextId = 1;

function reset() {
  transactions = [];
  nextId = 1;
}

function validate(body) {
  const { description, amount, type, category } = body;
  if (!description || typeof description !== 'string') return 'Description is required';
  if (typeof amount !== 'number' || !(amount > 0)) return 'Amount must be a positive number';
  if (!['income', 'expense'].includes(type)) return 'Type must be income or expense';
  if (category && !CATEGORIES.includes(category)) return 'Unknown category';
  return null;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

app.post('/api/transactions', (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  const t = {
    id: nextId++,
    description: req.body.description.trim(),
    amount: Math.round(req.body.amount * 100) / 100,
    type: req.body.type,
    category: req.body.category || 'Other',
    date: req.body.date || new Date().toISOString().slice(0, 10)
  };
  transactions.push(t);
  res.status(201).json(t);
});

app.delete('/api/transactions/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = transactions.length;
  transactions = transactions.filter(t => t.id !== id);
  if (transactions.length === before) return res.status(404).json({ error: 'Transaction not found' });
  res.json({ message: 'Deleted' });
});

app.get('/api/summary', (req, res) => {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const byCategory = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    byCategory[t.category] = Math.round(((byCategory[t.category] || 0) + t.amount) * 100) / 100;
  });
  res.json({
    income: Math.round(income * 100) / 100,
    expenses: Math.round(expenses * 100) / 100,
    balance: Math.round((income - expenses) * 100) / 100,
    byCategory
  });
});

module.exports = { app, reset };
