import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Health");

  // Load habits
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("habits"));
    if (data) setHabits(data);
  }, []);

  // Save habits
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const today = new Date().toDateString();

  const addHabit = (e) => {
    e.preventDefault();
    if (!name) return;

    setHabits([
      {
        id: Date.now(),
        name,
        category,
        streak: 0,
        lastCompleted: null,
      },
      ...habits,
    ]);

    setName("");
  };

  const toggleHabit = (id) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id !== id) return habit;

        // Prevent double completion
        if (habit.lastCompleted === today) return habit;

        let newStreak = habit.streak;

        if (
          habit.lastCompleted &&
          new Date(today) - new Date(habit.lastCompleted) === 86400000
        ) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }

        return {
          ...habit,
          streak: newStreak,
          lastCompleted: today,
        };
      })
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  return (
    <div className="app">
      <h1>🌱 Habit Tracker</h1>

      {/* Add Habit */}
      <form className="card" onSubmit={addHabit}>
        <input
          placeholder="Habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Health</option>
          <option>Fitness</option>
          <option>Learning</option>
          <option>Productivity</option>
          <option>Others+</option>
        </select>

        <button>Add Habit</button>
      </form>

      {/* Habit List */}
      <div className="card">
        <h3>Your Habits</h3>

        <ul>
          {habits.map((habit) => (
            <li key={habit.id}>
              <div>
                <strong>{habit.name}</strong>
                <small>{habit.category}</small>
              </div>

              <div className="right">
                <span className="streak">🔥 {habit.streak}</span>

                <button
                  className={
                    habit.lastCompleted === today ? "done" : "mark"
                  }
                  onClick={() => toggleHabit(habit.id)}
                >
                  {habit.lastCompleted === today ? "Done" : "Mark"}
                </button>

                <button
                  className="delete"
                  onClick={() => deleteHabit(habit.id)}
                >
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
