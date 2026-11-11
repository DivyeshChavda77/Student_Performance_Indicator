from flask import Flask, request, render_template, redirect, url_for, jsonify

import pandas as pd
import numpy as np

from sklearn.preprocessing import StandardScaler
from src.pipeline.predict_pipeline import CustomData,PredictPipeline

application = Flask(__name__)

app = application

## Route for the single-page application (landing + form + result)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return redirect(url_for('static', filename='favicon.svg'))

def _wants_json():
    # The new single-page UI calls this route with fetch() and expects JSON.
    return (request.headers.get('X-Requested-With') == 'XMLHttpRequest'
            or request.accept_mimetypes.best == 'application/json')

@app.route('/predictdata', methods = ['GET', 'POST'])
def predict_datapoint():
    if request.method == 'GET':
        # Old standalone form page now lives in the #predict section of the single page.
        return redirect(url_for('index', _anchor='predict'))
    else:
        try:
            data = CustomData(
                gender = request.form.get('gender'),
                race_ethnicity = request.form.get('race_ethnicity'),
                parental_level_of_education = request.form.get('parental_level_of_education'),
                lunch = request.form.get('lunch'),
                test_preparation_course = request.form.get('test_preparation_course'),
                reading_score = float(request.form.get('reading_score')),
                writing_score = float(request.form.get('writing_score'))
            )

            pred_df = data.get_data_as_data_frame()
            print(pred_df)

            predict_pipeline = PredictPipeline()
            results = predict_pipeline.predict(pred_df)
        except (TypeError, ValueError):
            if _wants_json():
                return jsonify(success=False, error="Please fill in every field with valid values."), 400
            raise
        except Exception as e:
            print(e)
            if _wants_json():
                return jsonify(success=False, error="The prediction service hit an error. Please try again."), 500
            raise

        if _wants_json():
            return jsonify(success=True, prediction=float(results[0]))
        # Non-JavaScript fallback: server-render the result into the same single page.
        return render_template('index.html', results = results[0])


if __name__ == "__main__":
    app.run(host="0.0.0.0")
