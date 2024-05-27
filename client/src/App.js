// src/App.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Container className="my-5 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home user={user} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
