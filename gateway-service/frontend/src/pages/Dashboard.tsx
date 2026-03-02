import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiClient } from "../api/client";

interface DashboardStats {
  totalPatients?: number;
  totalAppointments?: number;
  totalStaff?: number;
  upcomingAppointments?: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [patientsRes, appointmentsRes, staffRes] = await Promise.all([
          apiClient.get("/patients?page=0&size=1").catch(() => ({ data: { totalElements: 0 } })),
          apiClient.get("/appointments?page=0&size=1").catch(() => ({ data: { totalElements: 0 } })),
          apiClient.get("/staff?page=0&size=1").catch(() => ({ data: { totalElements: 0 } }))
        ]);

        setStats({
          totalPatients: patientsRes.data.totalElements || 0,
          totalAppointments: appointmentsRes.data.totalElements || 0,
          totalStaff: staffRes.data.totalElements || 0,
          upcomingAppointments: 0
        });
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Tableau de bord</h1>
      {user && (
        <p style={{ marginBottom: "1.5rem" }}>
          Bienvenue, <strong>{user.username}</strong> ({user.roles.join(", ") || "aucun rôle"})
        </p>
      )}

      {error && <div className="error" style={{ marginBottom: "1rem" }}>{error}</div>}

      {loading ? (
        <p>Chargement des statistiques...</p>
      ) : (
        <div className="stats-grid">
          <section className="card stat-card">
            <h3>Patients</h3>
            <p className="stat-number">{stats.totalPatients || 0}</p>
          </section>
          <section className="card stat-card">
            <h3>Rendez-vous</h3>
            <p className="stat-number">{stats.totalAppointments || 0}</p>
          </section>
          <section className="card stat-card">
            <h3>Personnel</h3>
            <p className="stat-number">{stats.totalStaff || 0}</p>
          </section>
          <section className="card stat-card">
            <h3>À venir</h3>
            <p className="stat-number">{stats.upcomingAppointments || 0}</p>
          </section>
        </div>
      )}
    </div>
  );
};

