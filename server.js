require('dotenv').config();

const crypto = require('crypto');
const path = require('path');
const express = require('express');
const { Pool } = require('pg');

const app = express();
const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);
const SESSION_COOKIE_NAME = 'fulltech_admin_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

const adminUsername = String(process.env.ADMIN_USERNAME || 'admin').trim();
const adminPassword = String(process.env.ADMIN_PASSWORD || 'Fulltech2026!').trim();
const adminSessionSecret = String(process.env.ADMIN_SESSION_SECRET || 'fulltech-admin-secret').trim();
const ADMIN_HASH_KEY_LENGTH = 64;

const getSchemaName = () => {
  const rawSchema = String(process.env.CONTENT_SCHEMA || 'fulltechwed').trim();
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(rawSchema) ? rawSchema : 'fulltechwed';
};

const getPoolConfig = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no esta configurado');
  }

  const parsed = new URL(connectionString);
  const sslMode = parsed.searchParams.get('sslmode');

  return {
    connectionString,
    ssl: sslMode && sslMode !== 'disable' ? { rejectUnauthorized: false } : false
  };
};

const schemaName = getSchemaName();
const pool = new Pool(getPoolConfig());

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.scryptSync(String(password), salt, ADMIN_HASH_KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, hash] = String(storedHash || '').split(':');
  if (!salt || !hash) return false;

  const candidateHash = crypto.scryptSync(String(password), salt, ADMIN_HASH_KEY_LENGTH).toString('hex');
  if (candidateHash.length !== hash.length) return false;

  return crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(hash, 'hex'));
};

const normalizeMediaRecord = (record) => ({
  id: String(record?.id || '').trim(),
  name: String(record?.name || '').trim(),
  mimeType: String(record?.mimeType || '').trim(),
  dataUrl: String(record?.dataUrl || '').trim(),
  updatedAt: record?.updatedAt || new Date().toISOString()
});

const isValidMediaRecord = (record) => {
  const normalized = normalizeMediaRecord(record);
  return Boolean(normalized.id && normalized.dataUrl);
};

const getAdminUserByUsername = async (username) => {
  const result = await pool.query(
    `SELECT id, username, password_hash, is_active FROM ${schemaName}.admin_users WHERE username = $1 LIMIT 1`,
    [String(username || '').trim()]
  );

  return result.rows[0] || null;
};

const readMediaAssets = async () => {
  const result = await pool.query(
    `SELECT id, name, mime_type, data_url, updated_at FROM ${schemaName}.media_assets ORDER BY updated_at ASC, id ASC`
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    mimeType: row.mime_type,
    dataUrl: row.data_url,
    updatedAt: row.updated_at
  }));
  };

const writeMediaAssets = async (client, media) => {
  const validMedia = Array.isArray(media) ? media.map(normalizeMediaRecord).filter(isValidMediaRecord) : [];
  const ids = validMedia.map((record) => record.id);

  await client.query(`DELETE FROM ${schemaName}.media_assets WHERE id <> ALL($1::text[])`, [ids.length ? ids : ['']]);

  for (const record of validMedia) {
    await client.query(
      `
        INSERT INTO ${schemaName}.media_assets (id, name, mime_type, data_url, updated_at)
        VALUES ($1, $2, $3, $4, now())
        ON CONFLICT (id)
        DO UPDATE SET name = EXCLUDED.name, mime_type = EXCLUDED.mime_type, data_url = EXCLUDED.data_url, updated_at = now()
      `,
      [record.id, record.name, record.mimeType, record.dataUrl]
    );
  }
};

const seedAdminUser = async () => {
  const passwordHash = hashPassword(adminPassword);
  await pool.query(
    `
      INSERT INTO ${schemaName}.admin_users (username, password_hash, is_active)
      VALUES ($1, $2, true)
      ON CONFLICT (username)
      DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = true, updated_at = now()
    `,
    [adminUsername, passwordHash]
  );
};

const migrateLegacyMedia = async () => {
  const countResult = await pool.query(`SELECT COUNT(*)::int AS count FROM ${schemaName}.media_assets`);
  if (Number(countResult.rows[0]?.count || 0) > 0) return;

  const legacyResult = await pool.query(
    `SELECT media FROM ${schemaName}.site_content WHERE content_key = $1 LIMIT 1`,
    ['site']
  );

  const legacyMedia = legacyResult.rows[0]?.media;
  if (!Array.isArray(legacyMedia) || !legacyMedia.length) return;

  for (const record of legacyMedia.map(normalizeMediaRecord).filter(isValidMediaRecord)) {
    await pool.query(
      `INSERT INTO ${schemaName}.media_assets (id, name, mime_type, data_url, updated_at)
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (id) DO NOTHING`,
      [record.id, record.name, record.mimeType, record.dataUrl]
    );
  }
  };

const ensureDatabase = async () => {
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

	await migrateLegacyMedia();
	await seedAdminUser();
};

const setNoStore = (response) => {
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', '0');
};

const parseCookies = (request) => {
  const header = request.headers.cookie;
  if (!header) return {};

  return header.split(';').reduce((cookies, entry) => {
    const [rawName, ...rawValue] = entry.trim().split('=');
    if (!rawName) return cookies;
    cookies[rawName] = decodeURIComponent(rawValue.join('='));
    return cookies;
  }, {});
};

const toBase64Url = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const fromBase64Url = (value) => {
  const normalized = String(value).replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, 'base64').toString('utf8');
};

const signSessionPayload = (payload) =>
  crypto.createHmac('sha256', adminSessionSecret).update(payload).digest('hex');

