import React from 'react';
import './App.css';
import FraudDetectionForm from './components/FraudDetectionForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fraud Detection System</h1>
        <FraudDetectionForm />
      </header>
    </div>
  );
}

export default App;
