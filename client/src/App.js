// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home'; 
import Register from './components/Register'; 

function App() {
  return (
    <Router>
      <Container className="my-5 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
