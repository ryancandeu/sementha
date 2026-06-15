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
* **Ações Atômicas e Zero-Friction UX:** Dentro dos detalhes de cada espécime, botões com feedbacks visuais registram instantaneamente a realização de uma Rega, Adubagem ou Troca de Substrato. O app atualiza o banco de dados em segundo plano e a interface em tempo real, sem gerar alertas obstrusivos na tela.
* **Orquestrador Nativo de Notificações Locais:** O aplicativo calcula de forma preditiva as próximas datas de atenção e programa alarmes no sistema operacional do celular. O usuário define o horário que deseja ser notificado no seu perfil.
* **Compilador e Exportador de Fichas Técnicas em PDF:** Geração automática sob demanda de documentos estruturados em HTML e conversão nativa para formato PDF.
* **Gerenciamento Global Dinâmico de Temas (Light/Dark Mode):** Alternância completa de tokens visuais em tempo real, recalculando taxas de contraste.
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

Para demonstrar proficiência técnica e elevar o projeto ao status de aplicação de mercado, implementamos com sucesso grande parte dos requisitos opcionais propostos pelo escopo da disciplina, indo além do básico para garantir um software robusto:

✅ **Mapas e geolocalização** Implementado de forma inteligente na tela inicial. Utilizando a biblioteca nativa `expo-location`, o aplicativo solicita permissão de GPS em segundo plano, captura a Latitude e Longitude exatas do usuário e realiza um processo avançado de "Engenharia Reversa de Geocodificação" (*reverseGeocodeAsync*) para converter as coordenadas em formato legível, descobrindo e exibindo o nome da cidade/região atual do usuário.

✅ **Criar uma API online para persistência dos dados ou utilizar o Firebase** Foi projetada uma infraestrutura backend robusta utilizando dois módulos do **Firebase**: o *Firebase Authentication* (garantindo login criptografado) e o *Cloud Firestore* (banco de dados em nuvem NoSQL responsável por manter todo o CRUD das plantas seguro, em tempo real, escalável e disponível online através de qualquer dispositivo).

✅ **Integração com alguma API externa (Clima, chat gpt, etc.)** Realizamos integrações simultâneas de extrema complexidade com duas APIs distintas:
1. **API Open-Meteo (Clima ao vivo):** O app cruza as coordenadas do GPS com o endpoint meteorológico global, retornando a temperatura exata e o código climático, convertendo isso em dicas dinâmicas na interface ("Tempo seco" vs "Vai chover").
2. **API Botânica Internacional (Tratamento e Tradução de Dados):** Na tela de cadastro, o app se conecta a uma base botânica mundial. Como os dados originais são fornecidos em inglês técnico, **o Sementha implementa uma camada de tratamento e tradução em tempo real**. O aplicativo consome a resposta JSON, interpreta terminologias botânicas estrangeiras, e as converte matematicamente para frequências exatas (em dias) e descrições formatadas em português, criando um *auto preenchimento* inteligente.

✅ **Salvar informações em arquivo (gerar pdf ou arquivo de texto)** A funcionalidade de exportação foi garantida unindo as bibliotecas `expo-print` e `expo-sharing`. O sistema captura os dados em nuvem, injeta as variáveis reativas em um código-fonte HTML *inline* profissional e renderiza, nativamente no dispositivo, uma **Ficha Técnica em PDF**. Em seguida, invoca a gaveta de compartilhamento do Android/iOS.

✅ **Publicar o App na loja** Para atestar que o aplicativo consegue operar de maneira totalmente independente do ambiente de desenvolvimento (Expo Go), configuramos a plataforma em nuvem **EAS (Expo Application Services)**. O projeto foi compilado remotamente em servidores de alta performance, empacotado em um executável nativo oficial e está formalmente "publicado" via link de download contínuo (detalhado na Seção 10).

### 🚀 Outros Opcionais e Inovações Arquiteturais:
Além dos requisitos listados, expandimos o projeto com implementações de alto nível visual e performático:

* ✅ **Adequação ao Material Design 3 (M3):** Refatoração da UI para atender às rigorosas diretrizes do Google. Uso de componentes como *Elevated Cards* para listagem, implementação de mídia *Full-Bleed* e alinhamento tipográfico baseados em fluidez e escaneabilidade.
* ✅ **Otimização de Performance (Memory Cache):** Implementação de cache de memória local para o carregamento nativo de *assets* (como ícones de interface e logos globais), eliminando delays de re-renderização (*flickering*) na navegação entre as pilhas do app.
* ✅ **Gerenciamento Global Dinâmico de Temas:** Arquitetura envelopada na `Context API` do React. Através de um *switch* de configurações, toda a interface alterna suas paletas hexadecimais simultaneamente (Dark/Light Mode), persistindo a escolha no `AsyncStorage`.
* ✅ **Notificações Push com Agendamento Nativo:** O app calcula preditivamente as datas de cuidado via motor matemático interno e agenda localmente alarmes silenciosos blindados contra falhas de conexão.
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