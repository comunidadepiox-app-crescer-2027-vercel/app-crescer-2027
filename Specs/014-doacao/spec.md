# Spec: 014-doacao Colabore

- Status: `in-progress`
- Complexidade: `media`
- Personas: `fiel` | `admin`
- Depende de: [002-navegacao-e-home](../002-navegacao-e-home/), [007-admin-cms](../007-admin-cms/), [008-app-react-native](../008-app-react-native/)

## Problema

Participantes e demais interessados não têm no app um caminho oficial para oferecer pelo PIX em favor do Crescer 2027. A equipe também não tem como publicar o percentual da arrecadação sem um novo deploy.

## Escopo

### Entra

- Rota autenticada `/colabore` no app Expo
- Botão **COLABORE** no header, no lugar de PARTICIPAR, abrindo `/colabore`
- Atalho **Colabore** na folha central, depois de Participar, abrindo a mesma rota
- Participar permanece na folha, com o aviso enquanto o endereço oficial não existir
- Mensagem breve sobre a finalidade da oferta
- Abertura em cada visita: 4 batidas em sequência no roxo da marca, sem valores em reais, com transições calmas. Um toque pula e vai para a oferta
- QR Code PIX estático (`mobile/assets/qrcode-doacao.png`)
- Código PIX copia e cola, com ação de copiar
- Beneficiário oficial para conferência antes do pagamento no banco
- Barra percentual da arrecadação, só quando a mesa gravar um inteiro de 0 a 100
- Tela da mesa `/admin/doacao` para gravar ou apagar esse percentual em `siteContent/doacao`

### Não entra

- Processar pagamento no app
- Guardar dados bancários do doador
- Meta, valor arrecadado ou custo em reais na abertura
- Editar PIX, QR Code ou beneficiário pela mesa
- Coração animado ou qualquer visual que copie o Clube da Evangelização
- Reabrir a tela arquivada do Benfeitor da Fé (spec 005)

## Fluxos

1. Fiel autenticado toca **COLABORE** no header, ou **Colabore** na folha. A rota `/colabore` abre com a abertura. Um toque em qualquer lugar, ou o fim da sequência, revela a oferta. A barra laranja continua visível para voltar.
2. Lê o convite, confere o beneficiário, aponta a câmera do banco para o QR ou copia o código PIX e conclui no aplicativo do banco.
3. Se a mesa já gravou um percentual válido, vê a barra e o número. Se não gravou, a barra não aparece.
4. Admin abre `/admin/doacao` na mesa, informa um inteiro de 0 a 100 e salva. O app atualiza a barra sem recarregar. Campo vazio e salvar retira o percentual; a barra some.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo Router | `/colabore` |
| Componente | `mobile/components/ColaboreAbertura.jsx` |
| Rota da mesa | `/admin/doacao` |
| Coleção Firestore | `siteContent/doacao` |
| Asset | `mobile/assets/qrcode-doacao.png` |
| Papel | `fiel` autenticado na tela; `admin` na mesa |

## Dados

Documento `siteContent/doacao`. Sem dado pessoal.

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `percent` | number (inteiro 0–100) | não | Ausente ou inválido: a barra some no app. `0` é barra vazia de propósito |
| `updatedAt` | timestamp | sim, na gravação | |
| `updatedBy` | string | sim, na gravação | uid do admin |

PIX, QR e beneficiário são constantes em `mobile/lib/doacao.js`, definidos pela organização:

- Beneficiário: Associação Carismática Católica São Pio X
- CNPJ: 02.868.732/0001-23
- Cidade: Campina Grande/PB
- Payload PIX copia e cola oficial, o mesmo do QR

## Regras de negócio

- A oferta acontece no aplicativo do banco. O app não recebe pagamento.
- O app não guarda dado bancário do doador.
- A barra só aparece com inteiro de 0 a 100. Não inventa percentual nem meta de 2027.
- `0` gravado mostra a barra vazia. Documento inexistente ou `percent` ausente esconde a barra.
- A abertura não exibe valores em reais. Nenhum número na abertura é meta nem arrecadação.
- Copy pastoral, clara, sem tom de loja e sem travessão.
- Header e atalho usam o mesmo nome: Colabore.
- Participar continua na folha; só sai do header.
- Na oferta, blocos centrados e parágrafos justificados. O centro na abertura é o mesmo caso pontual da splash, não o padrão do restante do app.

## Critérios de aceite

- [ ] O header mostra **COLABORE** e abre `/colabore`
- [ ] A folha lista Colabore depois de Participar e abre a mesma rota
- [ ] Participar permanece na folha, com o aviso enquanto a URL estiver vazia
- [ ] `/colabore` exige sessão e volta para a Home pelo cabeçalho laranja
- [ ] Cada visita começa na abertura; um toque revela a oferta; a barra laranja permanece
- [ ] A abertura mostra 4 batidas em ritmo calmo, sem valores em reais
- [ ] A oferta mostra o convite, o QR, o código copia e cola, o beneficiário e o aviso de que o app não recebe o pagamento, em blocos centrados
- [ ] Copiar código coloca o payload PIX na área de transferência
- [ ] Sem percentual válido, a barra não aparece
- [ ] Com percentual 0 a 100 gravado na mesa, a barra e o número aparecem, sem cifra
- [ ] `/admin/doacao` está no menu da mesa e grava `siteContent/doacao`

## Anti-slop

Sem coração se formando, sem gráfico circular, sem meta de 2027 em reais, sem gradiente, sem pílula, sem CTA de checkout. Barra horizontal. Centro só na abertura e nos blocos desta tela. Paleta e fontes de [DESIGN.md](../DESIGN.md).

## Redesign v5 (texto novo, ritmo calmo)

Roteiro em 4 batidas, sem valores em reais. A constante `CUSTO_CRESCER_2026` segue em `lib/doacao.js` sem exibição:

- "COLABORE", "COM O CRESCER", "PRECISAMOS DA SUA" em branco, e "GENEROSIDADE" em dourado como fecho, com filete dourado que se desenha abaixo da palavra final.
- Transições calmas: fade lento de 650 ms com subida curta de 12 px na entrada, fade de 550 ms na saída, sem mola e sem escala. Fundo com malha conectada em deriva lenta, halo que respira e pontos em paralaxe, tudo em laços longos de 4 a 12 segundos.
- Total por volta de 11s. Toque pula após 700ms. Com movimento reduzido, mostra só "GENEROSIDADE" com o filete, sem animar.

## Referências

- Specs irmãs: 002, 005, 007, 008
- Mantenedora já citada em `mobile/app/sobre.jsx` e `Specs/VISION.md`
- PIX e QR oficiais da organização, não da campanha Benfeitor da Fé
