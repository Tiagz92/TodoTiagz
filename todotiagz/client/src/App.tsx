import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");

	useEffect(() => {
		fetch("http://localhost:3310/tasks")
			.then((response) => response.json())
			.then((data) => setTasks(data))
			.catch((error) => console.error("Task recovery error:", error));
	}, []);

	const addTask = () => {
		if (newTask.trim() !== "") {
			fetch("http://localhost:3310/tasks", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title: newTask }),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("adding task error");
					}
					return response.json();
				})
				.then((newTaskData) => {
					setTasks([...tasks, newTaskData]);
					setNewTask("");
				})
				.catch((error) => console.error("Adding task error:", error));
		}
	};

	const deleteTask = (id) => {
		fetch(`http://localhost:3310/tasks/${id}`, {
			method: "DELETE",
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Deleting task error");
				}
				setTasks(tasks.filter((task) => task.id !== id));
			})
			.catch((error) => console.error("Deleting task error:", error));
	};

	const updateTask = (id, updatedTitle) => {
		fetch(`http://localhost:3310/tasks/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title: updatedTitle }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Updating task error");
				}
				return response.json();
			})
			.then(() => {
				setTasks(
					tasks.map((task) =>
						task.id === id ? { ...task, title: updatedTitle } : task,
					),
				);
			})
			.catch((error) => console.error("Updating task error:", error));
	};

	return (
		<div className="App">
			<h1>todotiagz</h1>
			<div>
				<input
					type="text"
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
					placeholder="Add Task!"
				/>
				<button onClick={addTask}>Add</button>
			</div>
			<ul>
				{tasks.map((task) => (
					<li key={task.id}>
						<span>{task.title}</span>
						<button onClick={() => deleteTask(task.id)}>Delete</button>
						<button
							onClick={() => {
								const updatedTitle = prompt(
									"Entrez le nouveau titre:",
									task.title,
								);
								if (updatedTitle) {
									updateTask(task.id, updatedTitle);
								}
							}}
						>
							Edit
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
