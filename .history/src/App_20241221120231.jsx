import React from "react";
import Dashboard from "./Dashoard";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
