# **🅿️ EasyPark \- Aplicativo de Estacionamento Inteligente**

Bem-vindo ao repositório do EasyPark, um aplicativo móvel desenvolvido com React Native e Expo, projetado para modernizar a forma como motoristas encontram e gerenciam vagas de estacionamento, oferecendo uma experiência de usuário limpa, intuitiva e eficiente.

O projeto é inspirado em aplicativos de mobilidade de ponta, contando com funcionalidades robustas como mapa interativo, sistema de temas nativo, fluxo de reserva seguro e persistência de dados em nuvem.

---

## **🎨 Protótipo e Design**

O design do aplicativo foi criado no Figma, focando em uma interface minimalista e de fácil navegação. Você pode visualizar o protótipo interativo no link abaixo:

| 📌 Recurso | 🔗 Acesso Rápido |
| :--- | :--- |
| **🎨 Protótipo Interativo (Figma)** | [Clique aqui para acessar o protótipo](https://www.figma.com/design/JK1tLDODiaIMuWVRm5RLj9/sprint-easypark?node-id=0-1&t=seFXZbeEQUWYYbMi-1) |
<!-- | **🎥 Demonstração de Navegação** | [Clique aqui para assistir ao vídeo](https://youtube.com/shorts/Eyyer4U6Cto?feature=share) | -->

---

## **🚀 Sobre o Projeto**

O EasyPark nasceu da necessidade de otimizar a gestão de estacionamentos, substituindo processos manuais por uma solução tecnológica integrada. O objetivo é fornecer aos usuários informações em tempo real sobre a disponibilidade de vagas, enquanto oferece aos gestores de estacionamentos ferramentas para análise e controle.

### **Principais Funcionalidades Implementadas:**

* **✅ Autenticação Real em Nuvem:** Fluxo completo e seguro de Cadastro e Login integrado nativamente com o **Firebase Authentication**.
* **🗺️ Mapa Interativo (Google Maps):** * Renderização nativa com `react-native-maps` e chaves de API protegidas via `.env`.
  * Solicitação de permissão de GPS e centralização na localização atual do usuário (ou na FIAP como fallback).
  * Renderização de marcadores com destaque visual (efeito "halo") para a vaga selecionada.
* **🔍 Busca de Endereços Inteligente (Google Places API):** * Pesquisa de endereços "as-you-type" usando o `react-native-google-places-autocomplete`.
  * **Persistência Híbrida:** Histórico de "Buscas Recentes" salvo no *Firebase Firestore* (para usuários logados) ou no *AsyncStorage* (para visitantes locais).
  * Opção rápida de "Usar minha localização atual".
* **🅿️ Fluxo de Reserva Contextual:** * Modal interativo exibindo métodos de pagamento.
  * Timer regressivo simulando o tempo máximo de confirmação da reserva.
* **🎨 Tema Dinâmico (Dark/Light Mode):** * Interface responsiva ao tema do sistema operacional, com preferência salva localmente.
* **🔒 Auditoria e CI/CD (EAS Build):** * Injeção dinâmica do *Git Commit Hash* nos metadados do aplicativo via `app.config.js` para rastreabilidade de versão em ambiente de testes.
  * Builds automatizados na nuvem utilizando o *Expo Application Services (EAS)*.

---

## **🛠️ Tecnologias Utilizadas**

O ecossistema do projeto foi construído com ferramentas de padrão internacional da indústria mobile:

* **Framework:** React Native + Expo
* **Linguagem:** TypeScript
* **Backend as a Service:** Firebase (Auth & Cloud Firestore)
* **Mapas e Localização:** Google Maps API, Google Places API, `expo-location`
* **Armazenamento Local:** `@react-native-async-storage/async-storage`
* **Navegação:** React Navigation (Stack)
* **DevOps & Build:** Expo EAS (Application Services), `dotenv` para injeção de variáveis

---

## **⚙️ Configuração e Instalação**

Siga os passos abaixo para rodar o projeto localmente.

**Pré-requisitos:** Node.js instalado e o aplicativo Expo Go no celular (ou um emulador configurado).

1. **Clone o repositório:**
```bash
git clone https://github.com/kgb-fiap/easypark-mobile.git  
cd AppEasyPark
```

2. **Instale as dependências:**  
```bash
npm install
```

3. **Configuração das Variáveis de Ambiente (Obrigatório):** Este projeto consome APIs protegidas do Google e do Firebase. 
  * a. Crie seu arquivo `.env` na raiz do projeto com base no modelo do arquivo `.env.example`: 
    ```bash
    cp .env.example .env
    ```
  * b. Adicione suas chaves no arquivo `.env`: 
    ```env
    # Google Maps
    GOOGLE_MAPS_API_KEY="SUA_CHAVE_AQUI"
    EXPO_PUBLIC_GOOGLE_PLACES_API_KEY="SUA_CHAVE_AQUI"

    # Firebase Config
    EXPO_PUBLIC_FIREBASE_API_KEY="AIza..."
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
    EXPO_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto"
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
    EXPO_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
    ```

4. **Rode o projeto:**  
* Devido à integração de mapas e navegação nativa, recomenda-se criar um **development build**:

```bash
npx expo run:android  
\# ou  
npx expo run:ios
```

* Para rodar com o Expo Go:  
```bash
npx expo start
```

---

## **🏛️ Arquitetura e Estrutura do Projeto**

O projeto segue uma estrutura de pastas organizada para facilitar a manutenção e escalabilidade:

```
AppEasyPark/
├── assets/                  # Ativos globais (logos, ícones de parking)
├── src/                     # Núcleo do Aplicativo
│   ├── api/                 # Conexão com API Azure e Hooks do TanStack Query
│   ├── services/            # Integração com terceiros (Firebase Auth, Firestore)
│   ├── context/             # Provedores de estado global (Tema, etc)
│   ├── hooks/               # Lógica de negócio reutilizável (Location, Countdown)
│   ├── navigation/          # Orquestração de rotas e Tipagem Global
│   ├── screens/             # Telas organizadas por Feature
│   ├── theme/               # Design System (Cores, MapStyles)
│   ├── types/               # Interfaces globais do sistema
│   └── utils/               # Funções utilitárias (formatadores, validadores)
├── App.tsx                  # Ponto de entrada e Providers
├── app.config.js            # Configuração dinâmica do Expo
├── .env                     # Variáveis de ambiente secretas
└── package.json             # Dependências e scripts
```

---

## **🚀 Como testar o aplicativo (Fluxo Principal)**

Com a nova arquitetura em nuvem integrada, você pode testar o fluxo completo de autenticação e o consumo de dados seguindo os passos abaixo:

### **1. Criar Conta ou Fazer Login**
Ao abrir o app, teste o fluxo de autenticação real. Crie uma conta ou faça login. Suas credenciais serão validadas diretamente nos servidores do Firebase.

### **2. Mapa e Reserva**
Na Home, permita o acesso ao GPS. Navegue pelo mapa interativo, clique em um pino de estacionamento e em seguida em "Reservar Vaga". Acompanhe o modal dinâmico e o timer de confirmação.

### **3. Persistência de Histórico Híbrida**
Acesse a tela de Busca e pesquise um destino.

* Se você estiver **logado**, o histórico será salvo na nuvem. Você pode fechar o app e as buscas continuarão lá.
* Se estiver navegando como **visitante**, o histórico será mantido no armazenamento local do aparelho.

---

## **✨ Criadores**

* [@gabrielCZz](https://github.com/orgs/kgb-fiap/people/gabrielCZz) - Gabriel Cruz | RM 559613
* [@k-auaferreira](https://github.com/orgs/kgb-fiap/people/k-auaferreira) - Kauã Ferreira | RM 560992
* [@Vi-debu](https://github.com/orgs/kgb-fiap/people/Vi-debu) - Vinicius Bitú | RM560227