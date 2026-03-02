# Carte des Pages et Endpoints - Frontend Hospital Kit

## 📍 Map des Pages

```
Frontend Application
├── /login (Public)
│   └── LoginPage.tsx
│       └── POST /api/auth/login
├── /register (Public)
│   └── RegisterPage.tsx
│       └── POST /api/auth/register
└── (Protected Routes)
    ├── / (Dashboard)
    │   └── Dashboard.tsx
    │       ├── GET /api/patients?page=0&size=1
    │       ├── GET /api/appointments?page=0&size=1
    │       └── GET /api/staff?page=0&size=1
    ├── /patients
    │   └── PatientsPage.tsx
    │       ├── GET /api/patients?page=0&size=10
    │       ├── POST /api/patients
    │       └── Pagination
    ├── /staff
    │   └── StaffPage.tsx
    │       ├── GET /api/staff?page=0&size=10
    │       ├── POST /api/staff
    │       ├── DELETE /api/staff/{id}
    │       └── Pagination + Spécialités
    ├── /appointments
    │   └── AppointmentsPage.tsx
    │       ├── GET /api/appointments?page=0&size=10
    │       ├── POST /api/appointments
    │       ├── PATCH /api/appointments/{id}/status
    │       ├── DELETE /api/appointments/{id}
    │       └── Pagination + Statuts
    ├── /consultations
    │   └── ConsultationsPage.tsx
    │       ├── GET /api/consultations?page=0&size=10
    │       ├── POST /api/consultations
    │       ├── DELETE /api/consultations/{id}
    │       └── Pagination
    ├── /medical-records
    │   └── MedicalRecordsPage.tsx
    │       ├── GET /api/medical-records?page=0&size=20
    │       ├── GET /api/medical-records/patient/{id}
    │       ├── POST /api/medical-records/patient/{id}/entries
    │       ├── DELETE /api/medical-records/{id}/entries/{entryId}
    │       └── Recherche par patient
    └── /users
        └── UsersPage.tsx
            ├── GET /api/users?page=0&size=10
            ├── POST /api/users
            ├── POST /api/users/{id}/roles
            ├── PATCH /api/users/{id}/activate
            ├── PATCH /api/users/{id}/deactivate
            ├── DELETE /api/users/{id}
            └── Pagination + Gestion rôles
```

## 📝 Détail des Pages

### 1. LoginPage.tsx (Public)
```typescript
// Route: /login
// Authentification utilisateur
// POST /api/auth/login → Récupère JWT + user info
// Stockage: localStorage → AuthContext
// Redirection: / (Dashboard)

Inputs:
- username: string
- password: string

Response:
{
  accessToken: "jwt_token",
  username: string,
  roles: string[]
}
```

### 2. RegisterPage.tsx (Public)
```typescript
// Route: /register
// Inscription nouveau compte
// POST /api/auth/register → Crée utilisateur
// Redirection: /login (après succès)

Inputs:
- username: string
- email: string
- password: string
- confirmPassword: string (validation)

Response:
{
  message: "User created successfully"
}
```

### 3. Dashboard.tsx (Protected)
```typescript
// Route: /
// Statistiques en temps réel
// Calls:
// - GET /api/patients?page=0&size=1 → totalElements
// - GET /api/appointments?page=0&size=1 → totalElements
// - GET /api/staff?page=0&size=1 → totalElements

Display:
- Patients (count)
- Appointments (count)
- Staff (count)
- Upcoming (placeholder)
```

### 4. PatientsPage.tsx (Protected)
```typescript
// Route: /patients
// CRUD Patients + Pagination
// Calls:
// - GET /api/patients?page=0&size=10
// - POST /api/patients
// - (Future: PUT, DELETE)

Features:
- Créer patient
  Inputs: nationalId, firstName, lastName, email?, phoneNumber?
- Voir liste paginée
- 10 par page
- Navigation page précédente/suivante

Form:
{
  nationalId: string (required)
  firstName: string (required)
  lastName: string (required)
  email: string (optional)
  phoneNumber: string (optional)
}
```

