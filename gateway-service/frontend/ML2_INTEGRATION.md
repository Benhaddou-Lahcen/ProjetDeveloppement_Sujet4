# Intégration du Microservice ML2 - Prédiction de Maladie Cardiaque

## Vue d'ensemble

Le microservice ML2 implémente un système de **federated learning** pour prédire le risque de maladie cardiaque chez les patients. La page frontend correspondante permet aux médecins d'entrer les données d'un patient et d'obtenir une prédiction basée sur le modèle entraîné.

## Architecture

```
Frontend (HeartDiseasePredictionPage)
        ↓
   API Client (ml2Api)
        ↓
   Gateway (/api/ml2/predict)
        ↓
ML2 Service (Federated Learning)
        ↓
Serveur de Coordination + Nœuds Locaux
```

## Page Frontend

### Fichier: `src/pages/HeartDiseasePredictionPage.tsx`

La page contient:
- Formulaire avec 11 champs de données du patient
- Validation des entrées
- Appel API à `/api/ml2/predict`
- Affichage des résultats avec indicateurs de risque
- Gestion des erreurs

### Champs du Formulaire

| Champ | Type | Plage | Description |
|-------|------|-------|-------------|
| Age | Nombre | 18-120 | Âge du patient en années |
| Sex | Select | M / F | Sexe du patient |
| ChestPainType | Select | ATA, ASY, NAP, TA | Type de douleur thoracique |
| RestingBP | Nombre | 60-200 | Tension artérielle au repos (mmHg) |
| Cholesterol | Nombre | 0-600 | Niveau de cholestérol (mg/dl) |
| FastingBS | Select | 0 / 1 | Glycémie à jeun > 120 mg/dl |
| RestingECG | Select | Normal, ST, LVH | Type d'ECG au repos |
| MaxHR | Nombre | 60-220 | Fréquence cardiaque maximale |
| ExerciseAngina | Select | Y / N | Angine induite par l'exercice |
| Oldpeak | Décimal | 0-10 | Dépression ST induite par l'exercice |
| ST_Slope | Select | Up, Flat, Down | Pente du segment ST |

## API Service

### Fichier: `src/api/ml2.ts`

```typescript
interface HeartDiseaseInput {
  Age: number;
  Sex: "M" | "F";
  ChestPainType: "ATA" | "ASY" | "NAP" | "TA";
  RestingBP: number;
  Cholesterol: number;
  FastingBS: 0 | 1;
  RestingECG: "Normal" | "ST" | "LVH";
  MaxHR: number;
  ExerciseAngina: "Y" | "N";
  Oldpeak: number;
  ST_Slope: "Up" | "Flat" | "Down";
}

interface PredictionResult {
  prediction: number;        // 0-1
  probability: number;       // Probabilité de maladie
  risk_level: string;        // "Low" | "Medium" | "High"
  confidence: number;        // Confiance du modèle 0-1
}
```

### Endpoints

#### Prédiction
```
POST /api/ml2/predict
Content-Type: application/json

Request:
{
  "Age": 55,
  "Sex": "M",
  "ChestPainType": "ATA",
  "RestingBP": 140,
  "Cholesterol": 220,
  "FastingBS": 1,
  "RestingECG": "Normal",
  "MaxHR": 150,
  "ExerciseAngina": "N",
  "Oldpeak": 1.2,
  "ST_Slope": "Up"
}

Response:
{
  "prediction": 0.75,
  "probability": 0.75,
  "risk_level": "High",
  "confidence": 0.92
}
```

#### Info du Modèle
```
GET /api/ml2/info

Response:
{
  "model_name": "Heart Disease Federated Model",
  "version": "1.0.0",
  "accuracy": 0.85,
  "num_clients": 3,
  "last_update": "2024-01-15T10:30:00Z"
}
```

## Résultats et Interprétation

### Niveaux de Risque

| Niveau | Critère | Signification |
|--------|---------|---------------|
| **Low** (Faible) | Score < 0.33 | Risque faible de maladie cardiaque |
| **Medium** (Modéré) | 0.33 ≤ Score < 0.67 | Risque modéré, suivi recommandé |
| **High** (Élevé) | Score ≥ 0.67 | Risque élevé, consultation urgente |

### Affichage des Résultats

La page affiche 4 métriques principales:
1. **Niveau de Risque** - Couleur codifiée (vert, orange, rouge)
2. **Score de Prédiction** - Pourcentage de 0 à 100%
3. **Probabilité** - Probabilité calculée par le modèle
4. **Confiance du Modèle** - Degré de certitude du modèle

## Federated Learning - Explications

