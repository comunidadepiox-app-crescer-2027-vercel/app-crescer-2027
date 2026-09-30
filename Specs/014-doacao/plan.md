# Plan: 014-doacao Colabore

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

Tela Expo Router no mesmo casco das páginas internas: sessão obrigatória, `Voltar` laranja, `ScrollView`. Cada visita começa na abertura em overlay (`Animated` do React Native). Um toque pula. PIX, QR e beneficiário ficam estáticos. O único dado vivo da campanha atual é o percentual em `siteContent/doacao`.

A abertura usa só `Animated`, sem valores em reais: 4 batidas ("COLABORE", "COM O CRESCER", "PRECISAMOS DA SUA", "GENEROSIDADE" em dourado), transições calmas sem mola, malha própria conectada com deriva lenta no fundo roxo e saída revelando a faixa laranja da oferta.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/app/colabore.jsx` | Tela autenticada da oferta, com abertura na entrada |
| `mobile/components/ColaboreAbertura.jsx` | 4 atos de sensibilização, toque para pular, movimento reduzido estático |
| `mobile/lib/doacao.js` | Payload PIX, beneficiário e escuta de `siteContent/doacao` |
| `mobile/components/Header.jsx` | Botão **COLABORE** abre `/colabore` |
| `mobile/components/MenuAtalhos.jsx` | Atalho Colabore depois de Participar |
| `mobile/assets/qrcode-doacao.png` | QR oficial (já no repositório) |
| `app/admin/doacao/page.jsx` | Campo 0–100 e salvar |
| `lib/admin/doacao.js` | Leitura e gravação do documento |
| `app/admin/layout.jsx` | Item Colabore no menu da mesa |
| `components/admin/iconesMesa.jsx` | Ícone do item |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `siteContent/doacao` | `fiel` autenticado | só `admin` | documento único, `onSnapshot` |

Regras de segurança a prever (rascunho):

- Nenhuma regra nova. `match /siteContent/{docId}` já permite leitura autenticada e escrita admin.

## Cloudinary

Nenhum upload. O QR é asset local.

## Ordem de entrega

1. Spec, plan e tasks.
2. Header e atalho da folha.
3. Tela `/colabore` com convite, QR, cópia do PIX e beneficiário.
4. Mesa `/admin/doacao`.
5. Barra ligada ao documento, oculta sem percentual válido.
6. Abertura tipográfica curta, seguida pela oferta em blocos centrados.

## Riscos

| Risco | Mitigação |
|---|---|
| Percentual ainda não gravado | A barra some; PIX e QR continuam visíveis |
| Copiar código sem pacote de clipboard | Instalar `expo-clipboard` no app Expo |
| Confundir com Benfeitor da Fé | Copy e rota próprias; campanha 005 permanece no site |
| Número fora de 0–100 | Mesa recusa; o app ignora valor inválido |

## Fora deste plan

Editar PIX pela mesa, meta em reais, pagamento no app, dados do doador, recriar a antiga abertura de malha/halo, tela arquivada do Benfeitor.
