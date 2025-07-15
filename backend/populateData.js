const fs = require('fs');
require('dotenv').config();
const sql = require('mssql');

// Edit these config values as needed
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  port: parseInt(process.env.DB_PORT),
  instanceName: process.env.DB_INSTANCE,
  database: process.env.DB_DATABASE,
  options: { 
      encrypt: false, 
    trustServerCertificate: true,
  },
};

const sqlFile = 'populateData.sql';

async function runSqlScript() {
  try {
    const sqlScript = fs.readFileSync(sqlFile, 'utf8');
    const pool = await sql.connect(config);
    // Split on GO statements for SQL Server batch execution
    const batches = sqlScript.split(/\bGO\b/gi);
    for (const batch of batches) {
      const trimmed = batch.trim();
      if (trimmed) {
        await pool.request().batch(trimmed);
      } 
    }
    console.log('Database populated successfully.');
    await pool.close();
  } catch (err) {
    console.error('Failed to populate database:', err);
    process.exit(1);
  }
}

runSqlScript(); 