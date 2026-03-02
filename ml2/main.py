from pathlib import Path
import os
import numpy as np
import torch
import torch.nn as nn
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt, JWTError
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
import pandas as pd
from typing import Set

# ---------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------

APP_DIR = Path(__file__).resolve().parent
MODEL_PATH = APP_DIR / "models" / "global_model.pth"

DEVICE = torch.device("cpu")

JWT_SECRET = os.getenv("JWT_SECRET", "your-256-bit-secret-key-here-change-in-production")
ALLOWED_ALGORITHMS = ["HS256", "HS384", "HS512"]

# ---------------------------------------------------------------------
# FASTAPI APP
# ---------------------------------------------------------------------

app = FastAPI(
    title="Heart Disease ML Service",
    version="2.0.0-Federated"
)

# ⭐ CORS FIX (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
# SECURITY
# ---------------------------------------------------------------------

class TokenPayload(BaseModel):
    sub: str | None = None
    exp: int | None = None
    roles: Set[str] | None = None


def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=ALLOWED_ALGORITHMS,
            options={"verify_aud": False}
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(
    authorization: str = Header(None, alias="Authorization")
):
    if authorization is None:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    token = authorization.replace("Bearer ", "")
    return verify_token(token)

# ---------------------------------------------------------------------
# MODEL
# ---------------------------------------------------------------------

class HeartModel(nn.Module):
    def __init__(self, input_size):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_size, 16),
            nn.ReLU(),
            nn.Linear(16, 8),
            nn.ReLU(),
            nn.Linear(8, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

# ---------------------------------------------------------------------
# DATA PREPROCESSING
# ---------------------------------------------------------------------

FEATURE_COLUMNS = [
    "Age","Sex","ChestPainType","RestingBP","Cholesterol",
    "FastingBS","RestingECG","MaxHR","ExerciseAngina",
    "Oldpeak","ST_Slope"
]

categorical_cols = ["Sex","ChestPainType","RestingECG","ExerciseAngina","ST_Slope"]

numeric_cols = ["Age","RestingBP","Cholesterol","FastingBS","MaxHR","Oldpeak"]

preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(drop="first"), categorical_cols),
    ("num", StandardScaler(), numeric_cols),
])

# Load reference data
REFERENCE_DATA = pd.read_csv(APP_DIR / "data" / "heart_node1.csv")
X_ref = REFERENCE_DATA[FEATURE_COLUMNS]

preprocessor.fit(X_ref)

# ---------------------------------------------------------------------
# LOAD MODEL
# ---------------------------------------------------------------------

def load_model():
    if not MODEL_PATH.exists():
        raise RuntimeError("Model not found")

    input_size = preprocessor.transform(X_ref).shape[1]

    model = HeartModel(input_size)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()

    return model

model = load_model()

MODEL_VERSION = "2.0.0-Federated"

# ---------------------------------------------------------------------
# DTO
# ---------------------------------------------------------------------

class HeartDiseaseFeatures(BaseModel):
    Age:int
    Sex:str
    ChestPainType:str
    RestingBP:int
    Cholesterol:int
    FastingBS:int
    RestingECG:str
    MaxHR:int
    ExerciseAngina:str
    Oldpeak:float
    ST_Slope:str

class PredictionResponse(BaseModel):
    is_sick: bool
    probability: float
    model_version: str

# ---------------------------------------------------------------------
# ENDPOINTS
# ---------------------------------------------------------------------

@app.post("/predict", response_model=PredictionResponse)
def predict(
    features: HeartDiseaseFeatures,
    token_payload=Depends(get_current_user)
):

    data = pd.DataFrame([features.dict()])

    X = preprocessor.transform(data)
    X_tensor = torch.tensor(X.astype(np.float32))

    with torch.no_grad():
        proba = float(model(X_tensor).item())

    return PredictionResponse(
        is_sick=proba >= 0.5,
        probability=proba,
        model_version=MODEL_VERSION
    )

@app.get("/health")
def health():
    return {
        "status":"ok",
        "model_loaded": MODEL_PATH.exists()
    }








