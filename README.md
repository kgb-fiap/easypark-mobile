# **🅿️ EasyPark \- Aplicativo de Estacionamento Inteligente**

Bem-vindo ao repositório do EasyPark, um aplicativo móvel desenvolvido com React Native e Expo, projetado para modernizar a forma como motoristas encontram e gerenciam vagas de estacionamento, oferecendo uma experiência de usuário limpa, intuitiva e eficiente.

O foco do projeto é oferecer uma experiência de usuário limpa, intuitiva e eficiente, inspirada em aplicativos de mobilidade de ponta, com funcionalidades robustas como mapa interativo, sistema de temas e um fluxo de reserva seguro.

## **🎨 Protótipo e Design**

O design do aplicativo foi criado no Figma, focando em uma interface minimalista e de fácil navegação. Você pode visualizar o protótipo interativo no link abaixo:

| 📌 Recurso | 🔗 Acesso Rápido |
| :--- | :--- |
| **🎨 Protótipo Interativo (Figma)** | [Clique aqui para acessar o protótipo](https://www.figma.com/design/JK1tLDODiaIMuWVRm5RLj9/sprint-easypark?node-id=0-1&t=seFXZbeEQUWYYbMi-1) |
| **🎥 Demonstração de Navegação** | [Clique aqui para assistir ao vídeo](https://youtube.com/shorts/Eyyer4U6Cto?feature=share) |

## **🚀 Sobre o Projeto**

O EasyPark nasceu da necessidade de otimizar a gestão de estacionamentos, substituindo processos manuais por uma solução tecnológica integrada. O objetivo é fornecer aos usuários informações em tempo real sobre a disponibilidade de vagas, enquanto oferece aos gestores de estacionamentos ferramentas para análise e controle.

### **Principais Funcionalidades Implementadas:**

* **✅ Autenticação de Usuário:** Fluxo completo de Cadastro (com validação) e Login. Os dados são persistidos localmente no AsyncStorage para simular um banco de dados.  
* **🗺️ Mapa Interativo (Google Maps):**  
  * Renderização do mapa nativo (react-native-maps) com a chave de API protegida.  
  * Solicitação de permissão e centralização na localização atual do usuário (ou na FIAP como fallback).  
  * Renderização de marcadores de estacionamento com ícones customizados.  
  * Destaque visual (efeito "halo") para o marcador selecionado.  
  * Botão customizado para recentralizar o mapa.  
* **🔍 Busca de Endereços (Nominatim API):**  
  * Tela de busca que pesquisa endereços "as-you-type" (conforme o usuário digita) usando debounce para evitar chamadas excessivas à API.  
  * Formatação inteligente dos endereços da API (Rua, Bairro, Município, CEP).  
  * Sistema de "Buscas Recentes" salvo no AsyncStorage.  
* **🅿️ Fluxo de Reserva:**  
  * Ao clicar em um marcador, um painel inferior (bottom-sheet) animado desliza suavemente para cima.  
  * Ao clicar em "Reservar Vaga", um modal de 70% da tela é ativado, escurecendo o fundo para focar a atenção.  
  * O modal exibe uma lista dinâmica de métodos de pagamento (Cartões salvos, Pix, Dinheiro).  
  * Um **timer regressivo de 30 segundos** com barra de progresso visual é iniciado, simulando o tempo para confirmar a reserva.  
* **🎨 Tema Dinâmico (Dark Mode):**  
  * Interface com modos claro e escuro. A preferência é salva no AsyncStorage e a StatusBar do celular se adapta automaticamente.  
* **💳 Gerenciamento de Pagamentos:**  
  * Tela dedicada para o usuário adicionar e remover cartões de crédito.  
* **💾 Persistência de Dados (Simulação de API):**  
  * O aplicativo usa AsyncStorage para simular um banco de dados de usuário, salvando credenciais, preferências de tema, cartões de crédito e buscas recentes.  
  * Usa uma camada de serviço de mock (apiService.ts) para carregar dados estáticos (como a lista de estacionamentos) com um atraso, simulando uma chamada de rede.  
* **🔔 Notificações Modernas:**  
  * Uso de "toasts" (react-native-toast-message) para mensagens de erro e sucesso, proporcionando uma experiência de usuário mais fluida.

## **🛠️ Tecnologias Utilizadas**

Este projeto foi construído utilizando tecnologias modernas do ecossistema React Native:

* **Framework:** React Native com Expo  
* **Linguagem:** TypeScript  
* **Navegação:** React Navigation (Stack Navigator)  
* **Armazenamento Local:** @react-native-async-storage/async-storage  
* **Mapas e Localização:** react-native-maps (Google Maps), expo-location  
* **Busca de Endereços:** API Nominatim (OpenStreetMap)  
* **UI e Animação:** Animated, Modal, expo-status-bar, expo-navigation-bar  
* **Notificações:** react-native-toast-message  
* **Fontes:** expo-font, expo-splash-screen  
* **Configuração:** dotenv, app.config.js

## **⚙️ Configuração e Instalação**

Siga os passos abaixo para rodar o projeto em seu ambiente de desenvolvimento.

**Pré-requisitos:** Node.js, Watchman (para macOS) e um emulador Android ou iOS configurado.

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
   * a. Crie seu arquivo `.env` na raiz do projeto com base no modelo: 
     ```bash
     cp .env.example .env
     ```
   * b. Adicione suas chaves no arquivo `.env`: 
     ```bash
     env
     EXPO_PUBLIC_GOOGLE_PLACES_API_KEY="SUA_CHAVE_GOOGLE_AQUI"
     EXPO_PUBLIC_FIREBASE_API_KEY="SUA_CHAVE_FIREBASE_AQUI"
     EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
     EXPO_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto"
     EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"
     EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="00000000000"
     EXPO_PUBLIC_FIREBASE_APP_ID="1:00000000:web:abcdef"
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

## **🚀 Como Testar o Login**

1. Ao abrir o aplicativo, clique em "Cadastre-se" na tela de Boas-Vindas.
2. Preencha seus dados reais ou fictícios para criar uma conta na nuvem.
3. Após o cadastro, você será redirecionado para a Home, onde a API da Azure alimentará o mapa com as vagas e o Firebase gerenciará sua sessão.
4. Experimente realizar pesquisas, fechar o app e abrir novamente para ver o Firebase Firestore recuperar seu histórico em tempo real!

## **✨ Criadores**

* [@gabrielCZz](https://github.com/orgs/kgb-fiap/people/gabrielCZz) - Gabriel Cruz
* [@k-auaferreira](https://github.com/orgs/kgb-fiap/people/k-auaferreira) - Kauã Ferreira
* [@Vi-debu](https://github.com/orgs/kgb-fiap/people/Vi-debu) - Vinicius Bitú