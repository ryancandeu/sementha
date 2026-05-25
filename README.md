# Sementha 🌱

Um ecossistema móvel inteligente para gerenciamento, monitoramento e automação da rotina de cuidados botânicos domésticos.

---

## Equipe de Desenvolvimento

O projeto foi planejado, arquitetado e desenvolvido em colaboração acadêmica pelos seguintes integrantes:

* André Luiz Cittadin Barbosa
* Arthur Locks Grassi
* Bernardo Marchioro
* Nathan Henrique Frassetto
* Ryan Candeu Amboni

  ---

  
## 📋 Índice

1. [Apresentação e Objetivos](#1-apresentação-e-objetivos)
2. [Funcionalidades Detalhadas](#2-funcionalidades-detalhadas)
3. [Atendimento aos Requisitos Obrigatórios](#3-atendimento-aos-requisitos-obrigatórios)
4. [Engenharia de Software e Arquitetura do CRUD](#4-engenharia-de-software-e-arquitetura-do-crud)
5. [Arquitetura e Navegação de Telas](#5-arquitetura-e-navegação-de-telas)
6. [Diferenciais e Requisitos Opcionais (Avançados)](#6-diferenciais-e-requisitos-opcionais-avançados)
7. [Stack Tecnológica e Dependências](#7-stack-tecnológica-e-dependências)
8. [Estrutura Organizacional de Pastas](#8-estrutura-organizacional-de-pastas)
9. [Manual de Instalação e Execução](#9-manual-de-instalação-e-execução)
10. [Disponibilização do APK de Produção](#10-disponibilização-do-apk-de-produção)
11. [Conclusão e Critérios de Qualidade](#11-conclusão-e-critérios-de-qualidade)


---

## 1. Apresentação e Objetivos

O **Sementha** é uma plataforma mobile de nível corporativo e acadêmico voltada ao gerenciamento inteligente do ciclo de vida de plantas domésticas e decorativas. O projeto surge para solucionar um problema recorrente no cotidiano moderno: o definhamento prematuro de espécies botânicas devido à falta de consistência, esquecimento ou desconhecimento técnico sobre as janelas temporais de rega, adubagem e manutenção do substrato.

### O Problema Resolvido
A rotina contemporânea reduz o tempo dedicado à observação ambiental. Muitas espécies exigem ciclos rígidos e personalizados de irrigação e nutrientes; o erro humano no cálculo subjetivo ("olhômetro") ou o esquecimento prolongado resultam na perda de investimentos financeiros e afetivos em áreas verdes residenciais. Ademais, a ausência de uma base unificada obriga o usuário a realizar buscas exaustivas e manuais na internet sobre cada nova espécie adquirida.

### Objetivo Principal
Automatizar a orquestração de tarefas botânicas através de inteligência de geolocalização e agendamentos nativos, fornecendo uma interface unificada onde o usuário consiga monitorar o nível de urgência de sua coleção, receber alertas personalizados e exportar históricos estruturados.

### Público-Alvo
* Entusiastas de jardinagem urbana ("pais de planta").
* Colecionadores de espécies exóticas ou sensíveis (como orquídeas e suculentas).
* Usuários com rotinas dinâmicas que necessitam de auxílio mnemônico para tarefas domésticas.
* Acadêmicos e biólogos que demandam catalogação móvel de espécimes.

---

## 2. Funcionalidades Detalhadas

O aplicativo foi projetado sob fortes pilares de Experiência do Usuário (UX) e Engenharia de Requisitos, dividindo-se nas seguintes capacidades operacionais:

* **Cadastro Automatizado e Customizado:** Permite a inserção de uma planta fornecendo nome afetivo, espécie, data de aquisição, notas livres e upload de imagem diretamente do dispositivo.
* **AutoPreenchimento Baseado em Inteligência Botânica (Autocomplete):** Ao digitar o nome de uma planta, o sistema consome uma base conectada para sugerir automaticamente as frequências ideais de cuidados, mitigando erros de parametrização.
* **Dashboard de Resumo Diário:** Uma central analítica que saúda o usuário dinamicamente com base no horário do sistema e apresenta um resumo numérico das obrigações do dia atual.
* **Card de Clima e Análise Ambiental Contextual:** Através do GPS do aparelho, o app identifica as coordenadas do usuário e consulta dados meteorológicos ao vivo, exibindo alertas contextuais ("Tempo seco, capriche na rega" ou "Vai chover! Cuidado com a rega dupla").
* **Listagem Multicritério com Filtros Avançados:** Exibição em formato grid responsivo de duas colunas, permitindo buscas textuais instantâneas e ordenação dinâmica por Ordem Alfabética, Data de Cadastro, Categoria/Espécie, Frequência de Rega e Nível de Urgência de Cuidados.
* **Histórico de Ciclo de Vida e Ações Atômicas:** Dentro dos detalhes de cada espécime, botões com feedbacks táteis registram imediatamente a realização de uma Rega, Adubagem ou Troca de Substrato, atualizando os marcadores temporais no banco de dados em nuvem.
* **Orquestrador Nativo de Notificações Locais:** O aplicativo calcula de forma preditiva as próximas datas de atenção e programa alarmes no sistema operacional do celular. O usuário define o horário que deseja ser notificado no seu perfil.
* **Compilador e Exportador de Fichas Técnicas em PDF:** Geração automática sob demanda de documentos estruturados em HTML e conversão nativa para formato PDF.
* **Gerenciamento Global Dinâmico de Temas (Light/Dark Mode):** Alternância completa de tokens visuais em tempo real, recalculando taxas de contraste.
* **Garantia de Integridade de Fluxo (UX Protegido):** Estado de *loading* unificado nos botões que previne submissões duplicadas no banco de dados e controle rígido de navegação (`KeyboardAvoidingView` e `navigation.reset`).

---

## 3. Atendimento aos Requisitos Obrigatórios

Abaixo está detalhado o mapeamento que comprova a conformidade integral do projeto com os requisitos obrigatórios de entrega da disciplina:

| Requisito Solicitado | Implementação Prática no Sementha |
| :--- | :--- |
| **No mínimo 4 telas** | Ultrapassado. Foram implementadas **10 telas independentes** com navegação fluida (`Home`, `Login`, `Register`, `Profile`, `MyPlants`, `NewPlant`, `EditPlant`, `PlantDetails`, `Tasks`, `ForgotPassword`). |
| **Nome e Ícone do App Personalizado** | Customizados via JSON nativo (`app.json`). Ícone estilizado e adaptado para Android/iOS, com Splash Screen responsiva e ícone específico em branco/transparente para as Notificações Push na barra de status. |
| **Persistência de Dados** | Arquitetura online híbrida combinando armazenamento relacional em nuvem no **Firebase Cloud Firestore** e cache local de preferências no **AsyncStorage**. |
| **No mínimo 2 operações CRUD** | Implementado um **CRUD Completo (Create, Read, Update, Delete)** de extrema complexidade para gestão do ciclo das plantas e gestão do usuário. |
| **Desenvolvimento em React Native + Expo** | Projeto inteiramente estruturado em TypeScript utilizando o ecossistema Expo, com pacotes nativos configurados e compilação em nuvem via EAS. |

---

## 4. Engenharia de Software e Arquitetura do CRUD

O ciclo CRUD do Sementha foi desenvolvido utilizando padrões modernos de reatividade e isolamento de estado:

* **CREATE (Inserção de Dados):** Localizado na tela `NewPlant`. Captura textos, converte tipos numéricos de forma estrita para o cálculo de frequências e salva o documento na coleção do Firestore referenciando o `userId` do dono da planta, gravando também um *timestamp* universal (`createdAt`).
* **READ (Leitura e Sincronização Reativa via WebSockets):** Localizado nas telas `MyPlants`, `Home` e `Tasks`. Não utiliza *fetches* únicos obsoletos. Utiliza o ouvinte `onSnapshot` do Firebase, criando um túnel de dados em tempo real. Qualquer alteração externa atualiza instantaneamente a interface do aplicativo sem recarregar a tela.
* **UPDATE (Modificação Estruturada):** Aplicado em dois cenários independentes: na tela `EditPlant` (para edição completa do cadastro via `updateDoc`) e na tela `PlantDetails` (mutações atômicas de apenas um campo no banco de dados ao clicar em botões de "Regar" ou "Adubar").
* **DELETE (Remoção Segura):** Localizado na tela `PlantDetails`. O sistema exige uma dupla confirmação (Alert nativo destrutivo) antes de acionar o método `deleteDoc` para expurgar a planta do banco de dados em nuvem.

---

## 5. Arquitetura e Navegação de Telas

O aplicativo gerencia o fluxo através do `@react-navigation/native-stack`, mantendo um histórico linear e seguro:

1. **Login:** Gerencia e-mail/senha com feedback visual e destrói o histórico ao autenticar, definindo a Dashboard como nova raiz.
2. **Register:** Criação de conta no Firebase Auth com `updateProfile` instantâneo.
3. **ForgotPassword:** Disparo de e-mail de recuperação direto pelos servidores do Firebase.
4. **Home:** Dashboard analítico, Card de Clima Dinâmico (GPS) e sumário matemático de regas diárias.
5. **MyPlants:** Listagem em grid duplo com 5 lógicas de filtros diferentes (Ordem, Nome, Urgência, Frequência, Categoria) e barra de busca reativa.
6. **PlantDetails:** Exibição da foto, histórico de todos os últimos cuidados gerados por *timestamps* e ações de mutação, além do botão de exportação.
7. **NewPlant:** Formulário com validações, `KeyboardAvoidingView` nativo e recurso de auto preenchimento via base externa.
8. **EditPlant:** Carregamento dinâmico e seguro para alteração das características da planta já registrada.
9. **Tasks:** Motor lógico avançado que divide a coleção em categorias (Rega, Adubo, Substrato), calculando quantos dias faltam para a próxima atividade e destacando tarefas vencidas/urgentes.
10. **Profile:** Configuração de Horário Pessoal das Notificações Push, chave do Tema Escuro e exclusão permanente de conta (`deleteUser`).

---

## 6. Diferenciais e Requisitos Opcionais (Avançados)

Para demonstrar proficiência técnica e elevar o projeto ao status de aplicação de mercado, **implementamos com sucesso quase todos os requisitos opcionais propostos**, além de diversos outros diferenciais arquiteturais que atestam a qualidade do software.

Abaixo estão os opcionais cumpridos nas exatas definições solicitadas:

✅ **Mapas e geolocalização:**
Implementado de forma inteligente na tela inicial. Utilizando a biblioteca nativa `expo-location`, o aplicativo solicita permissão de GPS em segundo plano, captura a Latitude e Longitude exatas do usuário e realiza um processo de "Engenharia Reversa de Geocodificação" (*reverseGeocodeAsync*) para converter as coordenadas em formato legível, descobrindo o nome da cidade atual.

✅ **Criar uma API online para persistência dos dados ou utilizar o Firebase:**
Foi projetada uma infraestrutura backend robusta utilizando dois módulos do **Firebase**: o *Firebase Authentication* (garantindo login criptografado) e o *Cloud Firestore* (banco de dados em nuvem NoSQL responsável por manter todo o CRUD das plantas seguro, escalável e disponível online de qualquer dispositivo).

✅ **Integração com alguma API externa (Clima, chat gpt, etc.):**
Realizamos integrações duplas de alta complexidade:
1. **API Open-Meteo (Clima):** O app cruza as coordenadas do GPS com o endpoint da Open-Meteo, retornando a temperatura ao vivo em graus Celsius e o código climático atual, que o app converte em dicas ambientais automáticas ("Tempo seco" vs "Vai chover").
2. **API Botânica Internacional:** Utilizada na tela de Cadastro. Como as grandes bases botânicas são estrangeiras, o app consome os dados assíncronos de espécies, realiza um complexo **tratamento e tradução de dados**, adaptando informações científicas para frequências numéricas de rega e substrato perfeitamente inteligíveis em português para o usuário.

✅ **Salvar informações em arquivo (gerar pdf ou arquivo de texto):**
Cumprido através da integração conjunta dos pacotes `expo-print` e `expo-sharing`. O aplicativo processa as informações em nuvem, injeta variáveis dinâmicas do React em um código-fonte HTML *inline* desenhado para impressão e compila nativamente um **Documento PDF Profissional**, abrindo a gaveta de compartilhamento do Android/iOS para salvar no aparelho, mandar no WhatsApp ou imprimir.

✅ **Publicar o App na loja:**
Para garantir que o aplicativo saísse do ambiente de desenvolvimento restrito e estivesse disponível globalmente como um software de mercado, configuramos o ambiente para compilação em nuvem via **EAS (Expo Application Services)**. O projeto foi integralmente submetido, *buildado* em servidores na nuvem e empacotado em um arquivo `.apk` final, estando formalmente "publicado" e distribuído com link direto de acesso (detalhes na Seção 10).

### 🚀 Outros Diferenciais Inovadores Implementados:
Além dos opcionais oficiais, fomos além ao aplicar os seguintes diferenciais:

* **Gerenciamento Global Dinâmico de Temas (Dark/Light Mode):** A arquitetura do app foi refatorada com a implementação da `Context API` do React (Cérebro Global de Temas). Através de um *switch* no Perfil, toda a paleta hexadecimal do aplicativo é invertida simultaneamente em todas as telas, com a preferência sendo salva fisicamente na memória interna (`AsyncStorage`).
* **Notificações Push com Agendamento Nativo e Algoritmo Preditivo:** O app não apenas manda mensagens: ele lê o banco de dados, utiliza lógica matemática avançada para calcular os dias restantes para o cuidado de cada planta, limpa o *cache* de mensagens do Android e programa na memória física do hardware alarmes rigorosos baseados na preferência de horário do usuário.
* **Acessibilidade, UX e Heurísticas de Nielsen:** Interface altamente polida que segue o Modelo POUR de acessibilidade. Prevenção severa de erros duplos via travas lógicas e botões de `ActivityIndicator`. Uso de `KeyboardAvoidingView` nativo em todos os formulários para impedir que o teclado tampe a tela durante a digitação.

---

## 7. Stack Tecnológica e Dependências

* **React Native (v0.74+):** Framework principal de renderização.
* **Expo SDK (v51.0+):** Plataforma de desenvolvimento gerenciada para APIs nativas.
* **TypeScript:** Tipagem estática severa e construção de Interfaces de Dados (`PlantProps`).
* **Firebase (Authentication & Cloud Firestore):** Infraestrutura de backend e banco de dados NoSQL.
* **React Navigation (Native Stack):** Orquestração completa de rotas, resets e passagens de parâmetros entre telas.
* **Expo Location:** Captura de GPS e Geocodificação reversa.
* **Expo Notifications:** Criação de canais de background e disparo de alarmes push locais.
* **Expo Print & Expo Sharing:** Renderização HTML-to-PDF e comunicação com *Intents* de arquivos do Android/iOS.
* **AsyncStorage:** Banco de dados chave-valor leve do aparelho.

---

## 8. Estrutura Organizacional de Pastas

```text
sementha/
├── assets/                    # Identidade Visual, Ícone (Adaptive), Splash Screen
├── src/                       # Código-Fonte Principal
│   ├── components/            # Componentes Atômicos Reutilizáveis (Button, Input, Logo, PlantCard)
│   ├── contexts/              # Estado Global (ThemeContext com Context API)
│   ├── routes/                # Container de Navegação e Configurações de Stack
│   ├── screens/               # Controladores Lógicos (Login, Home, MyPlants, PDF, Formulários)
│   ├── services/              # Camada de Integrações (Firebase Auth/DB, Clima, Notifications)
│   ├── theme/                 # Design System Base (Paletas Light/Dark, Tipografia, Espaçamentos)
│   └── types/                 # Interfaces de Tipagem Rígida TypeScript
├── app.json                   # Propriedades de Metadados e Permissões do Android/iOS
├── App.tsx                    # Ponto de Entrada, Provedor de Temas e Loader de Fontes
└── package.json               # Ecossistema de Bibliotecas e Dependências Node
```

## 9. Manual de Instalação e Execução

### 📋 Pré-requisitos

Antes de iniciar a execução do projeto, é necessário possuir:

* Node.js instalado (recomendado versão LTS)
* Gerenciador de pacotes `npm` ou `yarn`
* Aplicativo **Expo Go** instalado no smartphone

---

### 🚀 Passo a Passo

#### 1. Clonar o Repositório

```bash
git clone https://github.com/SEU_USUARIO/Sementha-App.git
cd Sementha-App
```

#### 2. Instalar Dependências

```bash
npm install
```

#### 3. Executar o Servidor de Desenvolvimento

```bash
npx expo start -c
```

#### 4. Rodar no Dispositivo

Após iniciar o Expo, será exibido um QR Code no terminal.

* No **iOS**, utilize a câmera do aparelho
* No **Android**, utilize o aplicativo Expo Go

Escaneie o QR Code para abrir o aplicativo instantaneamente no smartphone.

---

## 10. Disponibilização do APK de Produção

O projeto foi devidamente finalizado, empacotado e disponibilizado de forma autônoma fora do ambiente de desenvolvimento, garantindo seu funcionamento como uma aplicação de produção convencional e atendendo ao requisito de publicação.

O instalador binário nativo (`.apk`) encontra-se hospedado na nuvem oficial da Expo:

### 📥 Download Oficial do APK — Sementha

https://expo.dev/accounts/ryancandeu/projects/Sementha/builds/c2ac98ee-b2b4-43d9-ad4b-e261da502606

### 📱 Nota de Instalação

Por se tratar de um aplicativo instalado diretamente da nuvem dos desenvolvedores, e não pela Google Play Store, poderá ser necessário habilitar a opção:

> **“Permitir instalação de fontes desconhecidas”**

nas configurações de segurança do navegador ou dispositivo Android utilizado.

---

## 11. Conclusão e Critérios de Qualidade

O aplicativo **Sementha** transcende os requisitos essenciais de uma atividade acadêmica, posicionando-se como uma solução mobile completa, organizada e escalável.

A integração entre:

* Consumo de APIs externas
* Geolocalização em tempo real
* Persistência em nuvem
* Sistema de notificações
* Exportação de relatórios em PDF

demonstra domínio prático de conceitos modernos de Desenvolvimento Mobile e Engenharia de Software.

Além disso, toda a aplicação foi estruturada utilizando separação modular de responsabilidades, componentização reutilizável e arquitetura escalável, facilitando futuras manutenções e expansões do sistema.

---


