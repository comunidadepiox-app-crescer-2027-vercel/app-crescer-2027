export function ordenaItensPrograma(itens) {
  return [...itens].sort((a, b) => {
    const ordem = (Number(a.order) || 0) - (Number(b.order) || 0);
    if (ordem !== 0) return ordem;
    return String(a.time || "").localeCompare(String(b.time || ""));
  });
}
