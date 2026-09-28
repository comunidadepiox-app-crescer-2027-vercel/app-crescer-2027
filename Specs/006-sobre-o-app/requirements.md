# Requirements: 006-sobre-o-app Sobre o app

## Funcionais

- **RF-01** O fiel abre a página pelo ícone de informação no header.
- **RF-02** A página explica o que é o aplicativo e quem o mantém.
- **RF-03** A página traz o aviso curto de uso dos dados.
- **RF-04** A página dá acesso à Galeria e ao Sobre o Crescer.
- **RF-05** Admin vê o caminho para a mesa administrativa na web.
- **RF-06** O texto final entra depois, trocando só o vetor de parágrafos do app.

## Não funcionais

- **RNF-01** Tela sóbria, uma coluna, texto à esquerda
- **RNF-02** Nenhum campo editável, nenhum toggle e nenhum controle de conta
- **RNF-03** `role` apenas lido, nunca escrito por esta tela
- **RNF-04** O texto vive em um só arquivo, para a troca do texto final não espalhar string por componente

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Abrir `/sobre-o-app` | sim | sim | redireciona ao início |
| Ver o bloco da mesa | não | sim | não |

## LGPD

- Dados exibidos: nenhum dado pessoal do titular, só texto institucional
- Dado guardado pelo app: a sessão anônima do Firebase, o nome escolhido e o que a pessoa escreveu nos formulários do próprio app
- Finalidade: informar sobre o aplicativo e sobre o uso dos dados
- Onde: nada é gravado por esta tela
- Exclusão: a equipe apaga pelo console do Firebase, a pedido do titular

## Dependências

- 001 (sessão anônima e papel), 002 (header), 008 (rotas do app), 010 (retirada da localização)

## Fora

Editor de conta, logout, tema escuro, idioma, upload de avatar, termos em página inteira e qualquer tela de configuração.
