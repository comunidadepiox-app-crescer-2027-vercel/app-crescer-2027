# Requirements: 000-fundacao-e-identidade Fundação e identidade

## Funcionais

- **RF-01** O repositório tem um app Next.js App Router em JSX com Tailwind.
- **RF-02** Os tokens visuais oficiais estão documentados em `DESIGN.md` e aplicados no CSS.
- **RF-03** Existe uma rota mínima que demonstra título, texto, link e botão com a identidade.
- **RF-04** Variáveis públicas esperadas estão nomeadas em `.env.example`.

## Não funcionais

- **RNF-01** Identidade: proibições de [DESIGN.md](../DESIGN.md)
- **RNF-02** Stack: Next.js App Router, JSX, Tailwind; Firebase/Cloudinary só como nomes de env
- **RNF-03** Acessibilidade: contraste AA no texto da página técnica
- **RNF-04** Sem dependência de UI kit (shadcn, DaisyUI, MUI) nesta fundação

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Ver página técnica | n/a | n/a | sim (temporário) |

## LGPD

Não coleta dado pessoal.

## Dependências

- Specs: nenhuma
- Contas: Firebase e Cloudinary podem ficar pendentes; a extração visual não
- Arquivos: PDFs e print citados no brief

## Fora

Qualquer funcionalidade de produto (001–007).
