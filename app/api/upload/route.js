import crypto from "crypto";

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_API_SECRET;

// Valida o token do Firebase e confirma o papel admin lendo o próprio
// documento users/{uid} via REST (as security rules impedem forjar o role).
async function verificaAdmin(idToken) {
  const lookup = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!lookup.ok) return null;
  const data = await lookup.json();
  const uid = data.users?.[0]?.localId;
  if (!uid) return null;

  const docRes = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`,
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  if (!docRes.ok) return null;
  const docData = await docRes.json();
  const role = docData.fields?.role?.stringValue;
  return role === "admin" ? uid : null;
}

export async function POST(request) {
  if (!CLOUD_NAME || !CLOUDINARY_KEY || !CLOUDINARY_SECRET) {
    return Response.json(
      { error: "Cloudinary não configurado no servidor." },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!idToken) {
    return Response.json({ error: "Sem credencial." }, { status: 401 });
  }

  const uid = await verificaAdmin(idToken);
  if (!uid) {
    return Response.json({ error: "Acesso restrito à equipe." }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "Arquivo ausente." }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "news";
  const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_SECRET}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const upload = new FormData();
  upload.append("file", file);
  upload.append("api_key", CLOUDINARY_KEY);
  upload.append("timestamp", String(timestamp));
  upload.append("folder", folder);
  upload.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: upload }
  );
  if (!res.ok) {
    return Response.json({ error: "O Cloudinary recusou o upload." }, { status: 502 });
  }
  const data = await res.json();
  return Response.json({ url: data.secure_url, publicId: data.public_id });
}
