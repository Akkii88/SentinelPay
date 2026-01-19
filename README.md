# SentinelPay

SentinelPay is a comprehensive fraud detection system that interfaces with a machine learning backend to identify suspicious transactions in real-time. The application consists of a React frontend and a FastAPI backend, designed for scalability and ease of use.

## Features

- **Real-time Fraud Detection**: Uses an XGBoost model to classify transactions.
- **Interactive Dashboard**: A React-based UI to visualize transaction data and alerts.
- **AutoML Capabilities**: Includes components for automated model retraining.
- **Alert Management**: System to manage and review flagged transactions.

## Tech Stack

- **Frontend**: React, Vite, CSS
- **Backend**: Python, FastAPI, Pandas, XGBoost
- **Machine Learning**: Scikit-learn, XGBoost

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.10 or higher)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ankit/SentinelPay.git
    cd SentinelPay
    ```

2.  **Backend Setup:**

    Navigate to the backend directory and install dependencies.

    ```bash
    cd backend
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    ```

3.  **Frontend Setup:**

    Navigate to the frontend directory and install dependencies.

    ```bash
    cd ../frontend
    npm install
    ```

## Usage

### Running the Application

1.  **Start the Backend:**

    From the `backend` directory (with virtual environment activated):

    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

2.  **Start the Frontend:**

    From the `frontend` directory:

    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## File Structure

```
SentinelPay/
├── backend/            # FastAPI application and ML logic
│   ├── main.py         # App entry point
│   ├── ml_engine.py    # Machine learning inference engine
│   └── ...
├── frontend/           # React application
│   ├── src/            # Source code
│   └── ...
└── README.md           # Project documentation
```
