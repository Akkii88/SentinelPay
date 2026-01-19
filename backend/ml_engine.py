import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, recall_score, accuracy_score
import joblib
import os
import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_PATH = os.path.join(DATA_DIR, "fraud_model.pkl")
SCALER_PATH = os.path.join(DATA_DIR, "scaler.pkl")
METADATA_PATH = os.path.join(DATA_DIR, "model_metadata.pkl")
DATA_PATH = os.path.join(DATA_DIR, "creditcard.csv")

class MLEngine:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.metadata = {
            "active_model": "None",
            "accuracy": "0.0%",
            "last_trained": "Never",
            "status": "Not Trained"
        }
        
    def train_automl(self):
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")
            
        print("Loading dataset for AutoML...")
        df = pd.read_csv(DATA_PATH)
        
        X = df.drop(columns=['Time', 'Class'], errors='ignore')
        y = df['Class']
        
        # Split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Scaling
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Define Candidates
        candidates = {
            "XGBoost": xgb.XGBClassifier(
                objective='binary:logistic', n_estimators=50, max_depth=4, 
                scale_pos_weight=float(np.sum(y == 0)) / np.sum(y == 1), 
                eval_metric='logloss', use_label_encoder=False
            ),
            "RandomForest": RandomForestClassifier(n_estimators=50, n_jobs=-1, class_weight='balanced', random_state=42),
            "LogisticRegression": LogisticRegression(class_weight='balanced', max_iter=1000)
        }
        
        best_score = -1
        best_model_name = ""
        best_model = None
        
        print("Starting AutoML Training Race...")
        
        results = {}
        
        for name, clf in candidates.items():
            print(f"Training {name}...")
            clf.fit(X_train_scaled, y_train)
            
            y_pred = clf.predict(X_test_scaled)
            # Optimize for Recall (catching fraud is priority)
            score = recall_score(y_test, y_pred)
            accuracy = accuracy_score(y_test, y_pred)
            
            results[name] = {"recall": score, "accuracy": accuracy}
            print(f"  -> {name}: Recall={score:.4f}, Accuracy={accuracy:.4f}")
            
            if score > best_score:
                best_score = score
                best_model = clf
                best_model_name = name
        
        print(f"\n🏆 Champion Model: {best_model_name} (Recall: {best_score:.2%})")
        
        self.model = best_model
        
        # Save Artifacts
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.scaler, SCALER_PATH)
        
        # Update Metadata
        self.metadata = {
            "active_model": best_model_name,
            "accuracy": f"{results[best_model_name]['accuracy']*100:.1f}%",
            "recall": f"{best_score*100:.1f}%",
            "last_trained": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "Active (AutoML Optimized)",
            "challengers": results
        }
        joblib.dump(self.metadata, METADATA_PATH)
        
    def load_model(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
            self.model = joblib.load(MODEL_PATH)
            self.scaler = joblib.load(SCALER_PATH)
            if os.path.exists(METADATA_PATH):
                self.metadata = joblib.load(METADATA_PATH)
            return True
        return False

    def predict_one(self, features_dict):
        if not self.model:
            raise ValueError("Model not loaded")
        df = pd.DataFrame([features_dict])
        df_scaled = self.scaler.transform(df)
        prob = self.model.predict_proba(df_scaled)[0][1]
        return prob
    
    def get_governance_stats(self):
        return self.metadata

if __name__ == "__main__":
    engine = MLEngine()
    engine.train_automl()
