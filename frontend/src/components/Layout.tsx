import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navItems = [
  { path: "/", label: "Tableau de bord" },
  { path: "/patients", label: "Patients" },
  { path: "/staff", label: "Personnel" },
  { path: "/appointments", label: "Rendez-vous" },
  { path: "/consultations", label: "Consultations" },
  { path: "/medical-records", label: "Dossiers médicaux" },
  { path: "/users", label: "Utilisateurs" },
  { path: "/heart-disease-prediction", label: "Prédiction Cardiaque (ML)" }
];

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-root">
      {isAuthenticated && (
        <aside className="sidebar">
          <div className="logo">Hospital Kit</div>
          <nav>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path
                    ? "nav-link nav-link-active"
                    : "nav-link"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: "auto", fontSize: "0.9rem" }}>
            <button
              type="button"
              onClick={handleLogout}
              className="logout-btn"
            >
              ⎋ Déconnexion
            </button>
          </div>
        </aside>
      )}
      <main className="content" style={{ width: isAuthenticated ? "auto" : "100%" }}>
        <Outlet />
      </main>
    </div>
  );
};

