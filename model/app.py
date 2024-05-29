from flask import Flask, request, jsonify
import numpy as np
import joblib
import warnings
from sklearn.exceptions import DataConversionWarning

app = Flask(__name__)
model = joblib.load('model.pkl')

# Suppress the DataConversionWarning
warnings.simplefilter(action='ignore', category=DataConversionWarning)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features'], dtype=float).reshape(1, -1)
    
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        prediction = model.predict(features)
    
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
