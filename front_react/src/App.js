import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header>
        <h1>DRDO 2024</h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
      </header>

      <div className="main-content">
        <h2>Welcome to DRDO 2024</h2>
        <p>
          Explore the latest opportunities and information about the Defence
          Research and Development Organisation.
        </p>
      </div>

      <footer>
        <p>© DRDO 2024. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
