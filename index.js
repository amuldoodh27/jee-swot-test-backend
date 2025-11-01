import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Example 75-question dataset (25 each subject)
import questions from "./questions.js";

// Timer, marking, SWOT logic
app.post("/submit", (req, res) => {
  const { answers } = req.body;
  let score = 0;
  let subjectScores = { physics: 0, chemistry: 0, maths: 0 };

  questions.forEach((q, i) => {
    const correct = q.correct === answers[i];
    if (correct) {
      score += 4;
      subjectScores[q.subject] += 4;
    } else if (answers[i] !== null) {
      score -= 1;
      subjectScores[q.subject] -= 1;
    }
  });

  const swot = Object.entries(subjectScores).map(([subject, marks]) => ({
    subject,
    strength: marks >= 60 ? "Strong" : marks >= 40 ? "Moderate" : "Weak",
    opportunity:
      marks < 40
        ? "Revise theory + attempt easy questions first"
        : marks < 60
        ? "Focus on mixed-level practice"
        : "Maintain accuracy",
  }));

  res.json({ total: score, subjectScores, swot });
});

app.get("/questions", (req, res) => {
  const shuffled = questions.sort(() => 0.5 - Math.random()).slice(0, 75);
  res.json(shuffled);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
