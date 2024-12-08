const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3310;

let tasks = [
	{ id: 1, title: "apprendre le dev", completed: false },
	{ id: 2, title: "Créer une API avec Express", completed: false },
];

app.get("/", (req, res) => {
	res.send("Welcome to TodoTiagz");
});

app.get("/tasks", (req, res) => {
	res.json(tasks);
});

app.post("/tasks", (req, res) => {
	const { title } = req.body;
	if (title) {
		const newTask = { id: tasks.length + 1, title, completed: false };
		tasks.push(newTask);
		res.status(201).json(newTask);
	} else {
		res.status(400).json({ error: "title needed! try again b$$$$!!!" });
	}
});

app.delete("/tasks/:id", (req, res) => {
	const { id } = req.params;
	tasks = tasks.filter((task) => task.id !== parseInt(id));
	res.status(204).send();
});

app.put("/tasks/:id", (req, res) => {
	const { id } = req.params;
	const { title, completed } = req.body;

	let task = tasks.find((task) => task.id === parseInt(id));
	if (!task) {
		return res.status(404).json({ error: "Task not found" });
	}

	if (title !== undefined) task.title = title;
	if (completed !== undefined) task.completed = completed;

	res.json(task);
});

app.listen(PORT, () => {
	console.log(`serveur en cours d'exécution sur http://localhost:${PORT}`);
});
