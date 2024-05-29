from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the model
model = joblib.load('fraud_detection_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array([data['features']])
    prediction = model.predict(features)
    result = {'prediction': int(prediction[0])}
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
