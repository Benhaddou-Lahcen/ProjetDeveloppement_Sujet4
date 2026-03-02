import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { PatientsPage } from "./pages/PatientsPage";
import { StaffPage } from "./pages/StaffPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { ConsultationsPage } from "./pages/ConsultationsPage";
import { MedicalRecordsPage } from "./pages/MedicalRecordsPage";
import { UsersPage } from "./pages/UsersPage";
import { HeartDiseasePredictionPage } from "./pages/HeartDiseasePredictionPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RequireAuth } from "./auth/RequireAuth";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/patients"
          element={
            <RequireAuth>
              <PatientsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/staff"
          element={
            <RequireAuth>
              <StaffPage />
            </RequireAuth>
          }
        />
        <Route
          path="/appointments"
          element={
            <RequireAuth>
              <AppointmentsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/consultations"
          element={
            <RequireAuth>
              <ConsultationsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/medical-records"
          element={
            <RequireAuth>
              <MedicalRecordsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuth>
              <UsersPage />
            </RequireAuth>
          }
        />
        <Route
          path="/heart-disease-prediction"
          element={
            <RequireAuth>
              <HeartDiseasePredictionPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;

