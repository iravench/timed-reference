// File: src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';

// Components
import Home from './components/Home';
import Session from './components/Session';


const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/session">Session</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/session" element={<Session />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
