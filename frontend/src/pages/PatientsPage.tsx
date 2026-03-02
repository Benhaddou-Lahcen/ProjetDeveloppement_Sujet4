import { useEffect, useState } from "react";
import { createPatient, fetchPatients, PageResponse, Patient } from "../api/patients";

interface PatientForm {
  nationalId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
}

export const PatientsPage = () => {
  const [page, setPage] = useState<PageResponse<Patient> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<PatientForm>({
    nationalId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "2000-01-01",
    gender: "MALE"
  });

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchPatients();
      setPage(data);

    } catch {
      setError("Impossible de charger les patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPatients();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await createPatient({
        nationalId: form.nationalId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email || undefined,
        phoneNumber: form.phoneNumber || undefined,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender
      });

      setForm({
        nationalId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "2000-01-01",
        gender: "MALE"
      });

      await loadPatients();

    } catch {
      setError("Erreur lors de la création du patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Patients</h1>

      <section className="card">
        <h2>Nouveau patient</h2>

        <form className="form-grid" onSubmit={handleSubmit}>

          <input
            name="nationalId"
            placeholder="Identifiant national"
            value={form.nationalId}
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
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="MALE">Homme</option>
            <option value="FEMALE">Femme</option>
          </select>

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phoneNumber"
            placeholder="Téléphone"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Liste des patients</h2>

        {loading && <p>Chargement...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && page && (
          <table>
            <thead>
              <tr>
                <th>Nat. ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
              </tr>
            </thead>

            <tbody>
              {page.content.map((p) => (
                <tr key={p.patientId}>
                  <td>{p.nationalId}</td>
                  <td>{p.lastName}</td>
                  <td>{p.firstName}</td>
                  <td>{p.email || "-"}</td>
                  <td>{p.phoneNumber || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};



// import { useEffect, useState } from "react";
// import { createPatient, fetchPatients, PageResponse, Patient } from "../api/patients";
//
// export const PatientsPage = () => {
//   const [page, setPage] = useState<PageResponse<Patient> | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   const [form, setForm] = useState({
//     nationalId: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: ""
//   });
//
//   const loadPatients = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await fetchPatients();
//       setPage(data);
//     } catch (e) {
//       setError("Impossible de charger les patients");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   useEffect(() => {
//     void loadPatients();
//   }, []);
//
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };
//
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError(null);
//       await createPatient({
//         nationalId: form.nationalId,
//         firstName: form.firstName,
//         lastName: form.lastName,
//         email: form.email || undefined,
//         phoneNumber: form.phoneNumber || undefined
//       });
//       setForm({
//         nationalId: "",
//         firstName: "",
//         lastName: "",
//         email: "",
//         phoneNumber: ""
//       });
//       await loadPatients();
//     } catch (e) {
//       setError("Erreur lors de la création du patient");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div>
//       <h1>Patients</h1>
//       <section className="card">
//         <h2>Nouveau patient</h2>
//         <form className="form-grid" onSubmit={handleSubmit}>
//           <input
//             name="nationalId"
//             placeholder="Identifiant national"
//             value={form.nationalId}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="firstName"
//             placeholder="Prénom"
//             value={form.firstName}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="lastName"
//             placeholder="Nom"
//             value={form.lastName}
//             onChange={handleChange}
//             required
//           />
//           <input
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//           />
//           <input
//             name="phoneNumber"
//             placeholder="Téléphone"
//             value={form.phoneNumber}
//             onChange={handleChange}
//           />
//           <button type="submit" disabled={loading}>
//             Créer
//           </button>
//         </form>
//       </section>
//
//       <section className="card">
//         <h2>Liste des patients</h2>
//         {loading && <p>Chargement...</p>}
//         {error && <p className="error">{error}</p>}
//         {!loading && page && (
//           <table>
//             <thead>
//               <tr>
//                 <th>UUID</th>
//                 <th>Nat. ID</th>
//                 <th>Nom</th>
//                 <th>Prénom</th>
//                 <th>Email</th>
//                 <th>Téléphone</th>
//               </tr>
//             </thead>
//             <tbody>
//               {page.content.map((p) => (
//                 <tr key={p.patientId}>
//                   <td>{p.patientId}</td>
//                   <td>{p.nationalId}</td>
//                   <td>{p.lastName}</td>
//                   <td>{p.firstName}</td>
//                   <td>{p.email}</td>
//                   <td>{p.phoneNumber}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>
//     </div>
//   );
// };
//
