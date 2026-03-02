# Frontend - Hospital Kit

Application React + Vite permettant de gérer les microservices de gestion hospitalière.

## Structure du Projet

```
src/
├── api/                    # Services API pour chaque microservice
│   ├── appointments.ts     # Service Appointment Service
│   ├── client.ts           # Client Axios configuré avec authentification
│   ├── consultations.ts    # Service Consultations Service
│   ├── medicalRecords.ts   # Service Medical Record Service
│   ├── patients.ts         # Service Patient Service
│   ├── staff.ts            # Service Staff Service
│   └── users.ts            # Service Users Service
├── auth/                   # Gestion de l'authentification
│   ├── AuthContext.tsx     # Contexte React pour l'auth (état global)
│   ├── RequireAuth.tsx     # Composant wrapper pour les routes protégées
│   └── RequireRole.tsx     # Composant pour la vérification des rôles
├── components/
│   └── Layout.tsx          # Layout principal (sidebar + contenu)
├── pages/                  # Pages de l'application
│   ├── Dashboard.tsx       # Tableau de bord
│   ├── PatientsPage.tsx    # Gestion des patients
│   ├── StaffPage.tsx       # Gestion du personnel
│   ├── AppointmentsPage.tsx # Gestion des rendez-vous
│   ├── ConsultationsPage.tsx # Historique des consultations
│   ├── MedicalRecordsPage.tsx # Dossiers médicaux
│   ├── UsersPage.tsx       # Gestion des utilisateurs
│   ├── LoginPage.tsx       # Connexion
│   └── RegisterPage.tsx    # Inscription
├── App.tsx                 # Routes principales
├── main.tsx                # Point d'entrée
└── styles.css              # Styles globaux
```

## Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build pour la production
npm run build
```

## Authentification

- **Stockage**: JWT token stocké en localStorage via `AuthContext`
- **Intercepteurs**: Tous les appels API incluent automatiquement le token Bearer
- **Timeout**: Redirection automatique vers /login si réponse 401
- **Protection**: Routes protégées via composant `RequireAuth`

## Microservices Disponibles

### 1. **Patients** (`/api/patients`)
- **Endpoints**:
  - `GET /patients?page=0&size=10` - Liste des patients
  - `POST /patients` - Créer un patient
  - `GET /patients/{id}` - Détail d'un patient
  - `PUT /patients/{id}` - Modifier un patient
  - `DELETE /patients/{id}` - Supprimer un patient

### 2. **Staff** (`/api/staff`)
- **Endpoints**:
  - `GET /staff?page=0&size=10` - Liste du personnel
  - `POST /staff` - Ajouter un staff
  - `GET /staff/{id}` - Détail d'un staff
  - `PUT /staff/{id}` - Modifier un staff
  - `DELETE /staff/{id}` - Supprimer un staff
  - `GET /staff/specialty/{specialty}` - Filtrer par spécialité

### 3. **Appointments** (`/api/appointments`)
- **Endpoints**:
  - `GET /appointments?page=0&size=10` - Liste des rendez-vous
  - `POST /appointments` - Créer un rendez-vous
  - `GET /appointments/{id}` - Détail d'un rendez-vous
  - `PUT /appointments/{id}` - Modifier un rendez-vous
  - `DELETE /appointments/{id}` - Supprimer un rendez-vous
  - `PATCH /appointments/{id}/status` - Modifier le statut

### 4. **Consultations** (`/api/consultations`)
- **Endpoints**:
  - `GET /consultations?page=0&size=10` - Liste des consultations
  - `POST /consultations` - Créer une consultation
  - `GET /consultations/{id}` - Détail d'une consultation
  - `PUT /consultations/{id}` - Modifier une consultation
  - `DELETE /consultations/{id}` - Supprimer une consultation
  - `GET /consultations/patient/{patientId}` - Consultations d'un patient

### 5. **Medical Records** (`/api/medical-records`)
- **Endpoints**:
  - `GET /medical-records?page=0&size=10` - Liste des dossiers
  - `GET /medical-records/patient/{patientId}` - Dossier d'un patient
  - `POST /medical-records/patient/{patientId}/entries` - Ajouter une entrée
  - `DELETE /medical-records/{recordId}/entries/{entryId}` - Supprimer une entrée

### 6. **Users** (`/api/users`)
- **Endpoints**:
  - `GET /users?page=0&size=10` - Liste des utilisateurs
  - `POST /users` - Créer un utilisateur
  - `GET /users/{id}` - Détail d'un utilisateur
  - `PUT /users/{id}` - Modifier un utilisateur
  - `DELETE /users/{id}` - Supprimer un utilisateur
  - `POST /users/{id}/roles` - Attribuer des rôles
  - `PATCH /users/{id}/activate` - Activer un utilisateur
  - `PATCH /users/{id}/deactivate` - Désactiver un utilisateur

### 7. **Auth** (`/api/auth`)
- **Endpoints**:
  - `POST /auth/login` - Connexion
  - `POST /auth/register` - Inscription

## Flux d'Authentification

1. **Inscription** (RegisterPage)
   - Appel à `POST /auth/register`
   - Création du compte utilisateur

2. **Connexion** (LoginPage)
   - Appel à `POST /auth/login`
   - Stockage du token JWT et des infos utilisateur
   - Redirection vers le dashboard

3. **Accès aux Ressources**
   - Chaque requête inclut le header `Authorization: Bearer {token}`
   - Le client intercepte automatiquement les erreurs 401

4. **Déconnexion** (Layout)
   - Suppression du token et des infos utilisateur
   - Redirection vers `/login`

## Menu Latéral

Le menu n'apparaît que si l'utilisateur est authentifié:
- **Avant connexion**: Pas de menu
- **Après connexion**: Menu complet avec tous les liens de navigation

Structure du menu:
- 🏠 Tableau de bord
- 👥 Patients
- 👨‍⚕️ Personnel
- 📅 Rendez-vous
- 💬 Consultations
- 📋 Dossiers médicaux
- 👤 Utilisateurs

## Styles et Design

- **Couleur primaire**: Bleu (#2563eb)
- **Couleur d'erreur**: Rouge (#b91c1c)
- **Couleur de réussite**: Vert (#15803d)
- **Mise en page**: Flexbox pour la structure principale, Grid pour les listes
- **Responsive**: Adapté pour les écrans de différentes tailles

## Variables d'Environnement

Créer un fichier `.env` si nécessaire:
```
VITE_API_URL=/api
```

## Technologies

- **Framework**: React 18.2
- **Bundler**: Vite 5
- **HTTP Client**: Axios
- **Routing**: React Router DOM 6
- **Langage**: TypeScript 5

## Notes

- Toutes les dates sont formatées en format français (DD/MM/YYYY)
- Les UUIDs sont tronqués à 8 caractères dans les tableaux
- Pagination: 10 éléments par page par défaut
- Gestion d'erreur centralisée via intercepteurs Axios
