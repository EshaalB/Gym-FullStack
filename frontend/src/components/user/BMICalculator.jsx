import React, { useState } from "react";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const calculateBMI = (e) => {
    e.preventDefault();
    setError("");
    setBmi(null);
    setCategory("");
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) {
      setError("Please enter valid positive numbers for weight and height.");
      return;
    }
    const bmiValue = w / ((h / 100) * (h / 100));
    setBmi(bmiValue.toFixed(1));
    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue < 24.9) setCategory("Normal weight");
    else if (bmiValue < 29.9) setCategory("Overweight");
    else setCategory("Obese");
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, borderRadius: 12, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} aria-label="BMI Calculator">
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>BMI Calculator</h2>
      <form onSubmit={calculateBMI}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="weight" style={{ display: "block", marginBottom: 4 }}>Weight (kg):</label>
          <input
            id="weight"
            type="number"
            min="1"
            step="any"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="height" style={{ display: "block", marginBottom: 4 }}>Height (cm):</label>
          <input
            id="height"
            type="number"
            min="1"
            step="any"
            value={height}
            onChange={e => setHeight(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 4, background: "#2563eb", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>
          Calculate BMI
        </button>
      </form>
      {error && <div style={{ color: "#dc2626", marginTop: 12, textAlign: "center" }}>{error}</div>}
      {bmi && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Your BMI: {bmi}</div>
          <div style={{ fontSize: 18, marginTop: 8 }}>Category: <span style={{ fontWeight: 600 }}>{category}</span></div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator; 