### 5. StaffPage.tsx (Protected)
```typescript
// Route: /staff
// CRUD Personnel + Pagination
// Calls:
// - GET /api/staff?page=0&size=10
// - POST /api/staff
// - DELETE /api/staff/{id}

Features:
- Ajouter personnel
  Inputs: userId, firstName, lastName, email, phone?,
          specialty (enum), role (enum), department?
- Voir liste paginée
- Supprimer avec confirmation
- 10 par page

Form:
{
  userId: string (required)
  firstName: string (required)
  lastName: string (required)
  email: string (required)
  phone: string (optional)
  specialty: "CARDIOLOGY" | "NEUROLOGY" | "ORTHOPEDICS" | "GENERAL"
  role: "DOCTOR" | "NURSE" | "ADMIN"
  department: string (optional)
}

Table Columns:
- ID, Nom, Prénom, Email, Spécialité, Rôle
```

### 6. AppointmentsPage.tsx (Protected)
```typescript
// Route: /appointments
// CRUD Rendez-vous + Gestion Statuts
// Calls:
// - GET /api/appointments?page=0&size=10
// - POST /api/appointments
// - PATCH /api/appointments/{id}/status
// - DELETE /api/appointments/{id}

Features:
- Créer rendez-vous
- Voir liste paginée
- Modifier statut (dropdown)
- Supprimer avec confirmation
- 10 par page

Form:
{
  patientId: string (required, UUID)
  staffId: string (required, UUID)
  appointmentDate: string (datetime-local)
  type: "CONSULTATION" | "CHECKUP" | "SURGERY" | "FOLLOW_UP"
  notes: string (optional)
}

Statuts:
- PENDING → En attente
- CONFIRMED → Confirmé
- COMPLETED → Terminé
- CANCELLED → Annulé

Table Columns:
- ID, Patient, Personnel, Date, Type, Statut (editable), Actions
```

### 7. ConsultationsPage.tsx (Protected)
```typescript
// Route: /consultations
// Historique consultations + Pagination
// Calls:
// - GET /api/consultations?page=0&size=10
// - POST /api/consultations
// - DELETE /api/consultations/{id}

Features:
- Créer consultation
- Voir historique paginé
- Supprimer avec confirmation
- 10 par page

Form:
{
  patientId: string (required, UUID)
  doctorId: string (required, UUID)
  consultationDate: string (datetime-local)
  diagnosis: string (optional)
  treatment: string (optional)
  notes: string (optional)
}

Table Columns:
- ID, Patient, Médecin, Date, Diagnostic, Actions
```

### 8. MedicalRecordsPage.tsx (Protected)
```typescript
// Route: /medical-records
// Dossiers Médicaux + Gestion Entrées
// Calls:
// - GET /api/medical-records?page=0&size=20 (initial)
// - GET /api/medical-records/patient/{patientId} (recherche)
// - POST /api/medical-records/patient/{patientId}/entries
// - DELETE /api/medical-records/{recordId}/entries/{entryId}

Features:
- Recherche par ID patient
- Affichage du dossier complet
- Ajout d'entrées médicales
- Historique des entrées
- Suppression entrées

Recherche:
- Input: patientId
- Appel: GET /api/medical-records/patient/{patientId}

Ajout Entrée:
{
  type: "DIAGNOSIS" | "TREATMENT" | "TEST" | "NOTE"
  description: string (required)
  date: string (date)
}

Affichage Dossiers:
{
  id: UUID
  patientId: UUID
  entries: [
    {
      id: UUID
      type: string
      description: string
      date: string
    }
  ]
}
```

### 9. UsersPage.tsx (Protected)
```typescript
// Route: /users
// CRUD Utilisateurs + Rôles
// Calls:
// - GET /api/users?page=0&size=10
// - POST /api/users
// - POST /api/users/{id}/roles
// - PATCH /api/users/{id}/activate
// - PATCH /api/users/{id}/deactivate
// - DELETE /api/users/{id}

Features:
- Créer utilisateur
- Voir liste paginée
- Modifier rôles (checkboxes)
- Activer/Désactiver
- Supprimer avec confirmation
- 10 par page

Création Form:
{
  username: string (required)
  email: string (required)
  password: string (required)
  firstName: string (optional)
  lastName: string (optional)
}

Attribution Rôles:
{
  roles: ["ROLE_ADMIN", "ROLE_DOCTOR", "ROLE_NURSE", "ROLE_PATIENT"]
}

Rôles Disponibles:
- ROLE_ADMIN: Administrateur
- ROLE_DOCTOR: Médecin
- ROLE_NURSE: Infirmier
- ROLE_PATIENT: Patient

Table Columns:
- ID, Username, Email, Rôles, Statut (Active/Inactive), Actions (Rôles, Supprimer)
```

