require('dotenv').config();

const crypto = require('crypto');
const { Pool } = require('pg');

const ADMIN_HASH_KEY_LENGTH = 64;
const schemaName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(String(process.env.CONTENT_SCHEMA || 'fulltechwed').trim())
  ? String(process.env.CONTENT_SCHEMA || 'fulltechwed').trim()
  : 'fulltechwed';
const adminUsername = String(process.env.ADMIN_USERNAME || 'admin').trim();
const adminPassword = String(process.env.ADMIN_PASSWORD || 'Fulltech2026!').trim();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no esta configurado');
}

const parsed = new URL(process.env.DATABASE_URL);
const sslMode = parsed.searchParams.get('sslmode');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslMode && sslMode !== 'disable' ? { rejectUnauthorized: false } : false
});

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.scryptSync(String(password), salt, ADMIN_HASH_KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
};

const normalizeMediaRecord = (record) => ({
  id: String(record?.id || '').trim(),
  name: String(record?.name || '').trim(),
  mimeType: String(record?.mimeType || '').trim(),
  dataUrl: String(record?.dataUrl || '').trim()
});

const isValidMediaRecord = (record) => Boolean(record.id && record.dataUrl);

const bootstrap = async () => {
  await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${schemaName}.site_content (
      content_key text PRIMARY KEY,
      config jsonb NOT NULL DEFAULT '{}'::jsonb,
      media jsonb NOT NULL DEFAULT '[]'::jsonb,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${schemaName}.media_assets (
      id text PRIMARY KEY,
      name text NOT NULL DEFAULT '',
      mime_type text NOT NULL DEFAULT '',
      data_url text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${schemaName}.admin_users (
      id bigserial PRIMARY KEY,
      username text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      is_active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await pool.query(
    `
      INSERT INTO ${schemaName}.site_content (content_key, config, media)
      VALUES ($1, '{}'::jsonb, '[]'::jsonb)
      ON CONFLICT (content_key) DO NOTHING
    `,
    ['site']
  );

  const legacyResult = await pool.query(
    `SELECT media FROM ${schemaName}.site_content WHERE content_key = $1 LIMIT 1`,
    ['site']
  );
  const legacyMedia = Array.isArray(legacyResult.rows[0]?.media) ? legacyResult.rows[0].media : [];

  for (const record of legacyMedia.map(normalizeMediaRecord).filter(isValidMediaRecord)) {
    await pool.query(
      `
        INSERT INTO ${schemaName}.media_assets (id, name, mime_type, data_url, updated_at)
        VALUES ($1, $2, $3, $4, now())
        ON CONFLICT (id) DO NOTHING
      `,
      [record.id, record.name, record.mimeType, record.dataUrl]
    );
  }

  await pool.query(
    `
      INSERT INTO ${schemaName}.admin_users (username, password_hash, is_active)
      VALUES ($1, $2, true)
      ON CONFLICT (username)
      DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = true, updated_at = now()
    `,
    [adminUsername, hashPassword(adminPassword)]
  );

  const mediaCountResult = await pool.query(`SELECT COUNT(*)::int AS count FROM ${schemaName}.media_assets`);
  console.log(
    JSON.stringify({
      ok: true,
      schema: schemaName,
      adminUsername,
      mediaAssets: Number(mediaCountResult.rows[0]?.count || 0)
    })
  );
};

bootstrap()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });