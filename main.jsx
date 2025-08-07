// Entry point for a Vercel-compatible standalone React app
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const questions = [
  { id: "age", text: "What is your age?", type: "number" },
  { id: "gender", text: "What is your gender?", type: "select", options: ["Male", "Female", "Other"] },
  { id: "smoker", text: "Do you smoke?", type: "select", options: ["Yes", "No"] },
  { id: "exercise", text: "How many days a week do you exercise?", type: "number" },
  { id: "diet", text: "How healthy is your diet?", type: "select", options: ["Poor", "Fair", "Good", "Excellent"] },
  { id: "sleep", text: "How many hours of sleep do you get per night?", type: "number" },
  { id: "stress", text: "How would you rate your stress level?", type: "select", options: ["Low", "Moderate", "High"] },
  { id: "alcohol", text: "Do you consume alcohol?", type: "select", options: ["Yes", "No"] },
  { id: "bmi", text: "What is your BMI?", type: "number" },
  { id: "familyHistory", text: "Do you have a family history of chronic disease?", type: "select", options: ["Yes", "No"] }
];

const getPeerComparison = (age, gender, score, type) => {
  const base = gender === "Female" ? 60 : 55;
  const ageFactor = age < 40 ? 5 : age < 60 ? 0 : -5;
  const adjustedBase = base + ageFactor;
  const percentile = Math.round(((100 - score) + adjustedBase) / 2);

  return type === "risk"
    ? `Your risk is lower than approximately ${percentile}% of peers in your age/gender group.`
    : `Your wellness score is higher than approximately ${percentile}% of peers like you.`;
};

const App = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [riskComparison, setRiskComparison] = useState("");
  const [wellnessComparison, setWellnessComparison] = useState("");

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const calculateScores = () => {
    let risk = 0;
    let wellness = 0;

    if (answers.smoker === "Yes") risk += 25;
    if (Number(answers.exercise) >= 3) wellness += 20;
    if (answers.diet === "Excellent") wellness += 25;
    if (Number(answers.sleep) >= 7) wellness += 15;
    if (answers.stress === "High") risk += 15;
    if (answers.familyHistory === "Yes") risk += 20;
    if (Number(answers.bmi) >= 30) risk += 15;

    const riskNormalized = Math.min(100, risk);
    const wellnessNormalized = Math.min(100, wellness);

    const age = Number(answers.age) || 0;
    const gender = answers.gender || "Other";

    const riskText = getPeerComparison(age, gender, riskNormalized, "risk");
    const wellnessText = getPeerComparison(age, gender, wellnessNormalized, "wellness");

    setRiskScore(riskNormalized);
    setWellnessScore(wellnessNormalized);
    setRiskComparison(riskText);
    setWellnessComparison(wellnessText);
    setSubmitted(true);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Health Risk & Wellness Score</h1>
      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); calculateScores(); }}>
          {questions.map((q) => (
            <div key={q.id} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>{q.text}</label>
              {q.type === "select" ? (
                <select onChange={(e) => handleChange(q.id, e.target.value)} required style={{ width: "100%", padding: 8 }}>
                  <option value="">Select</option>
                  {q.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input type={q.type} onChange={(e) => handleChange(q.id, e.target.value)} required style={{ width: "100%", padding: 8 }} />
              )}
            </div>
          ))}
          <button type="submit" style={{ padding: 10, backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: 4 }}>
            Calculate
          </button>
        </form>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Your Scores</h2>
          <p>Risk Score: <strong>{riskScore}</strong> / 100</p>
          <p>{riskComparison}</p>
          <p>Wellness Score: <strong>{wellnessScore}</strong> / 100</p>
          <p>{wellnessComparison}</p>
          <button onClick={() => setSubmitted(false)} style={{ marginTop: 16, padding: 10, backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: 4 }}>
            Retake Assessment
          </button>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