# from pathlib import Path
# from typing import Dict, Any, Set
# import os
#
# import numpy as np
# import torch
# import torch.nn as nn
# from fastapi import FastAPI, HTTPException, Depends, Header
# from pydantic import BaseModel, Field
# from jose import jwt, JWTError
# from sklearn.preprocessing import OneHotEncoder, StandardScaler
# from sklearn.compose import ColumnTransformer
# import pandas as pd
#
# # -----------------------------------------------------------------------------
# # Paths
# # -----------------------------------------------------------------------------
#
# APP_DIR = Path(__file__).resolve().parent
# MODELS_DIR = APP_DIR / "models"
# MODEL_PATH = MODELS_DIR / "global_model.pth"
#
# DEVICE = torch.device("cpu")
#
# # -----------------------------------------------------------------------------
# # JWT SECURITY
# # -----------------------------------------------------------------------------
#
# JWT_SECRET = os.getenv("JWT_SECRET", "your-256-bit-secret-key-here-change-in-production")
# # JJWT peut choisir HS256/HS384/HS512, donc on autorise les 3 pour éviter l'erreur
# ALLOWED_ALGORITHMS = ["HS256", "HS384", "HS512"]
#
#
# class TokenPayload(BaseModel):
#     sub: str | None = None
#     exp: int | None = None
#     roles: Set[str] | None = None
#
#
# def verify_token(token: str) -> TokenPayload:
#     try:
#         payload = jwt.decode(
#             token,
#             JWT_SECRET,
#             algorithms=ALLOWED_ALGORITHMS,
#             options={"verify_aud": False},
#         )
#         return TokenPayload(**payload)
#     except JWTError as e:
#         raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
#
#
# def get_current_user(authorization: str = Header(..., alias="Authorization")) -> TokenPayload:
#     token = authorization
#     if token.startswith("Bearer "):
#         token = token[len("Bearer ") :]
#     return verify_token(token)
#
#
# # -----------------------------------------------------------------------------
# # PyTorch Model (même architecture que FL)
# # -----------------------------------------------------------------------------
#
# class HeartModel(nn.Module):
#     def __init__(self, input_size):
#         super(HeartModel, self).__init__()
#         self.net = nn.Sequential(
#             nn.Linear(input_size, 16),
#             nn.ReLU(),
#             nn.Linear(16, 8),
#             nn.ReLU(),
#             nn.Linear(8, 1),
#             nn.Sigmoid()
#         )
#
#     def forward(self, x):
#         return self.net(x)
#
#
# # -----------------------------------------------------------------------------
# # Data preprocessing (identique au training)
# # -----------------------------------------------------------------------------
#
# FEATURE_COLUMNS = [
#     "Age", "Sex", "ChestPainType", "RestingBP", "Cholesterol",
#     "FastingBS", "RestingECG", "MaxHR", "ExerciseAngina",
#     "Oldpeak", "ST_Slope"
# ]
#
# categorical_cols = [
#     "Sex", "ChestPainType", "RestingECG",
#     "ExerciseAngina", "ST_Slope"
# ]
#
# numeric_cols = [
#     "Age", "RestingBP", "Cholesterol",
#     "FastingBS", "MaxHR", "Oldpeak"
# ]
#
# preprocessor = ColumnTransformer(
#     transformers=[
#         ("cat", OneHotEncoder(drop="first"), categorical_cols),
#         ("num", StandardScaler(), numeric_cols),
#     ]
# )
#
# # IMPORTANT :
# # Tu dois fitter ce preprocessor sur les données d'entraînement
# # et sauvegarder aussi le preprocessor si tu veux production propre.
# # Ici on suppose qu'on le fitte à partir d’un CSV de référence.
#
# REFERENCE_DATA = pd.read_csv(APP_DIR / "data" / "heart_node1.csv")
# X_ref = REFERENCE_DATA[FEATURE_COLUMNS]
# preprocessor.fit(X_ref)
#
#
# # -----------------------------------------------------------------------------
# # Load global model
# # -----------------------------------------------------------------------------
#
# def load_model():
#     if not MODEL_PATH.exists():
#         raise RuntimeError("Federated global model not found.")
#
#     input_size = preprocessor.transform(X_ref).shape[1]
#     model = HeartModel(input_size)
#     model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
#     model.eval()
#     return model
#
#
# model = load_model()
# MODEL_VERSION = "2.0.0-Federated"
#
# # -----------------------------------------------------------------------------
# # FastAPI app
# # -----------------------------------------------------------------------------
#
# app = FastAPI(
#     title="Heart Disease ML Service (Federated)",
#     version=MODEL_VERSION,
# )
#
#
# class HeartDiseaseFeatures(BaseModel):
#     Age: int
#     Sex: str
#     ChestPainType: str
#     RestingBP: int
#     Cholesterol: int
#     FastingBS: int
#     RestingECG: str
#     MaxHR: int
#     ExerciseAngina: str
#     Oldpeak: float
#     ST_Slope: str
#
#
# class PredictionResponse(BaseModel):
#     is_sick: bool
#     probability: float
#     model_version: str
#
#
# @app.post("/predict", response_model=PredictionResponse)
# def predict(
#     features: HeartDiseaseFeatures,
#     token_payload: TokenPayload = Depends(get_current_user),
# ):
#     try:
#         data = pd.DataFrame([features.dict()])
#         X = preprocessor.transform(data)
#         X_tensor = torch.tensor(X.astype(np.float32))
#
#         with torch.no_grad():
#             proba = float(model(X_tensor).item())
#
#         is_sick = proba >= 0.5
#
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
#
#     return PredictionResponse(
#         is_sick=is_sick,
#         probability=proba,
#         model_version=MODEL_VERSION,
#     )
#
#
# @app.get("/health")
# def health():
#     return {"status": "ok", "model_loaded": MODEL_PATH.exists()}
