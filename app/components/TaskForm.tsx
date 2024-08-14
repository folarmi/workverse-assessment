"use client";

import { useState } from "react";
import { Task } from "../utils";
import axios from "axios";

const TaskForm = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");

  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();

    if (taskTitle.trim() === "") return;
    const newTask: Task = {
      //   id: uuidv4(),
      id: "dhbjhsdsbhb",
      title: taskTitle,
      completed: false,
      creator: "User 1", // Assume User 1 is the creator
    };

    try {
      await axios.post("/api/addTask", { task: newTask });

      // Optionally update local state immediately for optimistic UI
      setTasks((prevTasks) => [...prevTasks, newTask]);

      setTaskTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleAddTask}>
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="New task"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
