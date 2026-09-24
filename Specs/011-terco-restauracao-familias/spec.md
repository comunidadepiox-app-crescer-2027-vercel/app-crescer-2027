# Spec: 011-terco-restauracao-familias Terço da Restauração das Famílias

- Status: `in-progress`
- Complexidade: `media`
- Personas: `fiel`
- Depende de: [008-app-react-native](../008-app-react-native/spec.md)

## Problema

O menu do app já apresenta o Terço da Restauração das Famílias, mas o fiel não consegue abrir nem acompanhar as orações no aplicativo.

## Escopo

### Entra

- Rota autenticada do Terço no app Expo.
- Onze etapas locais, com as orações aprovadas pela comunidade.
- Navegação inferior fixa para avançar e voltar entre as etapas.
- Acesso pelo atalho Terço da Restauração das Famílias da folha central.

### Não entra

- Persistência do progresso, favoritos, áudio, lembretes ou compartilhamento.
- Alteração de Firestore, regras de segurança, CMS ou conteúdo remoto.

## Fluxos

1. O fiel abre a folha central e toca em Terço da Restauração das Famílias.
2. A folha fecha e a primeira etapa abre.
3. O fiel lê a etapa e usa as setas inferiores para ir à anterior ou à próxima.
4. Na primeira etapa a seta anterior fica desativada; na última, a próxima fica desativada.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo | `/terco-restauracao` |
| Dados | conteúdo local no bundle |
| Papel necessário | `fiel` autenticado |

## Regras de negócio

- O texto das orações é estático e segue o conteúdo fornecido pelo responsável.
- Ao mudar de etapa, a rolagem volta ao início.
- A barra de etapas permanece visível e não encobre o final do texto.
- Sem sessão, a rota volta à tela inicial.

## Critérios de aceite

- [ ] O atalho Terço abre `/terco-restauracao` e fecha a folha de atalhos.
- [ ] As onze etapas aparecem na ordem aprovada e com o texto completo.
- [ ] As setas navegam somente dentro dos limites das onze etapas.
- [ ] A tela mantém header, tipografia, cores e leitura editorial do app.
- [ ] A navegação inferior é acessível e não cobre conteúdo em aparelhos com área segura.

## Anti-slop

- Não usar texto centralizado como padrão, gradientes, pílulas ou elementos decorativos sem função.
- A tela deve aproveitar a linguagem do detalhe de notícia: leitura contínua, conteúdo à esquerda e hierarquia tipográfica institucional.

## Referências

- [DESIGN.md](../DESIGN.md)
- [008-app-react-native](../008-app-react-native/spec.md)
- Referência visual enviada pelo responsável em 24/09/2026.
