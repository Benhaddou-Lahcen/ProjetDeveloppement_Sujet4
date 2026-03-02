import { useEffect, useState } from "react";
import { usersApi, User, CreateUserRequest, RoleAssignmentRequest } from "../api/users";

interface PageResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const UsersPage = () => {
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });

  const [roleForm, setRoleForm] = useState({
    roles: [] as string[]
  });

  const loadUsers = async (pageNum = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersApi.getAll(pageNum, 10);
      setData(response.data);
      setPage(pageNum);
    } catch (e) {
      setError("Erreur lors du chargement des utilisateurs");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const role = e.target.value;
    setRoleForm((prev) => ({
      roles: e.target.checked
        ? [...prev.roles, role]
        : prev.roles.filter((r) => r !== role)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload: CreateUserRequest = {
        username: form.username,
        email: form.email,
        password: form.password,
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined
      };
      await usersApi.create(payload);
      setForm({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: ""
      });
      await loadUsers(0);
    } catch (e) {
      setError("Erreur lors de la création de l'utilisateur");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoles = async (userId: string) => {
    try {
      setLoading(true);
      const payload: RoleAssignmentRequest = { roles: roleForm.roles };
      await usersApi.assignRoles(userId, payload);
      setSelectedUserId(null);
      setRoleForm({ roles: [] });
      await loadUsers(page);
    } catch (e) {
      setError("Erreur lors de l'attribution des rôles");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        setLoading(true);
        await usersApi.delete(id);
        await loadUsers(page);
      } catch (e) {
        setError("Erreur lors de la suppression");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleUserStatus = async (userId: string, active: boolean) => {
    try {
      setLoading(true);
      if (active) {
        await usersApi.deactivate(userId);
      } else {
        await usersApi.activate(userId);
      }
      await loadUsers(page);
    } catch (e) {
      setError("Erreur lors de la mise à jour du statut");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Utilisateurs</h1>
      <section className="card">
        <h2>Créer un nouvel utilisateur</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Nom d'utilisateur"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            name="firstName"
            placeholder="Prénom"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Nom"
            value={form.lastName}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            Créer
          </button>
        </form>
      </section>

      {selectedUserId && (
        <section className="card">
          <h2>Attribuer des rôles</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label>
              <input
                type="checkbox"
                value="ROLE_ADMIN"
                checked={roleForm.roles.includes("ROLE_ADMIN")}
                onChange={handleRoleChange}
              />
              Administrateur
            </label>
            <label>
              <input
                type="checkbox"
                value="ROLE_DOCTOR"
                checked={roleForm.roles.includes("ROLE_DOCTOR")}
                onChange={handleRoleChange}
              />
              Médecin
            </label>
            <label>
              <input
                type="checkbox"
                value="ROLE_NURSE"
                checked={roleForm.roles.includes("ROLE_NURSE")}
                onChange={handleRoleChange}
              />
              Infirmier
            </label>
            <label>
              <input
                type="checkbox"
                value="ROLE_PATIENT"
                checked={roleForm.roles.includes("ROLE_PATIENT")}
                onChange={handleRoleChange}
              />
              Patient
            </label>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={() => handleAssignRoles(selectedUserId)} disabled={loading}>
              Enregistrer
            </button>
            <button
              onClick={() => {
                setSelectedUserId(null);
                setRoleForm({ roles: [] });
              }}
            >
              Annuler
            </button>
          </div>
        </section>
      )}

      <section className="card">
        <h2>Liste des utilisateurs</h2>
        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && data && data.content.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom d'utilisateur</th>
                  <th>Email</th>
                  <th>Rôles</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontSize: "0.85rem" }}>{user.id.substring(0, 8)}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.roles.join(", ") || "-"}</td>
                    <td>
                      <button
                        onClick={() => toggleUserStatus(user.id, user.active)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.85rem",
                          backgroundColor: user.active ? "#28a745" : "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        {user.active ? "Actif" : "Inactif"}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setRoleForm({ roles: user.roles });
                        }}
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.85rem",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginRight: "0.5rem"
                        }}
                      >
                        Rôles
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
                onClick={() => loadUsers(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Précédent
              </button>
              <span>Page {page + 1} / {data.totalPages}</span>
              <button
                onClick={() => loadUsers(page + 1)}
                disabled={page >= data.totalPages - 1}
              >
                Suivant
              </button>
            </div>
          </>
        )}
        {!loading && (!data || data.content.length === 0) && (
          <p>Aucun utilisateur disponible</p>
        )}
      </section>
    </div>
  );
};

