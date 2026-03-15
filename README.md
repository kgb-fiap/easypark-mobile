# **🅿️ EasyPark \- Aplicativo de Estacionamento Inteligente**

Bem-vindo ao repositório do EasyPark, um aplicativo móvel desenvolvido com React Native e Expo, projetado para modernizar a forma como motoristas encontram e gerenciam vagas de estacionamento, oferecendo uma experiência de usuário limpa, intuitiva e eficiente.

O foco do projeto é oferecer uma experiência de usuário limpa, intuitiva e eficiente, inspirada em aplicativos de mobilidade de ponta, com funcionalidades robustas como mapa interativo, sistema de temas e um fluxo de reserva seguro.

## **🎨 Protótipo e Design (Figma)**

O design do aplicativo foi criado no Figma, focando em uma interface minimalista e de fácil navegação. Você pode visualizar o protótipo interativo no link abaixo:

**[Link para o protótipo no Figma](https://www.figma.com/design/JK1tLDODiaIMuWVRm5RLj9/sprint-easypark?node-id=0-1&t=seFXZbeEQUWYYbMi-1)**

**[Link para o fluxo de navegação de telas](https://youtube.com/shorts/Eyyer4U6Cto?feature=share)**

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
```
git clone https://github.com/FIAP-MOBILE-2025-Agosto/2tdsps-challenge-sprint-2-kgb-sprint-2.git  
cd AppEasyPark
```

2. **Instale as dependências:**  
```
npm install
```

3. Configuração da Chave de API (Obrigatório):  
   Este projeto usa a API do Google Maps (para exibir o mapa) e a API do Nominatim (para busca).  
   * a. Crie seu arquivo .env:  
     O projeto usa um arquivo env.example como modelo. Copie-o para criar seu arquivo .env local:  
     cp env.example .env

   * b. Adicione sua Chave do Google Maps:  
     Abra o arquivo .env que você acabou de criar e insira sua própria chave de API do Google Maps (com as APIs "Maps SDK" habilitadas).  
     GOOGLE\_MAPS\_API\_KEY="SUA\_CHAVE\_DE\_API\_VAI\_AQUI"

4. **Rode o projeto:**  
* Para uma melhor experiência e para garantir que todos os recursos nativos (Google Maps, fontes, splash screen), você precisa criar um **development build** para que o app.config.js possa ler sua chave de API.

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
AppEasyPark/
├── assets/                  # Ativos globais (logos, ícones de parking)
├── src/                     # Núcleo do Aplicativo
│   ├── api/                 # Serviços de integração
│   ├── context/             # Provedores
│   ├── hooks/               # Lógica de negócio reutilizável
│   ├── navigation/          # Orquestração de rotas e Tipagem Global
│   ├── screens/             # Telas organizadas por Feature
│   ├── theme/               # Design System
│   ├── types/               # Interfaces globais do sistema
│   └── utils/               # Funções utilitárias (formatadores, validadores)
├── App.tsx                  # Ponto de entrada e Providers
├── app.config.js            # Configuração dinâmica do Expo
├── .env.example             # Variáveis de ambiente
└── package.json             # Dependências
```

## **🚀 Como Testar o Login**

Após o build ser concluído e o app iniciar, você tem duas opções para testar o fluxo de login:

### **Opção 1: Criar uma Nova Conta**

1. Na tela de Boas-Vindas, clique em **"Cadastre-se"**.  
2. Preencha os campos (o app valida nome sem números e senhas iguais).  
3. Após o cadastro, você será logado e seus dados serão salvos no AsyncStorage do dispositivo.

### **Opção 2: Usar o Usuário Mock (Backdoor)**

Para testes rápidos, você pode usar as credenciais "mock" que estão no código da tela de Login.

* **Email:** teste@teste.com  
* **Senha:** 123

## **✨ Criadores**

* [@gabrielCZz](https://github.com/orgs/kgb-fiap/people/gabrielCZz) - Gabriel Cruz
* [@k-auaferreira](https://github.com/orgs/kgb-fiap/people/k-auaferreira) - Kauã Ferreira
* [@Vi-debu](https://github.com/orgs/kgb-fiap/people/Vi-debu) - Vinicius Bitú