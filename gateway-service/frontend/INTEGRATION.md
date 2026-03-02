# Guide d'Intégration Frontend - Backend

## 📡 Configuration API

### Développement

Le proxy Vite redirige automatiquement les requêtes `/api/*` vers le backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true
    }
  }
}
```

**En développement**:
- Frontend: `http://localhost:5173`
- API calls: `/api/*` → `http://localhost:8080/api/*`

### Production

Dans `src/api/client.ts`, le URL de base est `/api`:

```typescript
export const apiClient = axios.create({
  baseURL: "/api"
});
```

**Recommandations pour la production**:

1. **Option 1: Même domaine (Recommandé)**
   - Déployer le frontend et backend sur le même domaine
   - Utiliser un reverse proxy (Nginx, Apache)
   - Configuration simple, pas de CORS

2. **Option 2: Domaines séparés**
   - Configurer CORS côté backend
   - Mettre à jour le baseURL du client
   - Modifier `src/api/client.ts`:
   ```typescript
   export const apiClient = axios.create({
     baseURL: process.env.VITE_API_URL || "https://api.example.com"
   });
   ```

3. **Option 3: Docker Compose**
   - Services sur ports différents
   - Proxy dans docker-compose.yml

## 🔄 Flux de Requête API

```
┌─────────────────┐
│   React Page    │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────┐
│   Service API (api/*.ts)    │
├─────────────────────────────┤
│ - appointmentsApi.getAll()  │
│ - staffApi.create()         │
│ - usersApi.update()         │
└────────┬────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│   Axios Client (client.ts)      │
├─────────────────────────────────┤
│ - Intercepteur requête (token)  │
│ - Intercepteur réponse (401)    │
└────────┬────────────────────────┘
         │
         ↓
    ┌─────────────────────────┐
    │  API Gateway / Vite Proxy│
    │  (http://localhost:8080)│
    └────────┬────────────────┘
             │
             ↓
    ┌──────────────────────────────────────────┐
    │        Microservices Spring Boot        │
    ├──────────────────────────────────────────┤
    │ - patient-service (8001)                │
    │ - staff-service (8002)                  │
    │ - appointment-service (8003)            │
    │ - consultations-service (8004)          │
    │ - medical-record-service (8005)         │
    │ - users-service (8006)                  │
    │ - auth-service (8007)                   │
    └──────────────────────────────────────────┘
```

## 🛡️ Authentification

### Intercepteur de Requête

Tous les tokens sont automatiquement ajoutés:

```typescript
// src/api/client.ts
apiClient.interceptors.request.use((config) => {
  const authState = localStorage.getItem("auth_state");
  if (authState) {
    const { token } = JSON.parse(authState);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

Résultat: Chaque requête inclut automatiquement:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Gestion des Erreurs 401

Si une réponse retourne 401 (Unauthorized):

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_state");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

Actions automatiques:
1. Suppression du token en local
2. Redirection vers `/login`
3. Utilisateur doit se reconnecter

## 📡 Format des Réponses Attendues

### Réponse de Pagination

```json
{
  "content": [...],
  "totalElements": 50,
  "totalPages": 5,
  "currentPage": 0,
  "pageNumber": 0,
  "pageSize": 10
}
```

### Réponse d'Authentification

```json
{
  "accessToken": "eyJ...",
  "username": "user@example.com",
  "roles": ["ROLE_ADMIN", "ROLE_USER"]
}
```

### Format d'Erreur

Erreur standard HTTP:
```json
{
  "status": 400,
  "message": "Validation error",
  "errors": [...]
}
```

## 🔌 Endpoints Matrice

| Service | Method | Endpoint | Page |
|---------|--------|----------|------|
| Patients | GET | /api/patients | PatientsPage ✅ |
| Patients | POST | /api/patients | PatientsPage ✅ |
| Staff | GET | /api/staff | StaffPage ✅ |
| Staff | POST | /api/staff | StaffPage ✅ |
| Appointments | GET | /api/appointments | AppointmentsPage ✅ |
| Appointments | POST | /api/appointments | AppointmentsPage ✅ |
| Consultations | GET | /api/consultations | ConsultationsPage ✅ |
| Consultations | POST | /api/consultations | ConsultationsPage ✅ |
| Medical Records | GET | /api/medical-records | MedicalRecordsPage ✅ |
| Medical Records | POST | /api/medical-records/patient/{id}/entries | MedicalRecordsPage ✅ |
| Users | GET | /api/users | UsersPage ✅ |
| Users | POST | /api/users | UsersPage ✅ |
| Auth | POST | /api/auth/login | LoginPage ✅ |
| Auth | POST | /api/auth/register | RegisterPage ✅ |

**Tous les endpoints sont intégrés! ✅**

## 🚀 Déploiement

### Docker + Nginx (Recommandé)

```dockerfile
# Dockerfile pour le frontend
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Frontend static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://api-gateway:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔍 Débogage

### Vérifier les Requêtes API

1. **Ouvrir DevTools** (F12)
2. **Onglet Network**
3. Rechercher les requêtes `/api`
4. Vérifier:
   - Status code (200, 401, 404, 500)
   - Headers (Authorization, Content-Type)
   - Response body

### Logs Console

```typescript
// Dans src/api/client.ts, ajouter:
apiClient.interceptors.request.use((config) => {
  console.log("[API]", config.method?.toUpperCase(), config.url);
  return config;
});
```

### Mock API pour Développement

Pour tester sans backend:

```typescript
// src/api/client.ts - Mode développement
if (import.meta.env.MODE === 'mock') {
  apiClient.get = async (url) => {
    return { data: { content: [], totalElements: 0 } };
  };
}
```

## ✅ Checklist d'Intégration

- [x] Client Axios configuré
- [x] Intercepteurs d'authentification
- [x] Services API pour tous les microservices
- [x] Gestion des erreurs 401
- [x] Pagination implémentée
- [x] Proxy de développement
- [x] Support CORS (si nécessaire)
- [x] Documentation des endpoints
- [x] Types TypeScript pour les réponses
- [x] Affichage des erreurs utilisateur

## 📞 Troubleshooting

### "Cannot GET /api"
- Gateway n'est pas en cours d'exécution
- Vérifier port 8080
- Vérifier proxy dans vite.config.ts

### "401 Unauthorized"
- Token expiré
- Token invalide
- Session expirée
- Utilisateur désactivé

### CORS Errors
- Ajouter headers CORS au backend
- Ou utiliser même domaine pour déploiement

### "Network Error"
- Firewall bloquant
- Service indisponible
- Problème de connectivité
