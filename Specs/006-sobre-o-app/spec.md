# Spec: 006-sobre-o-app Sobre o app

- Status: `in-progress` (Configuração substituída por esta página em 28/09/2026; o texto final está reservado)
- Complexidade: `media`
- Personas: `fiel`, `admin`
- Depende de: [001-autenticacao](../001-autenticacao/), [002-navegacao-e-home](../002-navegacao-e-home/)
- Substitui: a tela de Configuração, descrita em `mobile/app/(tabs)/conta.jsx`, que foi removida

> **Superfície web retirada.** O site Next.js é só a mesa administrativa (`/admin`).

> **O que mudou em 28/09/2026.** Não existe mais página de configuração no app, e a engrenagem do header saiu. O ícone agora é o de informação e abre `/sobre-o-app`, que é só um texto sobre o aplicativo, mais os caminhos de Galeria, Sobre o Crescer e da mesa administrativa. A edição de nome e o apagamento de localização saíram: o primeiro não tinha utilidade sem login e o segundo perde o sentido com o sistema de localização retirado na [010](010-aviso-saida/spec.md).

## Problema

O fiel precisa de um lugar no app para saber o que é o aplicativo, quem o mantém e onde falar com a comunidade. Essa página não ajusta nada: ela informa. O texto precisa ser curto e honesto, aprovado pela Comunidade de São Pio X.

## Escopo

### Entra

- `/sobre-o-app`, aberta pelo ícone de informação no header, à direita do botão COLABORE
- Título, texto de apresentação e texto de privacidade, vindos de `mobile/lib/sobreApp.js`
- Espaço reservado no código para o texto final, que ainda vai ser elaborado pela comunidade
- Atalhos para a Galeria e para o Sobre o Crescer
- Bloco administrativo visível só para `role: admin`, explicando que a mesa continua no site

### Não entra

- Editor de nome, e-mail, senha, logout e qualquer ajuste de conta
- Apagar localização, que saem junto com o sistema de localização da 010
- Tema escuro, idioma, tamanho de fonte, notificações
- Termos, política de privacidade em página inteira e cadastro de consentimento
- Upload de avatar

## Fluxos

1. Fiel toca o ícone de informação no header e a página abre.
2. Lê o texto do aplicativo e o aviso de uso dos dados.
3. Toca em Galeria ou em Sobre o Crescer e sai para a página correspondente, ambas com o voltar para cá.
4. Admin vê o bloco da mesa; o fiel não vê.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota | `/sobre-o-app` |
| Coleções lidas | `users` (só o `role`, para o bloco do admin) |
| Cloudinary | não |
| Papel | `fiel` autenticado; bloco extra para `admin` |

## Dados

Esta spec **não cria contrato**. Ela lê `role` do documento do próprio uid, que já existe pela 001. Nenhum campo de `users` é escrito por esta tela depois da troca: `displayName` continua podendo ser escrito pelo app, mas nenhuma tela o edita.

O texto da página vive em `mobile/lib/sobreApp.js`, em um vetor de parágrafos. É o único lugar a editar quando o texto final chegar da comunidade, e a tela não tem string de conteúdo espalhada pelo arquivo.

## Regras de negócio

- A sessão anônima é criada pelo app; esta página não oferece login nem logout.
- O bloco administrativo aparece só quando `role == admin`, sem vazar informação quando o perfil ainda não carregou.
- O aviso de uso dos dados é curto e está no mesmo idioma do formulário de Testemunhos: o app guarda a sessão anônima, o lembrete marcado com Avise-me e, se a pessoa escrever, o texto e o nome que ela digitou. Nada sai da Comunidade de São Pio X.
- Não mostrar pílula de "plano Pro", status inventado nem número de versão em destaque.

## Critérios de aceite

- [ ] O ícone de informação abre `/sobre-o-app` e nenhuma engrenagem existe no app
- [ ] A página mostra título, texto de apresentação e aviso de uso dos dados
- [ ] O texto vem de um vetor de parágrafos em `mobile/lib/sobreApp.js`, com comentário de onde trocar pelo texto final
- [ ] Nenhum ajuste de conta, toggle ou campo editável na tela
- [ ] Galeria e Sobre o Crescer abrem e voltam para esta página
- [ ] Admin vê o caminho para a mesa web; fiel não vê
- [ ] Aviso de uso dos dados existe e não usa travessão

## Anti-slop

Não é settings de SaaS com dezenas de toggles, nem página de marketing com número grande. É uma folha de papel: título, texto, atalhos e a assinatura da comunidade.

## Referências

- Specs irmãs: 001 (sessão anônima e papel), 002 (header e navegação), 008 (rotas do app), 010 (retirada da localização), 013 (aviso de uso de dado no formulário)
- [DESIGN.md](../DESIGN.md)
- [OPEN-QUESTIONS.md](../OPEN-QUESTIONS.md): texto final do aviso de uso dos dados
