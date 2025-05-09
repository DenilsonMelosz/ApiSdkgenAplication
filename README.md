# 🧩 Aplicação Fullstack com SDKGEN, React (TSX) e Firebase

Este projeto foi criado com o intuito de **explorar o fluxo e funcionamento da API SDKGEN** por meio de uma aplicação **fullstack** que utiliza: 

- 🧠 [SDKGEN](https://sdkgen.github.io/), no backend para definição de API fortemente tipada
- ⚛️ **React com TypeScript (TSX)** no frontend
- 🔐 Autenticação com **JWT**
- 🔥 **Firebase Realtime Database** para persistência de dados

---

## ✨ Funcionalidades

- Cadastro de novos usuários (`Signup`)
- Login e autenticação de usuários (`Login`)
- Exibição de dados do usuário autenticado (`Profile`)
- Proteção de rotas autenticadas
- Backend integrado ao Firebase
- Armazenamento seguro de sessões com JWT

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- SDKGEN
- Firebase Admin SDK
- JWT
- TypeScript

### Frontend
- React + Vite
- TypeScript (TSX)
- TailwindCSS
- React Router DOM

---

## 💻 Instruções de Uso

### ⚙️ Configuração do Ambiente

#### 🔐 Arquivo `.env` (na raiz do backend)

Crie um arquivo `.env` com as seguintes variáveis:

```env
FIREBASE_ADMIN_PATH=./firebase-admin.json
FIREBASE_DATABASE_URL=https://<SEU_PROJETO>.firebaseio.com
JWT_SECRET=sua_chave_jwt
JWT_EXPIRES_IN=1d
```

#### 1. Clone o Repositório

```bash
git clone https://github.com/DenilsonMelosz/ApiSdkgenAplication
```

#### 2. Baixe as Dependências: 

- Backend
  
```bash
cd backend
npm install
npm run dev
```

- Frontend
  
```bash
cd Frontend
npm install
npm run dev
```

#### 3. Acessar as rodas e testar a aplicação.

 - Rota da Api: http://localhost:8000/playground





