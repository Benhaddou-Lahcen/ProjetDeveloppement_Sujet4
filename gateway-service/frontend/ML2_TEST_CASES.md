# ML2 Service - Cas de Test

## Prérequis
- Service ML2 actif sur `http://localhost:5000`
- Gateway configuré pour router `/api/ml2/*`
- Utilisateur authentifié avec token JWT

## Test 1: Patient Jeune Asymptomatique (Faible Risque)

**Données d'entrée:**
```json
{
  "Age": 28,
  "Sex": "F",
  "ChestPainType": "ASY",
  "RestingBP": 110,
  "Cholesterol": 160,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 185,
  "ExerciseAngina": "N",
  "Oldpeak": 0.0,
  "ST_Slope": "Up"
}
```

**Résultat attendu:**
- Risk Level: **Low**
- Prediction: **< 0.30**
- Probabilité: **< 30%**
- Confiance: **> 85%**

**Interprétation:**
Patiente jeune sans facteurs de risque évidents. Pas de suivi spécifique recommandé.

---

## Test 2: Patient Moyen Âge avec Facteurs de Risque (Risque Modéré)

**Données d'entrée:**
```json
{
  "Age": 48,
  "Sex": "M",
  "ChestPainType": "ATA",
  "RestingBP": 135,
  "Cholesterol": 240,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 155,
  "ExerciseAngina": "Y",
  "Oldpeak": 0.8,
  "ST_Slope": "Flat"
}
```

**Résultat attendu:**
- Risk Level: **Medium**
- Prediction: **0.40 à 0.60**
- Probabilité: **40-60%**
- Confiance: **75-85%**

**Interprétation:**
Patient avec plusieurs facteurs de risque modérés. Suivi cardiaque recommandé, tests supplémentaires suggérés.

---

## Test 3: Patient Âgé avec Facteurs de Risque Sévères (Risque Élevé)

**Données d'entrée (Exemple 1 - Typical Angina):**
```json
{
  "Age": 65,
  "Sex": "M",
  "ChestPainType": "TA",
  "RestingBP": 160,
  "Cholesterol": 300,
  "FastingBS": 1,
  "RestingECG": "LVH",
  "MaxHR": 100,
  "ExerciseAngina": "Y",
  "Oldpeak": 2.5,
  "ST_Slope": "Down"
}
```

**Résultat attendu:**
- Risk Level: **High**
- Prediction: **> 0.75**
- Probabilité: **> 75%**
- Confiance: **> 85%**

**Interprétation:**
Patient à risque très élevé. Consultation cardiologique urgente recommandée.

---

## Test 4: Patient Âgé avec Symptômes Asymptomatiques (Résultat Intéressant)

**Données d'entrée:**
```json
{
  "Age": 70,
  "Sex": "F",
  "ChestPainType": "ASY",
  "RestingBP": 140,
  "Cholesterol": 250,
  "FastingBS": 1,
  "RestingECG": "ST",
  "MaxHR": 120,
  "ExerciseAngina": "N",
  "Oldpeak": 1.5,
  "ST_Slope": "Flat"
}
```

