from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import pickle

app = Flask(__name__)

# Load the model and encoder
with open('model.pkl', 'rb') as model_file:
    model_lstm = pickle.load(model_file)

with open('one_hot_encoder.pkl', 'rb') as encoder_file:
    encoder = pickle.load(encoder_file)

with open('model_class.pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    # Get the input data from the request
    data = request.get_json()
    print("Received data in /predict route:", data)  # Debug log

    # Make a prediction
    prediction = model.predict([data])

    # Return the prediction
    return jsonify({'prediction': prediction.tolist()})


@app.route('/run', methods=['POST'])
def run():
    # Get the input data from the request
    data = request.get_json()
    print("Received data in /run route:", data)  # Debug log
    
    # Assuming data has these columns
    user_input_df = pd.DataFrame([data], columns=['inning','batting_team', 'bowling_team','over', 'ball', 'batsman', 'non_striker', 'bowler', 'run_per_ball', 'score', 'crr'])
    categorical_cols = ['batting_team', 'bowling_team', 'batsman', 'non_striker', 'bowler']
    numerical_cols = ['inning', 'over', 'ball', 'run_per_ball', 'score', 'crr']
    user_input_df[numerical_cols] = user_input_df[numerical_cols].apply(pd.to_numeric, errors='coerce')

    print(user_input_df)
    # Apply OneHotEncoder to the categorical columns (using the fitted encoder)
    encoded_categorical_data = encoder.transform(user_input_df[categorical_cols])
    encoded_categorical_df = pd.DataFrame(encoded_categorical_data, columns=encoder.get_feature_names_out(categorical_cols))

# Combine the scaled numerical data and encoded categorical data
    final_input = pd.concat([user_input_df[numerical_cols], encoded_categorical_df], axis=1)
    print(final_input)
#    Convert the final input to numpy array for the model
    final_input_np = np.array(final_input)
    final_input_np = final_input_np.reshape((1, 1, 1468))
    print(final_input.isnull().any().any())

    # Make a prediction
    prediction = model_lstm.predict(final_input_np)

    # Return the prediction
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
