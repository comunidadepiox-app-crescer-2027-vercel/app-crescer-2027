const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIRESTORE_URL = "https://firestore.googleapis.com/v1";
const SCOPE = "https://www.googleapis.com/auth/datastore";
const encoder = new TextEncoder();

let tokenCache;

function base64url(value) {
  const bytes = typeof value === "string" ? encoder.encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT ausente.");
  const account = JSON.parse(raw);
  if (!account.project_id || !account.client_email || !account.private_key) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT incompleta.");
  }
  return account;
}

async function accessToken(account) {
  if (tokenCache?.expiresAt > Date.now() + 60_000) return tokenCache.value;

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({
    iss: account.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const pem = account.private_key.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
  const keyBytes = Uint8Array.from(atob(pem), (char) => char.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    keyBytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const unsigned = `${header}.${claims}`;
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, encoder.encode(unsigned));
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${base64url(new Uint8Array(signature))}`,
    }),
  });
  if (!response.ok) throw new Error(`OAuth da service account falhou (${response.status}).`);
  const result = await response.json();
  tokenCache = { value: result.access_token, expiresAt: Date.now() + result.expires_in * 1000 };
  return tokenCache.value;
}

function firestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  throw new TypeError("Tipo de campo Firestore não suportado.");
}

function firestoreFields(fields) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, firestoreValue(value)]));
}

async function firestoreRequest(path, body) {
  const account = serviceAccount();
  const response = await fetch(
    `${FIRESTORE_URL}/projects/${account.project_id}/databases/(default)/documents${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await accessToken(account)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) throw new Error(`Firestore REST falhou (${response.status}).`);
  return response.json();
}

async function firestoreGet(path) {
  const account = serviceAccount();
  const response = await fetch(
    `${FIRESTORE_URL}/projects/${account.project_id}/databases/(default)/documents${path}`,
    { headers: { Authorization: `Bearer ${await accessToken(account)}` } }
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore REST falhou (${response.status}).`);
  return response.json();
}

function documentName(collection, id) {
  const account = serviceAccount();
  return `projects/${account.project_id}/databases/(default)/documents/${collection}/${id}`;
}

export async function existeDocumentoComUid(collection, uid) {
  const result = await firestoreRequest(":runQuery", {
    structuredQuery: {
      from: [{ collectionId: collection }],
      where: {
        fieldFilter: {
          field: { fieldPath: "uid" },
          op: "EQUAL",
          value: { stringValue: uid },
        },
      },
      limit: 1,
    },
  });
  return result.some((item) => Boolean(item.document));
}

export async function criarDocumento(collection, fields, timestamps) {
  const id = crypto.randomUUID();
  await firestoreRequest(":commit", {
    writes: [{
      update: { name: documentName(collection, id), fields: firestoreFields(fields) },
      updateTransforms: timestamps.map((fieldPath) => ({ fieldPath, setToServerValue: "REQUEST_TIME" })),
      currentDocument: { exists: false },
    }],
  });
  return id;
}

export async function atualizarAvisoLead(id, emailEnviado) {
  const fields = emailEnviado
    ? { emailAvisado: true }
    : { emailAvisado: false, emailAvisadoEm: null };
  await firestoreRequest(":commit", {
    writes: [{
      update: { name: documentName("benefactorLeads", id), fields: firestoreFields(fields) },
      updateMask: { fieldPaths: Object.keys(fields) },
      ...(emailEnviado
        ? { updateTransforms: [{ fieldPath: "emailAvisadoEm", setToServerValue: "REQUEST_TIME" }] }
        : {}),
      currentDocument: { exists: true },
    }],
  });
}

export async function lerConfiguracaoBenfeitor() {
  const result = await firestoreGet("/siteSettings/benfeitorEmail");
  return result?.fields?.email?.stringValue || null;
}

export async function salvarConfiguracaoBenfeitor(email, uid) {
  await firestoreRequest(":commit", {
    writes: [{
      update: {
        name: documentName("siteSettings", "benfeitorEmail"),
        fields: firestoreFields({ email, updatedBy: uid }),
      },
      updateMask: { fieldPaths: ["email", "updatedBy"] },
      updateTransforms: [{ fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" }],
    }],
  });
}
