import { useEffect, useState } from "react";
import { consultationsApi, Consultation, CreateConsultationRequest } from "../api/consultations";

interface PageResponse {
  content: Consultation[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const ConsultationsPage = () => {
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    consultationDate: "",
    diagnosis: "",
    treatment: "",
    notes: ""
  });

  const loadConsultations = async (pageNum = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await consultationsApi.getAll();
      setData(response.data);
      setPage(pageNum);
    } catch (e) {
      setError("Erreur lors du chargement des consultations");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations(0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload: CreateConsultationRequest = {
        patientId: form.patientId,
        doctorId: form.doctorId,
        consultationDate: form.consultationDate,
        diagnosis: form.diagnosis || undefined,
        treatment: form.treatment || undefined,
        notes: form.notes || undefined
      };
      await consultationsApi.create(payload);
      setForm({
        patientId: "",
        doctorId: "",
        consultationDate: "",
        diagnosis: "",
        treatment: "",
        notes: ""
      });
      await loadConsultations(0);
    } catch (e) {
      setError("Erreur lors de la création de la consultation");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        setLoading(true);
        await consultationsApi.delete(id);
        await loadConsultations(page);
      } catch (e) {
        setError("Erreur lors de la suppression");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Consultations</h1>
      <section className="card">
        <h2>Créer une consultation</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="patientId"
            placeholder="ID Patient"
            value={form.patientId}
            onChange={handleChange}
            required
          />
          <input
            name="doctorId"
            placeholder="ID Médecin"
            value={form.doctorId}
            onChange={handleChange}
            required
          />
          <input
            name="consultationDate"
            type="datetime-local"
            value={form.consultationDate}
            onChange={handleChange}
            required
          />
          <textarea
            name="diagnosis"
            placeholder="Diagnostic"
            value={form.diagnosis}
            onChange={handleChange}
            style={{ gridColumn: "1 / -1" }}
          />
          <textarea
            name="treatment"
            placeholder="Traitement"
            value={form.treatment}
            onChange={handleChange}
            style={{ gridColumn: "1 / -1" }}
          />
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
        <h2>Historique des consultations</h2>
        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && data && data.content.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Médecin</th>
                  <th>Date</th>
                  <th>Diagnostic</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((consultation) => (
                  <tr key={consultation.id}>
                    <td style={{ fontSize: "0.85rem" }}>{consultation.id.substring(0, 8)}</td>
                    <td>{consultation.patientId.substring(0, 8)}</td>
                    <td>{consultation.doctorId.substring(0, 8)}</td>
                    <td>{new Date(consultation.consultationDate).toLocaleDateString("fr-FR")}</td>
                    <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {consultation.diagnosis || "-"}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(consultation.id)}
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
                onClick={() => loadConsultations(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Précédent
              </button>
              <span>Page {page + 1} / {data.totalPages}</span>
              <button
                onClick={() => loadConsultations(page + 1)}
                disabled={page >= data.totalPages - 1}
              >
                Suivant
              </button>
            </div>
          </>
        )}
        {!loading && (!data || data.content.length === 0) && (
          <p>Aucune consultation disponible</p>
        )}
      </section>
    </div>
  );
};

