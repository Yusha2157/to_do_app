const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware to log request timestamps
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const tasksFilePath = path.join(__dirname, "ToDos.json");

// Function to read tasks from JSON file
const readTasks = () => {
    if (!fs.existsSync(tasksFilePath)) return [];
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data);
};

// Function to write tasks to JSON file
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// GET /tasks → Show all tasks
app.get("/tasks", (req, res) => {
    const tasks = readTasks();
    res.render("tasks", { tasks });
});

// GET /task?id=1 → Fetch a specific task
app.get("/task", (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(req.query.id));
    if (!task) return res.status(404).send("Task not found");
    res.render("task", { task });
});

app.get("/add-task", (req, res) => {
    res.render("addTask");
});



app.post("/add-task", (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.redirect("/tasks");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/add-task`);
});
