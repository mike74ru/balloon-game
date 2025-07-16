require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        level INTEGER NOT NULL,
        hit INTEGER NOT NULL,
        timestamp TIMESTAMP NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS launches (
        id SERIAL PRIMARY KEY,
        count INTEGER DEFAULT 1,
        launched_at TIMESTAMP DEFAULT now()
      );
    `);

    console.log("✅ Таблицы успешно созданы.");
    process.exit();
  } catch (err) {
    console.error("❌ Ошибка при создании таблиц:", err);
    process.exit(1);
  }
};

createTables();
