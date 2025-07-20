import React, { useEffect, useState } from 'react';
import BottomSheet from './components/BottomSheet/BottomSheet';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="app">
      <header className="header">
        <h1>React Bottom Sheet</h1>
        <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
          Switch to {darkMode ? "Light ☀️" : "Dark 🌙"} Mode
        </button>
      </header>

      <section className="content">
        <h2>Welcome to Interactive UI</h2>
        <p>This page demonstrates an interactive Bottom Sheet with theme toggling.</p>
        <div className="cards">
          <div className="card">📱 Mobile Friendly</div>
          <div className="card">⚡ Smooth Animations</div>
          <div className="card">🖥️ Clean Code</div>
          <div className="card">🌗 Light/Dark Mode</div>
        </div>
      </section>
        <BottomSheet>
          <h2>Explore More Content</h2>
          <p>Drag the sheet up and down or use the buttons below.</p>
          <ul className="bottom-list">
            <li>🎨 Theming Support</li>
            <li>💡 Simple React Code</li>
            <li>🚀 Optimized Performance</li>
            <li>🌍 Reusable Components</li>
          </ul>
        </BottomSheet>
    </div>
  );
}

export default App;
