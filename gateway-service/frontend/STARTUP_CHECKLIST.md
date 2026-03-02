# Checklist de Démarrage - Hospital Kit Frontend

## Avant de Démarrer

- [ ] Node.js 16+ installé (vérifier: `node --version`)
- [ ] npm ou pnpm installé (vérifier: `npm --version`)
- [ ] Clé SSH/GitHub configurée si clonage depuis Git
- [ ] Port 5173 disponible (ou à configurer dans vite.config.ts)

## Installation

```bash
cd frontend
npm install  # ou pnpm install
```

- [ ] Installation réussie (aucune erreur rouge)
- [ ] dossier node_modules/ créé

## Configuration

### .env.local (optionnel)
```bash
# Copier depuis .env.example
cp .env.example .env.local

# Éditer si besoin:
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ML2_API_URL=http://localhost:8085
```

- [ ] Fichier créé ou existant

## Démarrage

```bash
npm run dev
```

- [ ] Serveur démarre sans erreurs
- [ ] Message: "Local: http://localhost:5173"
- [ ] Pas d'erreurs dans la console du terminal

## Test dans le Navigateur

1. [ ] Ouvrir http://localhost:5173
2. [ ] Ouvrir DevTools (F12)
3. [ ] Aller à "Console"
4. [ ] Recharger la page (F5)

### Logs Attendus (dans cet ordre)
```
[v0] main.tsx: initializing app
[v0] Root element found, mounting app
[v0] AuthProvider init - saved: not found
[v0] App component rendering
[v0] Layout rendering: { isAuthenticated: false, path: "/" }
[v0] RequireAuth check: { isAuthenticated: false, path: "/" }
[v0] RequireAuth: redirecting to /login from /
[v0] Layout rendering: { isAuthenticated: false, path: "/login" }
```

- [ ] Tous les logs visibles dans la console

### Page Affichée
- [ ] Vous devriez voir une page de **Connexion**
- [ ] Avec un formulaire (Nom d'utilisateur + Mot de passe)
- [ ] Un lien "Créer un compte"

## Test de Connexion

### Test Local (sans backend)
1. Entrez n'importe quel username/password
2. Cliquez "Se connecter"
3. Attendez une erreur (normal, pas de backend)

### Test avec Backend
1. Assurez-vous que le backend Java tourne sur http://localhost:8080
2. Entrez des identifiants valides
3. Cliquez "Se connecter"
4. Vous devriez être redirigé vers le **Tableau de Bord**

- [ ] Connexion réussie (si backend disponible)
- [ ] Dashboard affiché avec les statistiques

## Dépannage Rapide

| Problème | Solution |
|----------|----------|
| Rien n'apparaît | Ouvrir F12 Console, chercher erreurs rouges |
| "Cannot GET /" | Vérifier que npm run dev est exécuté |
| Port 5173 occupé | Utiliser `npm run dev -- --port 3000` |
| Erreurs CORS | Vérifier que backend tourne sur :8080 |
| Login ne fonctionne pas | Vérifier l'endpoint `/auth/login` en Backend |
| ML2 ne répond pas | Vérifier que le serveur ML2 tourne sur :8085 |

## Après Débogage

Une fois que tout fonctionne, **supprimer les logs de débogage**:

```bash
# Chercher et remplacer:
# Pattern: console.log("[v0] ...)
# Remplacer par: (rien)
```

Fichiers concernés:
- main.tsx
- App.tsx
- auth/AuthContext.tsx
- auth/RequireAuth.tsx
- components/Layout.tsx

## Prochaines Étapes

1. Tester toutes les pages du frontend
2. Tester l'intégration avec le backend
3. Tester la page ML2 de prédiction cardiaque
4. Corriger les erreurs restantes

## Aide

- Erreurs complètes? Consulter: `DEBUGGING_GUIDE.md`
- Problèmes API? Consulter: `FRONTEND_CORRECTIONS.md`
- Guide complet? Consulter: `frontend/README.md`