**Résultat attendu:**
- Risk Level: **High** (malgré l'absence de symptômes)
- Prediction: **0.65 à 0.80**
- Probabilité: **65-80%**
- Confiance: **70-80%**

**Interprétation:**
Cas intéressant: patiente asymptomatique mais avec tous les facteurs de risque objectifs. Démontre l'importance du dépistage précoce même sans symptômes.

---

## Test 5: Patient avec ECG Anormal (LVH)

**Données d'entrée:**
```json
{
  "Age": 55,
  "Sex": "M",
  "ChestPainType": "NAP",
  "RestingBP": 150,
  "Cholesterol": 280,
  "FastingBS": 1,
  "RestingECG": "LVH",
  "MaxHR": 130,
  "ExerciseAngina": "Y",
  "Oldpeak": 1.8,
  "ST_Slope": "Down"
}
```

**Résultat attendu:**
- Risk Level: **High**
- Prediction: **0.70 à 0.85**
- Probabilité: **70-85%**
- Confiance: **80-88%**

**Interprétation:**
L'hypertrophie ventriculaire gauche est un fort prédicteur. Suivi régulier essentiel.

---

## Test 6: Patient Borderline (Test de Confiance Basse)

**Données d'entrée:**
```json
{
  "Age": 50,
  "Sex": "M",
  "ChestPainType": "ATA",
  "RestingBP": 128,
  "Cholesterol": 200,
  "FastingBS": 0,
  "RestingECG": "ST",
  "MaxHR": 150,
  "ExerciseAngina": "N",
  "Oldpeak": 0.5,
  "ST_Slope": "Up"
}
```

**Résultat attendu:**
- Risk Level: **Medium**
- Prediction: **0.45 à 0.55** (Borderline)
- Probabilité: **45-55%**
- Confiance: **50-65%** (Basse)

**Interprétation:**
Cas limite où le modèle hésite. Recommande consultation clinique supplémentaire pour clarifier le diagnostic.

---

## Tests de Validation des Entrées

### Test 7: Âge Invalide
```json
{
  "Age": 150,  // Trop élevé
  ...
}
```
**Résultat attendu:** Erreur de validation

### Test 8: Cholestérol Invalide
```json
{
  "Cholesterol": -50,  // Négatif
  ...
}
```
**Résultat attendu:** Erreur de validation

### Test 9: Sex Invalide
```json
{
  "Sex": "X",  // Doit être M ou F
  ...
}
```
**Résultat attendu:** Erreur de validation

### Test 10: ChestPainType Invalide
```json
{
  "ChestPainType": "INVALID",  // Doit être ATA, ASY, NAP ou TA
  ...
}
```
**Résultat attendu:** Erreur de validation

---

## Tests de Performance

### Test de Latence
**Commande:**
```bash
time curl -X POST http://localhost:8080/api/ml2/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @test_case_1.json
```

**Résultat attendu:**
- Temps de réponse: < 500ms
- Plus rapide après premier appel (cache)

### Test de Concurrence
**Faire 10 requêtes simultanées:**
```bash
for i in {1..10}; do
  curl -X POST http://localhost:8080/api/ml2/predict \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d @test_case_1.json &
done
wait
```

**Résultat attendu:**
- Toutes les requêtes réussissent
- Pas de timeout
- Réponses cohérentes

---

## Tests d'Erreurs

### Test 401: Sans Token
```bash
curl -X POST http://localhost:8080/api/ml2/predict \
  -H "Content-Type: application/json" \
  -d @test_case_1.json
```
**Résultat attendu:** Erreur 401 Unauthorized

### Test 500: Service Indisponible
**Action:** Arrêter le service ML2
```bash
docker stop ml2-service
```

**Résultat attendu:** Erreur 503 Service Unavailable

### Test 400: Données Invalides
```bash
curl -X POST http://localhost:8080/api/ml2/predict \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```
**Résultat attendu:** Erreur 400 Bad Request

---

## Données de Benchmark (UCI Heart Disease Dataset)

### Statistiques du Dataset
- Total patients: 303
- Cas positifs (maladie): 138 (45.5%)
- Cas négatifs: 165 (54.5%)
- Âge moyen: 53.5 ans
- Accuracy du modèle: ~85%

### Distribution par Âge
- 29-39 ans: 10 patients
- 40-49 ans: 51 patients
- 50-59 ans: 102 patients
- 60-69 ans: 99 patients
- 70+ ans: 41 patients

### Distribution par Sexe
- Hommes: 206 (68%)
- Femmes: 97 (32%)

---

## Interprétation des Résultats

### Confiance Modèle

| Plage | Interprétation |
|-------|----------------|
| > 90% | Prédiction très fiable |
| 80-90% | Prédiction fiable |
| 70-80% | Prédiction acceptée, suivi recommandé |
| 50-70% | Cas limite, consultation advisée |
| < 50% | Modèle hésitant, diagnostic clinique essentiel |

### Scores de Prédiction

| Score | Risque | Action |
|-------|--------|--------|
| 0.0-0.20 | Très faible | Prévention standard |
| 0.20-0.33 | Faible | Prévention rendue |
| 0.33-0.50 | Modéré bas | Suivi annuel |
| 0.50-0.67 | Modéré haut | Suivi 6 mois |
| 0.67-0.80 | Élevé | Suivi 3 mois + tests |
| 0.80-1.00 | Très élevé | Consultation urgente |

---

## Exécution Automatique des Tests

**Script Python pour tous les tests:**

```python
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8080/api/ml2"
TOKEN = "YOUR_JWT_TOKEN"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

test_cases = [
    # Test 1, Test 2, etc...
]

results = []
for i, test_case in enumerate(test_cases, 1):
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            headers=HEADERS,
            json=test_case["data"],
            timeout=5
        )
        results.append({
            "test": f"Test {i}",
            "status": response.status_code,
            "result": response.json(),
            "time": datetime.now().isoformat()
        })
        print(f"✓ Test {i} passed: {response.json()['risk_level']}")
    except Exception as e:
        results.append({
            "test": f"Test {i}",
            "status": "ERROR",
            "error": str(e)
        })
        print(f"✗ Test {i} failed: {e}")

# Sauvegarder les résultats
with open("test_results.json", "w") as f:
    json.dump(results, f, indent=2)
```

---

## Rapport de Test Recommandé

Générer un rapport après chaque déploiement:

```markdown
# Test Report - ML2 Service
- Date: YYYY-MM-DD
- Version: X.Y.Z
- Status: PASS/FAIL

## Results Summary
- Total Tests: 10
- Passed: 9
- Failed: 1
- Skipped: 0

## Performance
- Avg Latency: 150ms
- P95 Latency: 250ms
- P99 Latency: 400ms

## Coverage
- Accuracy: 85%
- Precision: 87%
- Recall: 82%
- F1-Score: 0.84
```
