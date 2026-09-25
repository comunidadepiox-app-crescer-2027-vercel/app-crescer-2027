# Plan: 008-app-react-native

## Abordagem

Expo (React Native, JavaScript, sem TypeScript) com expo-router, na pasta `mobile/` do monorepo. O backend não muda: o app consome o mesmo Firebase (Auth + Firestore) com o SDK JS, persistindo a sessão com AsyncStorage. A lógica de dados da web (`lib/`) é portada quase sem alteração; a interface é reescrita com componentes nativos e StyleSheet.

## Decisões

| Decisão | Escolha | Motivo |
|---|---|---|
| Runtime | Expo managed + Expo Go | Testável no celular sem Android Studio/Xcode |
| Navegação | expo-router (abas + stack) | Espelha a estrutura de rotas da web |
| Firebase | SDK JS `firebase` + `initializeAuth` com AsyncStorage | Mesmo projeto e regras; sem SDK nativo por ora |
| Fontes | Geometric Slabserif convertida woff2→TTF; Outfit via `@expo-google-fonts/outfit` | expo-font não lê woff2 |
| Splash | `expo-video` com `splash-crescer.mp4` sobre `#3e1c7a` (tom do vídeo no aparelho), wordmark e logos da diocese e de São Pio X no rodapé | Abertura da web + marcas institucionais no app |
| Google login | `expo-auth-session` + `signInWithCredential` no build nativo | O Google bloqueia OAuth no Expo Go (custom scheme); e-mail/senha é o caminho no Go |
| Ícones | Port dos SVGs da marca com `react-native-svg` | Mesma linguagem visual da web |
| Upload de capa | Fora (app é só do fiel) | Admin fica na web |

## Riscos

| Risco | Mitigação |
|---|---|
| Google login exige client ID e configuração externa | Botão degrada com mensagem clara; e-mail/senha é o caminho principal |
| Google recusa OAuth no Expo Go (política 400 invalid_request) | Detectar Expo Go e não abrir o browser; Google só no apk/ipa de desenvolvimento |
| Conversão woff2→TTF falhar | Fallback: título com peso bold do sistema até resolver |
| Versões Expo x Firebase | Usar `npx expo install` para versões casadas |

## Entregas (fases)

1. Fundação: scaffold, deps, fontes TTF, assets da marca, tema (cores/tipografia)
2. Infra: firebase client RN, AuthProvider, splash com vídeo
3. Telas: login → barra (Home, Notícias, círculo de menu, Agenda, Benfeitor) → Conta pela engrenagem do header → detalhe de notícia, Galeria, Sobre, Terço e Fornecedor
4. Validação: bundle sem erros, checklist da spec, docs (README mobile)
