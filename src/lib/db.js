// Utility to interact with Cloudflare D1
// Note: This only works on the server side (API routes, Server Actions)

import { getRequestContext } from '@cloudflare/next-on-pages';

export async function getDB() {
  if (process.env.NODE_ENV === 'development') {
    // In development, you might want to mock the DB or use a local sqlite
    console.warn('D1 is not available in local development without wrangler dev');
  }
  
  return getRequestContext().env.DB;
}

export async function getUserByEmail(email) {
  const db = await getDB();
  return await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
}

export async function createRecord(record) {
  const db = await getDB();
  return await db.prepare(
    'INSERT INTO clinical_records (id, user_id, patient_name, findings, status, accuracy) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(record.id, record.user_id, record.patient, record.findings, record.status, record.accuracy).run();
}
