import { useEffect, useState } from "react";
import { appointmentsApi, Appointment, CreateAppointmentRequest } from "../api/appointments";

interface PageResponse {
  content: Appointment[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const AppointmentsPage = () => {
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const [form, setForm] = useState({
    patientId: "",
    staffId: "",
    appointmentDate: "",
    type: "",
    notes: ""
  });

  const loadAppointments = async (pageNum = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await appointmentsApi.getAll(pageNum, 10);
      setData(response.data);
      setPage(pageNum);
    } catch (e) {
      setError("Erreur lors du chargement des rendez-vous");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments(0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload: CreateAppointmentRequest = {
        patientId: form.patientId,
        staffId: form.staffId,
        appointmentDate: form.appointmentDate,
        type: form.type,
        notes: form.notes || undefined
      };
      await appointmentsApi.create(payload);
      setForm({
        patientId: "",
        staffId: "",
        appointmentDate: "",
        type: "",
        notes: ""
      });
      await loadAppointments(0);
    } catch (e) {
      setError("Erreur lors de la création du rendez-vous");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        setLoading(true);
        await appointmentsApi.delete(id);
        await loadAppointments(page);
      } catch (e) {
        setError("Erreur lors de la suppression");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setLoading(true);
      await appointmentsApi.updateStatus(id, status);
      await loadAppointments(page);
    } catch (e) {
      setError("Erreur lors de la mise à jour du statut");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Rendez-vous</h1>
      <section className="card">
        <h2>Créer un rendez-vous</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="patientId"
            placeholder="ID Patient"
            value={form.patientId}
            onChange={handleChange}
            required
          />
          <input
            name="staffId"
            placeholder="ID Personnel"
            value={form.staffId}
            onChange={handleChange}
            required
          />
          <input
            name="appointmentDate"
            type="datetime-local"
            placeholder="Date/Heure"
            value={form.appointmentDate}
            onChange={handleChange}
            required
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un type</option>
            <option value="CONSULTATION">Consultation</option>
            <option value="CHECKUP">Bilan</option>
            <option value="SURGERY">Intervention</option>
            <option value="FOLLOW_UP">Suivi</option>
          </select>
          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            style={{ gridColumn: "1 / -1" }}
          />
          <button type="submit" disabled={loading}>
            Créer
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Liste des rendez-vous</h2>
        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && data && data.content.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Personnel</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((apt) => (
                  <tr key={apt.id}>
                    <td style={{ fontSize: "0.85rem" }}>{apt.id.substring(0, 8)}</td>
                    <td>{apt.patientId.substring(0, 8)}</td>
                    <td>{apt.staffId.substring(0, 8)}</td>
                    <td>{new Date(apt.appointmentDate).toLocaleDateString("fr-FR")}</td>
                    <td>{apt.type}</td>
                    <td>
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        style={{
                          padding: "0.25rem",
                          borderRadius: "4px",
                          border: "1px solid #ccc"
                        }}
                      >
                        <option value="PENDING">En attente</option>
                        <option value="CONFIRMED">Confirmé</option>
                        <option value="COMPLETED">Terminé</option>
                        <option value="CANCELLED">Annulé</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(apt.id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.85rem",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => loadAppointments(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Précédent
              </button>
              <span>Page {page + 1} / {data.totalPages}</span>
              <button
                onClick={() => loadAppointments(page + 1)}
                disabled={page >= data.totalPages - 1}
              >
                Suivant
              </button>
            </div>
          </>
        )}
        {!loading && (!data || data.content.length === 0) && (
          <p>Aucun rendez-vous disponible</p>
        )}
      </section>
    </div>
  );
};

