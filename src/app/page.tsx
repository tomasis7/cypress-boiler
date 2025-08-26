
"use client";
import React, { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<string[]>(["New Task0", "New Task1", "New Task2"]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setTasks([...tasks, input.trim()]);
      setInput("");
    }
  };

  return (
    <>
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a new task"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((task, idx) => (
          <li key={idx}>{task}</li>
        ))}
      </ul>
    </>
  );
}