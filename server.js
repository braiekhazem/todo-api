const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3001;
const todosFilePath = path.join(__dirname, "todos.json");

app.use(bodyParser.json());
app.use(cors());

const readTodos = () => {
  if (!fs.existsSync(todosFilePath)) {
    fs.writeFileSync(todosFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(todosFilePath, "utf8"));
};

const writeTodos = (todos) => {
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
};

const statuses = ["open", "in progress", "completed", "archived", "cancelled"];

app.post("/todos", (req, res) => {
  const { name, status, color } = req.body;
  if (!name || !status || !color) {
    return res.status(400).json({
      error: "Invalid request. Please provide name, status and color",
    });
  }

  if (statuses.indexOf(status.toLowerCase()) === -1) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const todos = readTodos();
  const newTodo = { id: Date.now(), name, status, color };
  todos.push(newTodo);
  writeTodos(todos);

  res.status(201).json(newTodo);
});

app.get("/todos", (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  const todos = readTodos();

  const statusCount = todos?.reduce((acc, todo) => {
    const status = todo.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  limit = limit > 50 ? 50 : limit;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedTodos = todos.slice(startIndex, endIndex);

  res.json({
    total: todos.length,
    page: parseInt(page),
    limit: parseInt(limit),
    todos: paginatedTodos,
    statusCount,
  });
});

app.get("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todos = readTodos();
  const todo = todos.find((t) => t.id === todoId);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(todo);
});

app.put("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const { name, status, color } = req.body;
  const todos = readTodos();
  const todoIndex = todos.findIndex((t) => t.id === todoId);

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (status && statuses.indexOf(status.toLowerCase()) === -1) {
    return res.status(400).json({ error: "Invalid status" });
  }

  if (name) todos[todoIndex].name = name;
  if (status) todos[todoIndex].status = status;
  if (color) todos[todoIndex].color = color;

  writeTodos(todos);
  res.json(todos[todoIndex]);
});

app.delete("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todos = readTodos();
  const newTodos = todos.filter((t) => t.id !== todoId);

  if (todos.length === newTodos.length) {
    return res.status(404).json({ error: "Todo not found" });
  }

  writeTodos(newTodos);
  res.json({ message: "Todo deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
