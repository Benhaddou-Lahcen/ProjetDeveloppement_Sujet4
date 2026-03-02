import { useEffect, useState } from "react";
import { medicalRecordsApi, MedicalRecord, MedicalEntry, CreateMedicalEntryRequest } from "../api/medicalRecords";

export const MedicalRecordsPage = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchPatientId, setSearchPatientId] = useState("");
  const [entryForm, setEntryForm] = useState({
    type: "",
    description: "",
    date: ""
  });

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await medicalRecordsApi.getAll(0, 20);
      setRecords(response.data.content || []);
    } catch (e) {
      setError("Erreur lors du chargement des dossiers");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const searchPatient = async () => {
    if (!searchPatientId.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const response = await medicalRecordsApi.getByPatient(searchPatientId);
      setSelectedRecord(response.data);
    } catch (e) {
      setError("Dossier non trouvé");
      setSelectedRecord(null);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEntryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    try {
      setLoading(true);
      const payload: CreateMedicalEntryRequest = {
        type: entryForm.type,
        description: entryForm.description,
        date: entryForm.date
      };
      await medicalRecordsApi.createEntry(selectedRecord.patientId, payload);
      setEntryForm({ type: "", description: "", date: "" });
      await searchPatient();
    } catch (e) {
      setError("Erreur lors de l'ajout de l'entrée");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (recordId: string, entryId: string) => {
    if (confirm("Êtes-vous sûr?")) {
      try {
        setLoading(true);
        await medicalRecordsApi.deleteEntry(recordId, entryId);
        if (selectedRecord) {
          await searchPatient();
        }
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
      <h1>Dossiers médicaux</h1>

      <section className="card">
        <h2>Rechercher un dossier patient</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="ID Patient"
            value={searchPatientId}
            onChange={(e) => setSearchPatientId(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={searchPatient} disabled={loading}>
            Rechercher
          </button>
        </div>
      </section>

      {error && <div className="error" style={{ margin: "1rem 0" }}>{error}</div>}

      {selectedRecord && (
        <>
          <section className="card">
            <h2>Ajouter une entrée médicale</h2>
            <form className="form-grid" onSubmit={handleAddEntry}>
              <select
                name="type"
                value={entryForm.type}
                onChange={handleEntryChange}
                required
              >
                <option value="">Type d'entrée</option>
                <option value="DIAGNOSIS">Diagnostic</option>
                <option value="TREATMENT">Traitement</option>
                <option value="TEST">Test</option>
                <option value="NOTE">Note</option>
              </select>
              <input
                name="date"
                type="date"
                value={entryForm.date}
                onChange={handleEntryChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={entryForm.description}
                onChange={handleEntryChange}
                style={{ gridColumn: "1 / -1" }}
                required
              />
              <button type="submit" disabled={loading}>
                Ajouter
              </button>
            </form>
          </section>

          <section className="card">
            <h2>Entrées médicales</h2>
            {selectedRecord.entries && selectedRecord.entries.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecord.entries.map((entry: MedicalEntry) => (
                    <tr key={entry.id}>
                      <td>{new Date(entry.date).toLocaleDateString("fr-FR")}</td>
                      <td>{entry.type}</td>
                      <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {entry.description}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteEntry(selectedRecord.id, entry.id)}
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
            ) : (
              <p>Aucune entrée médicale</p>
            )}
          </section>
        </>
      )}

      {!selectedRecord && !loading && (
        <section className="card">
          <h2>Dossiers récents</h2>
          {records.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID Dossier</th>
                  <th>ID Patient</th>
                  <th>Entrées</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td style={{ fontSize: "0.85rem" }}>{record.id.substring(0, 8)}</td>
                    <td style={{ fontSize: "0.85rem" }}>{record.patientId.substring(0, 8)}</td>
                    <td>{record.entries?.length || 0}</td>
                    <td>
                      <button
                        onClick={() => {
                          setSearchPatientId(record.patientId);
                          setSelectedRecord(record);
                        }}
                      >
                        Ouvrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Aucun dossier disponible</p>
          )}
        </section>
      )}
    </div>
  );
};

