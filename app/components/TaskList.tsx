import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useTasksSocket } from "../hooks/useTasksSocket";
import { Task } from "../utils";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/getAllTasks");
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    }
  };

  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();

    if (taskTitle.trim() === "") return;

    const newTask: Task = {
      id: uuidv4(),
      title: taskTitle,
      completed: false,
      creator: localStorage.getItem("currentUser"),
      lastUpdatedBy: "",
    };

    try {
      await axios.post("/api/addTask", { task: newTask });
      // fetchTasks();
      setTaskTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const updatedTask = {
      ...task,
      completed: !task.completed,
      lastUpdatedBy: localStorage.getItem("currentUser"),
    };

    try {
      await axios.patch("/api/updateTask", {
        id,
        title: updatedTask.title,
        completed: updatedTask.completed,
        lastUpdatedBy: updatedTask.lastUpdatedBy,
      });
    } catch (error) {
      console.error("Error updating task:", error);

      setTasks(tasks);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      await axios.delete("/api/deleteTask", { data: { id } });
    } catch (error) {
      console.error("Error deleting task:", error);
      fetchTasks(); // Re-fetch only in case of an error
    }
  };

  useTasksSocket({
    // onTaskAdded: (task: Task) => setTasks((prevTasks) => [...prevTasks, task]),
    onTaskAdded: (task: Task) => {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, task];
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    },
    onTaskUpdated: (updatedTask: Task) =>
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      ),
    onTaskDeleted: (id: string) =>
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)),
  });

  return (
    <div className="mx-4">
      {error && <p>{error}</p>}
      <form
        onSubmit={handleAddTask}
        className="mb-4 flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-md"
      >
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="New task"
          className="w-1/3 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add Task
        </button>
      </form>

      <ul className="space-y-4">
        {tasks?.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-4 w-1/2 ${
              task.completed ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
              />

              <span
                className={`text-lg font-medium ${
                  task.completed ? "line-through text-red-700" : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <div>Creator: {task.creator}</div>
              <div>Last Updated By: {task.lastUpdatedBy || "N/A"}</div>
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
