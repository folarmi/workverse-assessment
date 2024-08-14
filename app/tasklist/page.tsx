"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useTasksSocket } from "../hooks/useTasksSocket";
import { pusher, Task } from "../utils";
import { useRouter } from "next/navigation";

const TaskList = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [skipEffect, setSkipEffect] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Update local tasks immediately
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });

      // Send the task to the backend to broadcast via Pusher
      await axios.post("/api/addTask", { task: newTask });

      setTaskTitle(""); // Clear the input field
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
      creator: task.creator,
    };

    try {
      await axios.patch("/api/updateTask", {
        id,
        title: updatedTask.title,
        completed: updatedTask.completed,
        lastUpdatedBy: updatedTask.lastUpdatedBy,
        creator: updatedTask.creator,
      });
    } catch (error) {
      console.error("Error updating task:", error);

      setTasks(tasks);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      //   await axios.delete("/api/deleteTask", { data: { id } });

      //   setTasks((prevTasks) => {
      //     const updatedTasks = prevTasks.filter((task) => task.id !== id);
      //     localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      //     return updatedTasks;
      //   });

      // Step 1: Optimistically update local state and storage
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== id);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });

      // Step 2: Send the delete request to the backend to broadcast via Pusher
      await axios.delete("/api/deleteTask", { data: { id } });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  useTasksSocket({
    onTaskAdded: (task: Task) => {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, task];
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    },
    onTaskUpdated: (updatedTask: Task) => {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    },
    onTaskDeleted: (id: string) => {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== id);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });
    },
  });

  useEffect(() => {
    if (!skipEffect) {
      const tasksJSON = localStorage.getItem("tasks");
      if (tasksJSON) {
        setTasks(JSON.parse(tasksJSON));
      }
    }
    setSkipEffect(false); // Reset skipEffect after useEffect runs
  }, [skipEffect]);

  return (
    <div className="mx-4">
      {error && <p>{error}</p>}
      <form
        onSubmit={handleAddTask}
        className="mb-4 flex items-center justify-between space-x-4 p-4 bg-gray-100 rounded-lg shadow-md"
      >
        <div className="flex items-center w-full">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="New task"
            className="w-1/3 mr-6 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Task
          </button>
        </div>

        <div className="justify-end ml-auto">
          <button
            onClick={logout}
            className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </form>

      <p className="text-center text-2xl py-8">
        Current User: {localStorage.getItem("currentUser")}
      </p>

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
              <div>Created By: {task.creator}</div>
              <div>Marked as done by: {task.lastUpdatedBy || "N/A"}</div>
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
