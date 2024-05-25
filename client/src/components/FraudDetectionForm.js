import React, { useState } from 'react';
import axios from 'axios';

const FraudDetectionForm = () => {
  const [transactionData, setTransactionData] = useState({
    feature1: '',
    feature2: '',
    // Add more features as needed
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/predict', transactionData);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Feature 1:
          <input type="text" name="feature1" value={transactionData.feature1} onChange={handleChange} />
        </label>
        <label>
          Feature 2:
          <input type="text" name="feature2" value={transactionData.feature2} onChange={handleChange} />
        </label>
        {/* Add more input fields as needed */}
        <button type="submit">Predict</button>
      </form>
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
  );
};

export default FraudDetectionForm;
