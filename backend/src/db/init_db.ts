import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function initDB() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('Connected to database.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Running schema.sql...');
    await client.query(schemaSql);
    console.log('Schema created successfully.');

    console.log('Running seed.sql...');
    await client.query(seedSql);
    console.log('Seed data inserted successfully.');

  } catch (err) {
    console.error('Error initializing the database:', err);
  } finally {
    await client.end();
  }
}

initDB();
