import axios from "axios";

const ml2Client = axios.create({
  baseURL: import.meta.env.VITE_ML2_API_URL || "http://localhost:8000",
  timeout: 30000
});

export interface HeartDiseaseInput {
  Age: number;
  Sex: "M" | "F";
  ChestPainType: "ATA" | "ASY" | "NAP" | "TA";
  RestingBP: number;
  Cholesterol: number;
  FastingBS: 0 | 1;
  RestingECG: "Normal" | "ST" | "LVH";
  MaxHR: number;
  ExerciseAngina: "Y" | "N";
  Oldpeak: number;
  ST_Slope: "Up" | "Flat" | "Down";
}

export interface PredictionResponse {
  is_sick: boolean;
  probability: number;
  model_version: string;
}

ml2Client.interceptors.request.use((config) => {
  const authState = localStorage.getItem("auth_state");

  if (authState) {
    try {
      const parsed = JSON.parse(authState);

      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error("Auth parse error", e);
    }
  }

  return config;
});

export const ml2Api = {
  predictHeartDisease: async (data: HeartDiseaseInput) => {
    const response = await ml2Client.post("/predict", data);
    return response.data;
  },

  checkHealth: async () => {
    const response = await ml2Client.get("/health");
    return response.data;
  }
};


// import axios from "axios";
//
// // ML2 FastAPI server is independent (port 8085)
// const ml2Client = axios.create({
//   baseURL: process.env.REACT_APP_ML2_API_URL || "http://localhost:8085",
//   timeout: 30000,
// });
//
// export interface HeartDiseaseInput {
//   Age: number;
//   Sex: "M" | "F";
//   ChestPainType: "ATA" | "ASY" | "NAP" | "TA";
//   RestingBP: number;
//   Cholesterol: number;
//   FastingBS: 0 | 1;
//   RestingECG: "Normal" | "ST" | "LVH";
//   MaxHR: number;
//   ExerciseAngina: "Y" | "N";
//   Oldpeak: number;
//   ST_Slope: "Up" | "Flat" | "Down";
// }
//
// export interface PredictionResponse {
//   is_sick: boolean;
//   probability: number;
//   model_version: string;
// }
//
// // Add JWT token to ML2 requests
// ml2Client.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
//
// export const ml2Api = {
//   predictHeartDisease: async (data: HeartDiseaseInput) => {
//     const response = await ml2Client.post<PredictionResponse>("/predict", data);
//     return response.data;
//   },
//
//   checkHealth: async () => {
//     const response = await ml2Client.get("/health");
//     return response.data;
//   }
// };
