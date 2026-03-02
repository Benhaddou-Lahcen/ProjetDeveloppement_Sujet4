import { useEffect, useState } from "react";
import { staffApi, Staff, CreateStaffRequest } from "../api/staff";

interface PageResponse {
  content: Staff[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const StaffPage = () => {
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const [form, setForm] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    role: "",
    department: ""
  });

  const loadStaff = async (pageNum = 0) => {
//       async (pageNum = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await staffApi.getAll();
      setData(response.data);
      //setPage(pageNum);
    } catch (e) {
      setError("Erreur lors du chargement du personnel");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff(0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload: CreateStaffRequest = {
        userId: form.userId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        specialty: form.specialty,
        role: form.role,
        department: form.department || undefined
      };
      await staffApi.create(payload);
      setForm({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialty: "",
        role: "",
        department: ""
      });
      await loadStaff(0);
    } catch (e) {
      setError("Erreur lors de la création du personnel");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        setLoading(true);
        await staffApi.delete(id);
        await loadStaff(page);
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
      <h1>Personnel</h1>
      <section className="card">
        <h2>Ajouter du personnel</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="userId"
            placeholder="ID Utilisateur"
            value={form.userId}
            onChange={handleChange}
            required
          />
          <input
            name="firstName"
            placeholder="Prénom"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Nom"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
          />
          <select
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner une spécialité</option>
            <option value="CARDIOLOGY">Cardiologie</option>
            <option value="NEUROLOGY">Neurologie</option>
            <option value="ORTHOPEDICS">Orthopédie</option>
            <option value="GENERAL">Généraliste</option>
          </select>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un rôle</option>
            <option value="DOCTOR">Médecin</option>
            <option value="NURSE">Infirmier</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input
            name="department"
            placeholder="Département"
            value={form.department}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            Ajouter
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Liste du personnel</h2>
        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && data && data.content.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Spécialité</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((staff) => (
                  <tr key={staff.id}>
                    <td style={{ fontSize: "0.85rem" }}>{staff.id.substring(0, 8)}</td>
                    <td>{staff.lastName}</td>
                    <td>{staff.firstName}</td>
                    <td>{staff.email}</td>
                    <td>{staff.specialty}</td>
                    <td>{staff.role}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(staff.id)}
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
                onClick={() => loadStaff(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Précédent
              </button>
              <span>Page {page + 1} / {data.totalPages}</span>
              <button
                onClick={() => loadStaff(page + 1)}
                disabled={page >= data.totalPages - 1}
              >
                Suivant
              </button>
            </div>
          </>
        )}
        {!loading && (!data || data.content.length === 0) && (
          <p>Aucun personnel disponible</p>
        )}
      </section>
    </div>
  );
};

