// 📁 server/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL (через переменные окружения)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 📌 Получить 10 лучших результатов
app.get('/scores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scores ORDER BY level DESC, hit DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении рекордов:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 📌 Сохранить результат игры
app.post('/scores', async (req, res) => {
  const { name, level, hit, timestamp } = req.body;
  if (!name || !level || !hit || !timestamp) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await pool.query(
      'INSERT INTO scores (name, level, hit, timestamp) VALUES ($1, $2, $3, to_timestamp($4 / 1000.0))',
      [name, level, hit, timestamp]
    );
    const result = await pool.query('SELECT * FROM scores ORDER BY level DESC, hit DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при сохранении результата:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 📌 Учёт запусков игры
app.post('/launch', async (req, res) => {
  try {
    await pool.query('INSERT INTO launches (count) VALUES (1)');
    const result = await pool.query('SELECT COUNT(*) FROM launches');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Ошибка при сохранении запуска:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 📌 Получить количество запусков игры
app.get('/launch', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM launches');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Ошибка при получении количества запусков:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер работает: http://localhost:${PORT}`);
});
