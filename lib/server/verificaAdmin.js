const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Valida o token do Firebase e confirma o papel admin lendo users/{uid}.
// As security rules impedem o client de forjar o role.
export async function verificaAdmin(idToken) {
  if (!idToken || !FIREBASE_API_KEY || !PROJECT_ID) return null;
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

export function tokenDoHeader(request) {
  const authHeader = request.headers.get("authorization") || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
}