const createSessionToken = (username) => {
  const payload = JSON.stringify({
	username: String(username || '').trim(),
    expiresAt: Date.now() + SESSION_DURATION_MS
  });
  const encodedPayload = toBase64Url(payload);
  const signature = signSessionPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

const readSessionToken = (request) => parseCookies(request)[SESSION_COOKIE_NAME] || '';

const verifySessionToken = (token) => {
  if (!token || !token.includes('.')) return null;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signSessionPayload(encodedPayload);
  if (signature.length !== expectedSignature.length) return null;
  const isValidSignature = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!isValidSignature) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));
    if (!String(payload.username || '').trim()) return null;
    if (!payload.expiresAt || Number(payload.expiresAt) <= Date.now()) return null;
    return payload;
  } catch (error) {
    return null;
  }
};

const setSessionCookie = (response, token) => {
  response.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${Math.floor(
      SESSION_DURATION_MS / 1000
    )}; SameSite=Lax`
  );
};

const clearSessionCookie = (response) => {
  response.setHeader('Set-Cookie', `${SESSION_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
};

const sendNoStorePage = (response, fileName) => {
  response.sendFile(path.join(rootDir, fileName), {
    cacheControl: false,
    lastModified: false,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    }
  });
};

const requireAdminAuth = (request, response, next) => {
  const session = verifySessionToken(readSessionToken(request));
  if (!session) {
    setNoStore(response);
    response.status(401).json({ error: 'No autorizado' });
    return;
  }

  request.adminSession = session;
  next();
};

const requireAdminPageAuth = (request, response, next) => {
  const session = verifySessionToken(readSessionToken(request));
  if (!session) {
	  setNoStore(response);
    response.redirect('/login.html');
    return;
  }

  request.adminSession = session;
  next();
};

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const validateBundle = (bundle) => isPlainObject(bundle) && isPlainObject(bundle.config) && Array.isArray(bundle.media);

app.use(express.json({ limit: '100mb' }));

app.get('/api/auth/session', (request, response) => {
  const session = verifySessionToken(readSessionToken(request));
  setNoStore(response);
  response.json({ authenticated: Boolean(session), username: session?.username || null });
});

app.post('/api/auth/login', (request, response) => {
  Promise.resolve()
  .then(async () => {
    const username = String(request.body?.username || '').trim();
    const password = String(request.body?.password || '').trim();

    const adminUser = await getAdminUserByUsername(username);
    if (!adminUser || !adminUser.is_active || !verifyPassword(password, adminUser.password_hash)) {
    setNoStore(response);
    response.status(401).json({ error: 'Credenciales invalidas' });
    return;
    }

    const token = createSessionToken(adminUser.username);
    setSessionCookie(response, token);
    setNoStore(response);
    response.json({ ok: true, username: adminUser.username });
  })
  .catch((error) => {
    console.error('Login failed', error);
    setNoStore(response);
    response.status(500).json({ error: 'No se pudo iniciar sesion' });
  });
});

app.post('/api/auth/logout', (_request, response) => {
  clearSessionCookie(response);
  setNoStore(response);
  response.json({ ok: true });
});

app.get('/api/health', async (_request, response) => {
  try {
    const result = await pool.query('SELECT now() AS now');
    setNoStore(response);
    response.json({ ok: true, schema: schemaName, time: result.rows[0].now });
  } catch (error) {
    console.error('Health check failed', error);
    response.status(500).json({ ok: false, error: 'No se pudo conectar a PostgreSQL' });
  }
});

app.get('/api/site-content', async (_request, response) => {
  try {
    const result = await pool.query(
      `SELECT config, media, updated_at FROM ${schemaName}.site_content WHERE content_key = $1 LIMIT 1`,
      ['site']
    );
	const media = await readMediaAssets();

    setNoStore(response);

    if (!result.rowCount) {
      response.json({ config: {}, media, updatedAt: null });
      return;
    }

    response.json({
      config: result.rows[0].config || {},
	  media,
      updatedAt: result.rows[0].updated_at
    });
  } catch (error) {
    console.error('Read site content failed', error);
    response.status(500).json({ error: 'No se pudo leer el contenido del sitio' });
  }
});

app.put('/api/site-content', requireAdminAuth, async (request, response) => {
  if (!validateBundle(request.body)) {
    response.status(400).json({ error: 'Payload invalido para contenido del sitio' });
    return;
  }

  const { config, media } = request.body;
	const client = await pool.connect();

  try {
	  await client.query('BEGIN');
    await client.query(
      `
        INSERT INTO ${schemaName}.site_content (content_key, config, media, updated_at)
        VALUES ($1, $2::jsonb, $3::jsonb, now())
        ON CONFLICT (content_key)
        DO UPDATE SET config = EXCLUDED.config, media = EXCLUDED.media, updated_at = now()
      `,
      ['site', JSON.stringify(config), JSON.stringify(media)]
    );
	  await writeMediaAssets(client, media);
	  await client.query('COMMIT');

    setNoStore(response);
    response.json({ ok: true });
  } catch (error) {
	  await client.query('ROLLBACK');
    console.error('Save site content failed', error);
    response.status(500).json({ error: 'No se pudo guardar el contenido del sitio' });
	} finally {
	  client.release();
  }
});

app.get('/admin', requireAdminPageAuth, (_request, response) => {
  sendNoStorePage(response, 'admin.html');
});

app.get('/admin.html', requireAdminPageAuth, (_request, response) => {
  sendNoStorePage(response, 'admin.html');
});

app.get('/login', (_request, response) => {
  sendNoStorePage(response, 'login.html');
});

app.get('/login.html', (_request, response) => {
  sendNoStorePage(response, 'login.html');
});

app.use(express.static(rootDir));

const start = async () => {
  try {
    await ensureDatabase();
    app.listen(port, () => {
      console.log(`FULLTECH server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor', error);
    process.exit(1);
  }
};

start();