## 🔄 Flux d'Authentification

```
Utilisateur
    ↓
LoginPage.tsx
    ↓
POST /api/auth/login
    ↓
AuthContext.setAuth()
    ↓
localStorage: auth_state
    ↓
Redirection /
    ↓
Dashboard.tsx
    ↓
Menu visible
    ↓
Accès pages protégées
```

## 🚫 Protection des Routes

```typescript
// Toutes les routes protégées sont wrappées:
<RequireAuth>
  <ProtectedPage />
</RequireAuth>

// Si non authentifié:
// Redirection → /login

// Si token expiré (401):
// Effacement token
// Redirection → /login
```

## 📊 Flux de Données par Page

### Pages avec Pagination
```
PatientsPage, StaffPage, AppointmentsPage, 
ConsultationsPage, UsersPage

1. Composant monte
   ↓
2. useEffect() déclenche
   ↓
3. GET /api/{resource}?page=0&size=10
   ↓
4. Réponse: { content: [...], totalPages: 5, ... }
   ↓
5. setState(data)
   ↓
6. Rendu tableau
   ↓
7. Boutons pagination
   ↓
8. Au clic: loadPage(n)
   ↓
9. GET /api/{resource}?page=n&size=10
   ↓
10. Mise à jour tableau
```

### Pages CRUD
```
PatientsPage, StaffPage, AppointmentsPage, ConsultationsPage, UsersPage

Créer:
1. Remplir formulaire
2. Submit → handleSubmit()
3. POST /api/{resource}
4. Réinitialiser formulaire
5. loadData() pour rafraîchir
6. Message succès

Modifier:
1. Changement dropdown/input
2. onChange → setState()
3. Appel API (PUT/PATCH)
4. Rafraîchissement
5. Message succès

Supprimer:
1. Clic bouton Supprimer
2. Confirmation("Êtes-vous sûr?")
3. DELETE /api/{resource}/{id}
4. loadData() pour rafraîchir
5. Message succès
```

### MedicalRecordsPage (Recherche)
```
1. Input patientId
2. Clic "Rechercher"
3. GET /api/medical-records/patient/{id}
4. Response: { id, patientId, entries: [...] }
5. Affichage dossier
6. Formulaire ajout entrée visible
7. Soumission → POST .../entries
8. Table entrées mise à jour
9. Suppression → DELETE .../entries/{id}
```

## 🔗 Dépendances Entre Pages

```
Dashboard
├── Affiche statistiques
└── Lien vers pages détail

PatientsPage
└── Indépendante

StaffPage
└── Indépendante

AppointmentsPage
├── Référence patientId
└── Référence staffId

ConsultationsPage
├── Référence patientId
└── Référence doctorId

MedicalRecordsPage
├── Recherche patientId
└── Gère ses entrées

UsersPage
├── Attribution rôles
└── Activation/Désactivation
```

## ✅ Checklist Implémentation

### Chaque page inclut:
- [x] Composant React
- [x] Service API
- [x] Formulaire (si CRUD)
- [x] Liste paginée
- [x] Gestion d'erreurs
- [x] Messages utilisateur
- [x] Navigation
- [x] Types TypeScript
- [x] Styles CSS
- [x] Responsive design

### Architecture Consistante:
- [x] useState pour état local
- [x] useEffect pour fetch
- [x] Pagination 10 éléments
- [x] Boutons CRUD standards
- [x] Messages d'erreur rouges
- [x] Messages de succès
- [x] Loading states
- [x] Confirmation avant suppression

## 📞 Ajout Nouvelle Page

Pour ajouter une nouvelle page:

1. Créer `src/pages/NewPage.tsx`
2. Créer `src/api/newService.ts` (si besoin)
3. Ajouter route dans `App.tsx`:
   ```typescript
   <Route path="/new" element={<RequireAuth><NewPage /></RequireAuth>} />
   ```
4. Ajouter lien dans `Layout.tsx`
5. Suivre le pattern établi

Template minimal:
```typescript
export const NewPage = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Fetch initial data
  }, []);
  
  return (
    <div>
      <h1>Nouvelle Page</h1>
      {/* Contenu */}
    </div>
  );
};
```

---

**Version**: 1.0
**Mis à jour**: 2026-03-01
**Status**: Complet ✅
