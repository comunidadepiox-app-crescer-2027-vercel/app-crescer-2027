export function formataDataFirestore(timestamp) {
  if (!timestamp?.toDate) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(timestamp.toDate());
}
