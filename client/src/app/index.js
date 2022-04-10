import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../style/index.css';
import { NavBar } from '../components';
import { General } from '../pages';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<General />} />
        <Route path="general" element={<General />} />
      </Routes>
    </Router>
  );
}

export default App;
