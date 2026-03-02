import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      
      const response = await authApi.login({ username, password });
      
      console.log("[v0] Login response:", response);
      
      login({
        token: response.token,
        user: response.user
      });
      
      const from = (location.state as { from?: Location })?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      console.log("[v0] Login error:", err);
      const errorMsg = err?.response?.data?.message || "Identifiants invalides";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <section className="card" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 style={{ marginTop: 0, marginBottom: "1.5rem", textAlign: "center" }}>Connexion</h1>
        
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        
        {error && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "0.75rem", 
            backgroundColor: "#fee", 
            color: "#c00", 
            borderRadius: "0.25rem",
            fontSize: "0.9rem"
          }}>
            {error}
          </div>
        )}
        
        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", textAlign: "center", marginBottom: 0 }}>
          Pas encore de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </section>
    </div>
  );
};