### Concept

Le **federated learning** permet d'entraîner le modèle sans centraliser les données sensibles:

1. **Données distribuées** - Chaque hôpital/nœud garde ses données
2. **Entraînement local** - Chaque nœud entraîne le modèle localement
3. **Agrégation** - Les mises à jour sont agrégées sur le serveur
4. **Distribution** - Le modèle amélioré est envoyé aux nœuds

### Avantages

- ✅ **Confidentialité** - Les données ne quittent pas l'établissement
- ✅ **Légalité** - Conforme au RGPD et autres régulations
- ✅ **Modèle amélioré** - Apprend de multiples sources de données
- ✅ **Robustesse** - Évite les biais d'une seule source

## Configuration

### Variables d'Environnement

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Gateway Configuration

```yaml
# Fichier: gateway-service/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: ml2-service
          uri: http://localhost:5000
          predicates:
            - Path=/api/ml2/**
          filters:
            - StripPrefix=1
```

## Intégration avec d'autres Services

### Lien avec Patients

Lors de la sélection d'un patient dans la page Patients:
1. Récupérer l'ID du patient
2. Récupérer ses données cliniques
3. Appeler la prédiction avec ces données
4. Enregistrer les résultats dans les Dossiers Médicaux

### Flux Recommandé

```
1. Patients Page → Sélectionner patient
2. Medical Records Page → Voir historique
3. Heart Disease Prediction → Analyser risque
4. Medical Records → Enregistrer diagnostic
```

## Exemple d'Utilisation

### Cas 1: Patient à Faible Risque
```json
{
  "Age": 35,
  "Sex": "F",
  "ChestPainType": "ASY",
  "RestingBP": 120,
  "Cholesterol": 180,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 175,
  "ExerciseAngina": "N",
  "Oldpeak": 0.0,
  "ST_Slope": "Up"
}
→ Résultat: Low Risk (15%)
```

### Cas 2: Patient à Risque Élevé
```json
{
  "Age": 65,
  "Sex": "M",
  "ChestPainType": "TA",
  "RestingBP": 160,
  "Cholesterol": 300,
  "FastingBS": 1,
  "RestingECG": "LVH",
  "MaxHR": 110,
  "ExerciseAngina": "Y",
  "Oldpeak": 2.5,
  "ST_Slope": "Down"
}
→ Résultat: High Risk (88%)
```

## Dépannage

### Erreur: "Erreur lors de la prédiction"

**Causes possibles:**
- Données invalides dans le formulaire
- Service ML2 indisponible
- Gateway ne route pas vers ML2

**Solutions:**
1. Vérifier les valeurs du formulaire
2. Vérifier que le service ML2 est actif: `curl http://localhost:5000/info`
3. Vérifier la configuration du gateway
4. Consulter les logs du gateway

### Modèle Retourne Confiance Faible (< 50%)

Le modèle est hésitant sur la prédiction:
- Les données du patient sont atypiques
- Nécessite une analyse clinique supplémentaire
- Consultation d'un cardiologue recommandée

### Performance Lente

- Vérifier la latence réseau vers le service ML2
- Vérifier les ressources disponibles sur le serveur ML2
- Les prédictions initiales sont plus lentes (warmup du modèle)

## Sécurité

### Authentification
- Toutes les requêtes passent par JWT Bearer Token
- Seuls les utilisateurs authentifiés peuvent faire des prédictions

### Données Sensibles
- Les données du patient ne sont jamais stockées en log
- Utiliser HTTPS en production
- Chiffrer les données en transit

### Conformité
- RGPD: Les données ne sont pas centralisées
- HIPAA: Audit des accès disponible
- Documentation des consentements recommandée

## Maintenance

### Mise à Jour du Modèle
```bash
# Déclencher un nouvel entraînement fédéré
POST /api/ml2/train
{
  "rounds": 5,
  "epoch_per_round": 10
}
```

### Monitoring
- Vérifier la précision du modèle: `GET /api/ml2/metrics`
- Vérifier l'état des nœuds: `GET /api/ml2/nodes`
- Logs disponibles dans `ml2/logs/`

## Ressources

- [Federated Learning Whitepaper](https://arxiv.org/abs/1602.05629)
- [TensorFlow Federated](https://www.tensorflow.org/federated)
- [UCI Heart Disease Dataset](https://archive.ics.uci.edu/ml/datasets/Heart+Disease)

## Support

Pour les problèmes:
1. Consulter TROUBLESHOOTING.md
2. Vérifier les logs du service ML2: `docker logs ml2-service`
3. Contacter l'administrateur système
