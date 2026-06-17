# 🎓 Student Performance Indicator

A Machine Learning web application that predicts a student's Mathematics score based on demographic and academic performance factors. The project uses various regression algorithms and a Flask-based web interface to provide real-time predictions.

## 📌 Project Overview

The Student Performance Indicator project aims to analyze student-related factors and predict their Mathematics score. This helps in understanding how different attributes such as gender, parental education, lunch type, test preparation, reading score, and writing score influence academic performance.

## 🚀 Features

* Predict student Mathematics score using Machine Learning
* User-friendly Flask web interface
* Data preprocessing using Scikit-Learn pipelines
* Multiple regression models comparison
* Model serialization using Pickle/Dill
* End-to-end ML project structure

## 📊 Dataset Features

| Feature                     | Description                      |
| --------------------------- | -------------------------------- |
| Gender                      | Male/Female                      |
| Race/Ethnicity              | Student category                 |
| Parental Level of Education | Parent's education qualification |
| Lunch                       | Standard / Free or Reduced       |
| Test Preparation Course     | Completed / None                 |
| Reading Score               | Reading exam score               |
| Writing Score               | Writing exam score               |

### Target Variable

* Mathematics Score

## 🛠️ Technologies Used

* Python
* Pandas
* NumPy
* Scikit-Learn
* CatBoost
* XGBoost
* Flask
* HTML/CSS
* Git & GitHub

## 📂 Project Structure

Student_Performance_Indicator/

├── artifacts/

├── notebook/

├── src/

│ ├── components/

│ │ ├── data_ingestion.py

│ │ ├── data_transformation.py

│ │ └── model_trainer.py

│ ├── pipeline/

│ │ └── predict_pipeline.py

│ ├── exception.py

│ ├── logger.py

│ └── utils.py

├── templates/

│ ├── home.html

│ └── index.html

├── app.py

├── requirements.txt

└── README.md

## ⚙️ Machine Learning Pipeline

1. Data Ingestion
2. Data Cleaning
3. Data Transformation
4. Feature Engineering
5. Model Training
6. Model Evaluation
7. Model Selection
8. Prediction Pipeline
9. Web Application Deployment

## 📈 Models Used

* Random Forest Regressor
* Decision Tree Regressor
* Gradient Boosting Regressor
* AdaBoost Regressor
* XGBoost Regressor
* CatBoost Regressor
* K-Neighbors Regressor
* Linear Regression

## 🔧 Installation

### Clone Repository

```bash
git clone https://github.com/DivyeshChavda77/Student_Performance_Indicator.git
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```

Open your browser and visit:

```bash
http://127.0.0.1:5000
```

## 🎯 Sample Prediction Workflow

1. Enter student details.
2. Provide reading and writing scores.
3. Click Predict.
4. View predicted Mathematics score instantly.

## 📚 Learning Outcomes

* End-to-End Machine Learning Pipeline Development
* Feature Engineering and Data Preprocessing
* Model Training and Evaluation
* Flask Web Application Development
* Project Deployment and Version Control

## 👨‍💻 Author

**Divyesh Chavda**

AI & Data Science Student

GitHub: https://github.com/DivyeshChavda77

LinkedIn: https://linkedin.com/in/gecr-ai-230200143010-

## ⭐ Future Improvements

* Cloud Deployment
* User Authentication
* Advanced Analytics Dashboard
* Real-Time Student Performance Tracking
* Model Monitoring and Retraining
