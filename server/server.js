const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const SCORES_FILE = './scores.json';

function readScores() {
  try {
    return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeScores(scores) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
}

app.get('/scores', (req, res) => {
  res.json(readScores());
});

app.post('/scores', (req, res) => {
  const { name, level, hit, timestamp } = req.body;
  if (!name || !level || !hit || !timestamp) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const scores = readScores();
  scores.push({ name, level, hit, timestamp });
  scores.sort((a, b) => b.level - a.level || b.hit - a.hit);
  const top10 = scores.slice(0, 10);
  writeScores(top10);
  res.json(top10);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
