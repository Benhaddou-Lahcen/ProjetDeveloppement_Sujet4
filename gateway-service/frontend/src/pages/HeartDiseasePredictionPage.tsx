import { useState } from "react";
import { ml2Api, HeartDiseaseInput, PredictionResponse } from "../api/ml2";

export const HeartDiseasePredictionPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const [form, setForm] = useState<HeartDiseaseInput>({
    Age: 55,
    Sex: "M",
    ChestPainType: "ATA",
    RestingBP: 140,
    Cholesterol: 220,
    FastingBS: 1,
    RestingECG: "Normal",
    MaxHR: 150,
    ExerciseAngina: "N",
    Oldpeak: 1.2,
    ST_Slope: "Up"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : 
              type === "checkbox" ? (e.target as HTMLInputElement).checked ? 1 : 0 : 
              (value as any)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await ml2Api.predictHeartDisease(form);
      setResult(response);
    } catch (e: any) {
      const errorMsg = e?.response?.data?.detail || "Erreur lors de la prédiction. Veuillez vérifier les données.";
      setError(errorMsg);
      console.error("[v0] ML2 Prediction Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (isSick: boolean) => {
    return isSick ? "#dc3545" : "#28a745";
  };

  const getRiskLabel = (isSick: boolean) => {
    return isSick ? "Présence possible de maladie cardiaque" : "Faible risque de maladie cardiaque";
  };

  return (
    <div>
      <h1>Prédiction de Maladie Cardiaque</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Système de prédiction basé sur le federated learning. Entrez les données du patient
        pour obtenir une prédiction de risque de maladie cardiaque.
      </p>

      <section className="card">
        <h2>Informations du Patient</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", gridColumn: "1 / -1" }}>
            {/* Première ligne */}
            <div>
              <label htmlFor="Age">Âge (années)</label>
              <input
                id="Age"
                name="Age"
                type="number"
                value={form.Age}
                onChange={handleChange}
                min="18"
                max="120"
                required
              />
            </div>
            <div>
              <label htmlFor="Sex">Sexe</label>
              <select id="Sex" name="Sex" value={form.Sex} onChange={handleChange} required>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            {/* Deuxième ligne */}
            <div>
              <label htmlFor="ChestPainType">Type de douleur thoracique</label>
              <select
                id="ChestPainType"
                name="ChestPainType"
                value={form.ChestPainType}
                onChange={handleChange}
                required
              >
                <option value="ATA">Angine atypique (ATA)</option>
                <option value="ASY">Asymptomatique (ASY)</option>
                <option value="NAP">Douleur non angineuse (NAP)</option>
                <option value="TA">Angine typique (TA)</option>
              </select>
            </div>
            <div>
              <label htmlFor="RestingBP">Tension au repos (mmHg)</label>
              <input
                id="RestingBP"
                name="RestingBP"
                type="number"
                value={form.RestingBP}
                onChange={handleChange}
                min="60"
                max="200"
                required
              />
            </div>

            {/* Troisième ligne */}
            <div>
              <label htmlFor="Cholesterol">Cholestérol (mg/dl)</label>
              <input
                id="Cholesterol"
                name="Cholesterol"
                type="number"
                value={form.Cholesterol}
                onChange={handleChange}
                min="0"
                max="600"
                required
              />
            </div>
            <div>
              <label htmlFor="FastingBS">Glycémie à jeun &gt; 120 mg/dl</label>
              <select
                id="FastingBS"
                name="FastingBS"
                value={form.FastingBS}
                onChange={handleChange}
                required
              >
                <option value={0}>Non (0)</option>
                <option value={1}>Oui (1)</option>
              </select>
            </div>

            {/* Quatrième ligne */}
            <div>
              <label htmlFor="RestingECG">ECG au repos</label>
              <select
                id="RestingECG"
                name="RestingECG"
                value={form.RestingECG}
                onChange={handleChange}
                required
              >
                <option value="Normal">Normal</option>
                <option value="ST">Anomalie ST-T</option>
                <option value="LVH">Hypertrophie VG probable</option>
              </select>
            </div>
            <div>
              <label htmlFor="MaxHR">Fréquence cardiaque maximale</label>
              <input
                id="MaxHR"
                name="MaxHR"
                type="number"
                value={form.MaxHR}
                onChange={handleChange}
                min="60"
                max="220"
                required
              />
            </div>

            {/* Cinquième ligne */}
            <div>
              <label htmlFor="ExerciseAngina">Angine induite par l'exercice</label>
              <select
                id="ExerciseAngina"
                name="ExerciseAngina"
                value={form.ExerciseAngina}
                onChange={handleChange}
                required
              >
                <option value="Y">Oui</option>
                <option value="N">Non</option>
              </select>
            </div>
            <div>
              <label htmlFor="Oldpeak">Dépression ST induite (Oldpeak)</label>
              <input
                id="Oldpeak"
                name="Oldpeak"
                type="number"
                step="0.1"
                value={form.Oldpeak}
                onChange={handleChange}
                min="0"
                max="10"
                required
              />
            </div>

            {/* Sixième ligne */}
            <div>
              <label htmlFor="ST_Slope">Pente du segment ST</label>
              <select
                id="ST_Slope"
                name="ST_Slope"
                value={form.ST_Slope}
                onChange={handleChange}
                required
              >
                <option value="Up">Montante (Up)</option>
                <option value="Flat">Plate (Flat)</option>
                <option value="Down">Descendante (Down)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              gridColumn: "1 / -1",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "600"
            }}
          >
            {loading ? "Analyse en cours..." : "Obtenir une prédiction"}
          </button>
        </form>
      </section>

      {error && (
        <section className="card" style={{ borderLeft: "4px solid #dc3545" }}>
          <div className="error">{error}</div>
        </section>
      )}

      {result && (
        <section className="card" style={{ borderLeft: `4px solid ${getRiskColor(result.is_sick)}` }}>
          <h2>Résultats de la Prédiction</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "1.5rem"
            }}
          >
            <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "0.5rem" }}>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#666" }}>Diagnostic</p>
              <p
                style={{
                  margin: "0",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: getRiskColor(result.is_sick)
                }}
              >
                {getRiskLabel(result.is_sick)}
              </p>
            </div>

            <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "0.5rem" }}>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#666" }}>Probabilité de Maladie</p>
              <p style={{ margin: "0", fontSize: "1.5rem", fontWeight: "700" }}>
                {(result.probability * 100).toFixed(1)}%
              </p>
            </div>

            <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "0.5rem" }}>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#666" }}>Version du Modèle</p>
              <p style={{ margin: "0", fontSize: "0.95rem", fontWeight: "600", fontFamily: "monospace" }}>
                {result.model_version}
              </p>
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "#e7f3ff", borderRadius: "0.5rem", borderLeft: "4px solid #2196F3" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>Information</h3>
            <p style={{ margin: "0", fontSize: "0.85rem", color: "#333" }}>
              Cette prédiction est basée sur un modèle d'apprentissage fédéré (Federated Learning) utilisant des données historiques anonymisées.
              Elle ne doit pas remplacer l'avis d'un professionnel de santé. Consultez toujours un cardiologue pour un diagnostic définitif.
            </p>
          </div>
        </section>
      )}

      <section className="card" style={{ backgroundColor: "#f5f5f5" }}>
        <h3>À propos du modèle</h3>
        <p style={{ fontSize: "0.9rem", color: "#666", margin: "0" }}>
          Ce système utilise le <strong>federated learning</strong> pour entraîner un modèle de prédiction
          de maladie cardiaque sans centraliser les données sensibles des patients. Le modèle
          analyse 11 paramètres de santé pour évaluer le risque cardiovasculaire.
        </p>
      </section>
    </div>
  );
};
