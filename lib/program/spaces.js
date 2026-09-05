// Espaços oficiais do encontro, conforme a página de programação do site.
export const ESPACOS = [
  { slug: "palco-principal", nome: "Palco Principal" },
  { slug: "palco-musical", nome: "Palco Musical e Cultural" },
  { slug: "autografos", nome: "Espaço para Autógrafos" },
  { slug: "palestras", nome: "Palestras Formativas" },
  { slug: "criancas", nome: "Espaço para Crianças" },
  { slug: "jovens", nome: "Espaço para Jovens" },
];

export function nomeDoEspaco(slug) {
  return ESPACOS.find((e) => e.slug === slug)?.nome || slug;
}
