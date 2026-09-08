# App Crescer (React Native / Expo)

Aplicativo do fiel para o encontro. Usa o mesmo Firebase do WebApp. A área administrativa continua no site.

## Como rodar no celular

1. Instale o [Expo Go](https://expo.dev/go) no Android ou no iPhone.
2. Na pasta `mobile/`:
   ```
   npm install
   ```
3. Copie `.env.example` para `.env` e preencha com as chaves `EXPO_PUBLIC_FIREBASE_*` (as mesmas do `.env.local` do site, só muda o prefixo).
4. `npx expo start`
5. Abra o QR Code no Expo Go.

O login por e-mail e senha funciona de imediato no Expo Go.

O botão Google **não funciona no Expo Go**: o Google recusa o redirect do Expo (`host.exp.exponent`) com *Error 400: invalid_request*. No Go, o app mostra essa explicação e pede e-mail e senha. O Google só completa o fluxo num aplicativo instalado (development build / loja), com `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` preenchido (Web client ID do Firebase Authentication, provedor Google).

## O que fica no site

Publicar notícias, cronograma, destaques e ver leads do Benfeitor: no navegador, `http://localhost:3000/admin` (login `admin@crecer.com` + senha do Firebase Auth; o papel `admin` se define no Firestore).
