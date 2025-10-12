# **🅿️ EasyPark \- Aplicativo de Estacionamento Inteligente**

Bem-vindo ao repositório do EasyPark, um aplicativo móvel desenvolvido com React Native e Expo, projetado para modernizar a forma como motoristas encontram e gerenciam vagas de estacionamento, oferecendo uma experiência de usuário limpa, intuitiva e eficiente.

## **🎨 Protótipo e Design (Figma)**

O design do aplicativo foi criado no Figma, focando em uma interface minimalista e de fácil navegação. Você pode visualizar o protótipo interativo no link abaixo:

**[Link para o protótipo no Figma](https://www.figma.com/design/JK1tLDODiaIMuWVRm5RLj9/sprint-safepark?node-id=0-1&t=R1Gk4wOfAxghkAmk-1)**

## **🚀 Sobre o Projeto**

O EasyPark nasceu da necessidade de otimizar a gestão de estacionamentos, substituindo processos manuais por uma solução tecnológica integrada. O objetivo é fornecer aos usuários informações em tempo real sobre a disponibilidade de vagas, enquanto oferece aos gestores de estacionamentos ferramentas para análise e controle.

### **Principais Funcionalidades Implementadas:**

* **✅ Autenticação de Usuário:** Fluxo completo de Cadastro e Login com validação de dados.  
* **🎨 Tema Dinâmico (Dark Mode):** Interface com modos claro e escuro, com a preferência do usuário salva no dispositivo para uma experiência consistente.  
* **💳 Gerenciamento de Pagamentos:** Tela dedicada para que os usuários possam adicionar e remover seus cartões de crédito, com dados salvos localmente.  
* **📜 Histórico de Transações:** Lista detalhada de todos os estacionamentos utilizados, incluindo valor e forma de pagamento.  
* **🔔 Notificações Modernas:** Uso de "toasts" para mensagens de erro e sucesso, proporcionando uma experiência de usuário mais fluida que os alertas padrão.  
* **💾 Persistência de Dados:** O nome do usuário, suas preferências de tema e métodos de pagamento são salvos no dispositivo usando AsyncStorage.

## **🛠️ Tecnologias Utilizadas**

Este projeto foi construído utilizando tecnologias modernas do ecossistema React Native:

* **Framework:** React Native com Expo  
* **Linguagem:** TypeScript  
* **Navegação:** React Navigation (Stack Navigator)  
* **Armazenamento Local:** @react-native-async-storage/async-storage  
* **Ícones:** @expo/vector-icons (Ionicons, MaterialCommunityIcons)  
* **Notificações:** react-native-toast-message

## **⚙️ Configuração e Instalação**

Siga os passos abaixo para rodar o projeto em seu ambiente de desenvolvimento.

**Pré-requisitos:** Node.js, Watchman (para macOS) e um emulador Android ou iOS configurado.

1. **Clone o repositório:**
```
git clone \[https://github.com/FIAP-MOBILE-2025-Agosto/sc-1-kgb.git\](https://github.com/FIAP-MOBILE-2025-Agosto/sc-1-kgb.git)  
cd easypark
```

2. **Instale as dependências:**  
```
npm install
```

3. **Rode o projeto:**  
* Para uma melhor experiência e para garantir que todos os recursos nativos (como os ícones) funcionem corretamente, é recomendado usar um **Development Build**:  

```
npx expo run:android  
\# ou  
npx expo run:ios
```

* Para rodar com o Expo Go:  
```
npx expo start
```

## **🏛️ Arquitetura e Estrutura do Projeto**

O projeto segue uma estrutura de pastas organizada para facilitar a manutenção e escalabilidade:

```
src/  
├── assets/         \# Imagens, fontes e outros recursos estáticos  
├── components/     \# Componentes reutilizáveis (ex: botões, inputs)  
├── context/        \# React Context Providers (ex: ThemeContext.tsx)  
├── screens/        \# Telas principais do aplicativo  
├── theme/          \# Arquivos de configuração de tema (colors.ts, mapStyles.ts)  
├── types/          \# Definições de tipos globais (ex: user.types.ts)  
└── App.tsx         \# Ponto de entrada principal e configuração da navegação
```

### **Funcionamento do Sistema de Tema**

O ThemeContext.tsx gerencia o estado do tema (claro ou escuro). Ele utiliza o AsyncStorage para salvar a preferência do usuário, garantindo que o tema escolhido persista entre as sessões. Todas as telas e componentes usam o hook useTheme() para acessar as cores corretas, tornando a aplicação totalmente reativa às mudanças de tema.

## **✨ Criadores**

* [@gabrielCZz](https://github.com/orgs/kgb-fiap/people/gabrielCZz)  
* [@k-auaferreira](https://github.com/orgs/kgb-fiap/people/k-auaferreira)  
* [@Vi-debu](https://github.com/orgs/kgb-fiap/people/Vi-debu)
