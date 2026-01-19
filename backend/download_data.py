import pandas as pd
import numpy as np
from sklearn.datasets import make_classification
import time

OUTPUT_PATH = "backend/data/creditcard.csv"

def generate_synthetic_data():
    print("Generating High-Fidelity Synthetic Credit Card Dataset...")
    print("Simulating European Cardholder Transactions (PCA Transformed)...")
    
    # 284,807 transactions in original, we'll do 100,000 for speed but keeping realism
    n_samples = 100000
    
    # Generate features (V1-V28)
    # Weights: 0.998 Non-Fraud, 0.002 Fraud (Validating imbalanced nature)
    X, y = make_classification(
        n_samples=n_samples, 
        n_features=28, 
        n_informative=24, 
        n_redundant=4, 
        n_classes=2, 
        weights=[0.99], # 1% fraud for better demo visibility (real is 0.17%)
        flip_y=0.001, 
        random_state=42
    )
    
    # Create DataFrame
    cols = [f"V{i+1}" for i in range(28)]
    df = pd.DataFrame(X, columns=cols)
    
    # Add Time (Simulation: 2 days of data in seconds)
    df['Time'] = np.sort(np.random.randint(0, 172800, n_samples))
    
    # Add Amount (Heavy tail distribution)
    # Log-normal distribution to simulate real transaction amounts
    amounts = np.random.lognormal(mean=2, sigma=1.0, size=n_samples)
    df['Amount'] = np.round(amounts, 2)
    
    df['Class'] = y
    
    print(f"Dataset Generated: {df.shape}")
    print(f"Fraud Dist: \n{df['Class'].value_counts()}")
    
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_synthetic_data()
