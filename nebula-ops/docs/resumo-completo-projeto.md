# Orbital Guardian - Resumo Completo do Projeto

## 1. Visao Geral

O **Orbital Guardian** e um prototipo academico desenvolvido para a Global Solution da FIAP. A proposta e simular uma central operacional de monitoramento ambiental com foco em riscos de queimadas, eventos climaticos extremos, sensores ambientais, alertas e apoio a tomada de decisao.

O projeto se relaciona ao tema integrador de solucoes baseadas no ecossistema espacial e ambiental, usando dados climaticos, monitoramento de regioes, risco de propagacao de fogo e analise visual simulada por inteligencia artificial.

O sistema foi construido como um MVP funcional em **React + Vite**, com interface escura, responsiva e com identidade visual tecnologica.

## 2. Objetivo do Projeto

O objetivo do Orbital Guardian e ajudar operadores ambientais, defesa civil e equipes de emergencia a:

- acompanhar regioes vulneraveis;
- identificar risco de queimadas;
- priorizar alertas criticos;
- consultar sensores ambientais;
- visualizar dados climaticos;
- simular analise visual por IA;
- registrar historico de ocorrencias;
- gerar recomendacoes operacionais;
- proteger dados sensiveis com controles basicos de ciberseguranca.

O projeto nao depende de backend real para funcionar como demonstracao academica. Ele usa estado local, dados simulados e algumas integracoes publicas para enriquecer o prototipo.

## 3. Tecnologias Utilizadas

- React
- Vite
- React Router DOM
- Tailwind CSS
- Context API
- Web Crypto API
- APIs publicas externas
- Armazenamento local do navegador: `localStorage` e `sessionStorage`

Arquivos principais de configuracao:

- `package.json`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`

## 4. Estrutura Principal do Projeto

```txt
nebula-ops/
  docs/
    modulo-ciberseguranca.md
    resumo-completo-projeto.md

  src/
    components/
      AppLayout.jsx
      BottomNav.jsx
      ErrorBoundary.jsx
      Icon.jsx
      SideNav.jsx
      TopBar.jsx

    context/
      AppDataContext.jsx
      AuthContext.jsx

    data/
      orbitalData.js

    lib/
      orbital.js

    pages/
      ActiveAlerts.jsx
      AIAnalysis.jsx
      AlertDetails.jsx
      Dashboard.jsx
      EmergencyAction.jsx
      Login.jsx
      MonitoredRegions.jsx
      OperatorProfile.jsx
      RadarMap.jsx
      RegionDetails.jsx
      Reports.jsx
      SensorDetails.jsx
      SensorNetwork.jsx
      Settings.jsx
      SystemLogs.jsx

    security/
      auditLogger.js
      cryptoService.js
      securityREADME.md
      validators.js

    services/
      cemadenService.js
      cepService.js
      geocodingService.js
      inpeService.js
      weatherService.js

    App.jsx
    index.css
    main.jsx
```

## 5. Fluxo Geral do App

O usuario acessa a tela de login e pode:

- entrar com uma conta local;
- criar uma conta propria;
- acessar a demonstracao.

Depois de autenticado, o usuario entra no dashboard e pode navegar entre as principais telas:

- Dashboard;
- Regioes monitoradas;
- Alertas;
- Sensores;
- Mapa operacional;
- Analise visual por IA;
- Historico;
- Recomendacoes;
- Perfil;
- Configuracoes.

As telas internas sao protegidas por autenticacao local. Se o usuario nao estiver autenticado, ele e redirecionado para a tela de login.

## 6. Funcionalidades Implementadas

### 6.1 Login e Cadastro

A tela de login permite:

- login com e-mail e senha;
- criacao de conta local;
- acesso demonstrativo;
- validacao de e-mail;
- validacao de senha minima;
- confirmacao de senha no cadastro;
- exibicao de mensagens de erro;
- loading durante autenticacao;
- criptografia do e-mail;
- hash da senha;
- logs de auditoria.

Arquivos relacionados:

- `src/pages/Login.jsx`
- `src/context/AuthContext.jsx`
- `src/security/cryptoService.js`
- `src/security/validators.js`
- `src/security/auditLogger.js`

### 6.2 Dashboard

O dashboard apresenta uma visao geral da operacao:

- saudacao ao operador;
- ultima atualizacao;
- risco ambiental geral;
- regioes com risco oficial;
- regioes com risco meteorologico elevado;
- regioes em simulacao;
- sensores online;
- alertas recentes;
- atalhos para as principais telas.

Arquivo:

- `src/pages/Dashboard.jsx`

### 6.3 Regioes Monitoradas

A tela de regioes permite:

- cadastrar regioes por CEP;
- buscar regioes;
- filtrar por risco;
- sincronizar clima real;
- visualizar informacoes climaticas;
- abrir detalhes da regiao;
- aplicar simulacoes operacionais.

Arquivos:

- `src/pages/MonitoredRegions.jsx`
- `src/pages/RegionDetails.jsx`
- `src/context/AppDataContext.jsx`

### 6.4 Alertas

A tela de alertas permite:

- visualizar alertas ativos;
- buscar por titulo ou regiao;
- filtrar por prioridade;
- filtrar por status;
- filtrar por regiao;
- abrir detalhes do alerta;
- alterar status do alerta;
- acionar modo emergencial em alertas criticos.

Status possiveis:

- Novo;
- Em analise;
- Em atendimento;
- Monitorando;
- Resolvido.

Arquivos:

- `src/pages/ActiveAlerts.jsx`
- `src/pages/AlertDetails.jsx`
- `src/pages/EmergencyAction.jsx`

### 6.5 Sensores

A tela de sensores permite:

- listar sensores ambientais;
- buscar por nome, tipo ou regiao;
- filtrar por status;
- filtrar por regiao;
- simular nova leitura;
- destacar sensores criticos;
- abrir detalhes do sensor.

Tipos de sensores usados no prototipo:

- temperatura;
- umidade;
- vento;
- fumaca.

Arquivos:

- `src/pages/SensorNetwork.jsx`
- `src/pages/SensorDetails.jsx`

### 6.6 Analise Visual por IA

A tela de analise visual simula uma futura integracao com Python/OpenCV.

Ela permite:

- simular nova analise;
- alternar entre resultados visuais;
- exibir nivel de confianca;
- mostrar risco visual;
- exibir alerta relacionado;
- acessar o alerta vinculado.

Resultados simulados:

- Sem risco visual;
- Fumaca provavel detectada;
- Fogo provavel detectado.

Arquivo:

- `src/pages/AIAnalysis.jsx`

### 6.7 Historico Operacional

A tela de historico mostra:

- ocorrencias anteriores;
- eventos de sincronizacao;
- eventos automaticos;
- eventos simulados;
- filtros por regiao;
- filtros por prioridade;
- filtros por origem;
- busca por ocorrencia.

Arquivo:

- `src/pages/SystemLogs.jsx`

### 6.8 Recomendacoes

A tela de recomendacoes exibe acoes operacionais sugeridas pelo sistema.

Ela permite:

- visualizar recomendacoes pendentes;
- visualizar recomendacoes concluidas;
- filtrar por prioridade;
- marcar recomendacoes como concluidas;
- reabrir recomendacoes.

Arquivo:

- `src/pages/Reports.jsx`

### 6.9 Perfil

A tela de perfil mostra:

- nome do operador;
- e-mail;
- perfil;
- ID;
- informacoes do app;
- botao para sair;
- evidencia de criptografia do e-mail.

Arquivo:

- `src/pages/OperatorProfile.jsx`

### 6.10 Mapa Operacional

O mapa operacional simula uma tela de radar para visualizar regioes monitoradas.

Ele apresenta:

- pontos de regioes;
- risco operacional;
- destaque para simulacoes;
- destaque para risco critico;
- legenda visual.

Arquivo:

- `src/pages/RadarMap.jsx`

## 7. Dados do Sistema

Os dados principais ficam centralizados em:

- `src/data/orbitalData.js`
- `src/context/AppDataContext.jsx`

O app trabalha com:

- usuario demonstrativo;
- regioes;
- sensores;
- alertas;
- historico;
- recomendacoes;
- analises visuais;
- simulacoes;
- dados climaticos;
- risco oficial;
- estado local.

O usuario demonstrativo e:

```txt
Nome: Operador Ambiental
Perfil: Analista
E-mail: demo@orbitalguardian.com
```

## 8. APIs e Integracoes Externas

O projeto usa algumas fontes externas reais para enriquecer o prototipo.

### 8.1 ViaCEP

Servico usado para buscar dados de endereco a partir do CEP.

Arquivo:

- `src/services/cepService.js`

Funcao principal:

```js
getAddressByCep(rawCep)
```

Uso no app:

- cadastro de regiao por CEP;
- identificacao de cidade, bairro, estado e logradouro.

### 8.2 Open-Meteo Geocoding

Servico usado para transformar cidade e estado em coordenadas.

Arquivo:

- `src/services/geocodingService.js`

Funcao principal:

```js
getCoordinatesForBrazilianAddress(address)
```

Uso no app:

- obter latitude e longitude da regiao cadastrada.

### 8.3 Open-Meteo Forecast

Servico usado para buscar dados climaticos reais.

Arquivo:

- `src/services/weatherService.js`

Funcao principal:

```js
getCurrentWeather(latitude, longitude)
```

Dados retornados:

- temperatura;
- sensacao termica;
- umidade;
- vento;
- rajadas;
- chuva;
- precipitacao;
- visibilidade;
- pressao;
- umidade do solo;
- indice UV;
- codigo climatico.

### 8.4 INPE Queimadas

Servico usado para consultar focos de queimadas em CSV publico do INPE.

Arquivo:

- `src/services/inpeService.js`

Funcoes principais:

```js
getLatestInpeFocusDataset()
getInpeOfficialRiskForRegion(region, dataset)
```

Uso no app:

- buscar focos recentes;
- calcular distancia entre foco e regiao;
- classificar risco oficial por proximidade.

### 8.5 CEMADEN

O CEMADEN nao fornece, nesse produto de fogo, uma API JSON simples. Ele publica uma pagina oficial com imagens de risco de propagacao de fogo.

O app valida e usa as imagens oficiais:

- Cenario medio GEFS;
- Cenario extremo GEFS;
- Cenario deterministico ETA.

Arquivo:

- `src/services/cemadenService.js`

Funcoes principais:

```js
getCemadenSnapshot()
getCemadenOfficialRiskForRegion(region, snapshot)
```

O risco local e calculado com base no criterio publicado pelo CEMADEN:

- temperatura acima de 30 graus;
- umidade abaixo de 30%;
- vento acima de 15 km/h.

## 9. Regras de Risco

O app calcula risco ambiental combinando:

- alertas ativos;
- risco climatico;
- risco oficial;
- simulacoes;
- dados dos sensores.

Niveis usados:

- Baixo;
- Medio;
- Alto;
- Critico.

Exemplo de regra climatica:

- temperatura maior ou igual a 35;
- umidade menor ou igual a 25;
- vento maior ou igual a 20;
- resultado: risco critico.

## 10. Modulo de Ciberseguranca

O projeto possui um modulo de ciberseguranca implementado conforme a atividade da FIAP.

Pasta:

```txt
src/security/
```

Arquivos:

- `cryptoService.js`
- `validators.js`
- `auditLogger.js`
- `securityREADME.md`

Documento tecnico:

- `docs/modulo-ciberseguranca.md`

### 10.1 Implementacao Pratica Escolhida

A implementacao pratica escolhida foi:

```txt
Criptografia em um campo sensivel do projeto.
```

O campo sensivel escolhido foi:

```txt
E-mail do operador.
```

### 10.2 Criptografia

O e-mail do operador e criptografado antes de ser salvo no navegador.

Tecnologia usada:

- Web Crypto API;
- AES-GCM.

Formato do valor criptografado:

```txt
og:v1:IV_BASE64:DADO_CRIPTOGRAFADO_BASE64
```

Arquivo:

- `src/security/cryptoService.js`

Funcoes:

```js
encryptData(value)
decryptData(encryptedValue)
```

### 10.3 Hash de Senha

Ao criar conta, a senha nao e salva em texto puro.

O app salva apenas um hash da senha usando:

- PBKDF2;
- salt aleatorio;
- SHA-256;
- 120000 iteracoes.

Funcoes:

```js
createPasswordHash(password)
verifyPasswordHash(password, storedHash)
```

Formato do hash:

```txt
ogpwd:v1:ITERACOES:SALT_BASE64:HASH_BASE64
```

### 10.4 Validacoes

Arquivo:

- `src/security/validators.js`

Funcoes:

```js
validateEmail(email)
validatePassword(password)
validateRequired(value)
validateMaxLength(value, max)
sanitizeText(value)
validateSafeText(value, max)
```

As validacoes sao usadas no login e no cadastro.

### 10.5 Logs de Auditoria

Arquivo:

- `src/security/auditLogger.js`

Funcao:

```js
logSecurityEvent(eventType, description)
```

Eventos registrados:

- login realizado;
- logout;
- conta criada;
- acesso negado;
- erro de validacao;
- dado sensivel criptografado;
- dado sensivel descriptografado;
- erro de descriptografia;
- cadastro negado;
- login negado.

Os logs aparecem no console com:

```txt
[SecurityAudit]
```

Tambem sao mantidos em `sessionStorage` durante a sessao.

### 10.6 Protecao de Rotas

As telas internas sao protegidas por `ProtectedRoute` em:

- `src/App.jsx`

Se o usuario nao estiver autenticado, ele e enviado para a tela de login.

### 10.7 Error Boundary

Foi criado um componente para evitar tela branca caso algum estado local antigo ou corrompido gere erro no app.

Arquivo:

- `src/components/ErrorBoundary.jsx`

Ele exibe uma tela de recuperacao com botao para limpar sessao local e reabrir o app.

## 11. Riscos e Ameacas Considerados

Metodologia usada: STRIDE simplificado.

| Ativo critico | Ameaca | Categoria STRIDE | Impacto | Mitigacao |
| --- | --- | --- | --- | --- |
| Aplicativo web | Acesso nao autorizado | Spoofing | Usuario indevido pode acessar telas internas | Login local e rotas protegidas |
| Dados do usuario | Vazamento de e-mail | Information Disclosure | Exposicao de dado pessoal | Criptografia AES-GCM |
| Senha do usuario | Exposicao da senha | Information Disclosure | Comprometimento da conta | Hash PBKDF2 com salt |
| Modulo de alertas | Manipulacao indevida | Tampering | Status de ocorrencias pode ser alterado incorretamente | Historico e logs |
| Armazenamento local | Dados corrompidos | Tampering | Falha no app ou sessao invalida | Validacao, tratamento de erro e Error Boundary |
| API futura | Falha de disponibilidade ou DDoS | Denial of Service | App pode ficar sem dados atualizados | Fallback, logs e recomendacao de hardening |

## 12. Relacao com ODS

O projeto se relaciona principalmente com:

### ODS 9 - Industria, Inovacao e Infraestrutura

O app simula uma infraestrutura digital de monitoramento ambiental, integrando dados climaticos, alertas e seguranca.

### ODS 11 - Cidades e Comunidades Sustentaveis

O sistema apoia a gestao de risco em regioes vulneraveis, contribuindo para comunidades mais resilientes.

### ODS 13 - Acao Contra a Mudanca Global do Clima

O projeto contribui com monitoramento de eventos climaticos, queimadas e riscos ambientais.

## 13. Como Executar o Projeto

Entre na pasta do projeto:

```bash
cd c:\Users\Usuario\Desktop\app-gs\nebula-ops
```

Instale as dependencias, se necessario:

```bash
npm install
```

Rode o app:

```bash
npm run dev
```

Acesse:

```txt
http://127.0.0.1:5173
```

Para gerar build:

```bash
npm run build
```

## 14. Como Testar o Fluxo de Ciberseguranca

1. Abra o app.
2. Clique em `Criar conta`.
3. Informe nome, e-mail e senha.
4. Confirme a senha.
5. Clique em `Criar conta`.
6. Abra o console do navegador.
7. Verifique os logs `[SecurityAudit]`.
8. Acesse a tela `Perfil`.
9. Confira o e-mail descriptografado em memoria.
10. Confira o e-mail criptografado exibido na tela.
11. Abra o DevTools.
12. Veja `sessionStorage.nebula_ops_session`.
13. Veja `localStorage.orbital_guardian_accounts`.
14. Confirme que existe `encryptedEmail`.
15. Confirme que existe `passwordHash`.

## 15. Evidencias Recomendadas Para Entrega

Prints recomendados:

- tela de login;
- tela de criar conta;
- erro de validacao no login;
- console com `[SecurityAudit]`;
- tela de perfil mostrando o e-mail criptografado;
- `sessionStorage` mostrando `encryptedEmail`;
- `localStorage` mostrando `passwordHash`;
- dashboard carregado depois do login;
- tela de regioes;
- tela de alertas;
- tela de sensores;
- tela de analise visual;
- tela de recomendacoes;
- terminal com `npm run build` finalizado com sucesso.

## 16. Arquivos Importantes Para Apresentacao

Resumo completo:

- `docs/resumo-completo-projeto.md`

Documento de cyber:

- `docs/modulo-ciberseguranca.md`

README de cyber:

- `src/security/securityREADME.md`

Projeto original:

- `projeto.md`

Pedido de cyber:

- `../ciber.md`

## 17. Pontos Fortes do Projeto

- Prototipo funcional em React;
- navegacao completa;
- login e cadastro local;
- criptografia de dado sensivel;
- senha com hash;
- logs de auditoria;
- APIs publicas reais;
- simulacoes operacionais;
- foco claro em risco de queimadas;
- documentacao tecnica pronta;
- interface escura e profissional;
- build validado;
- `.gitignore` criado para GitHub.

## 18. Limitacoes do MVP

Como e um prototipo academico, algumas partes sao simplificadas:

- nao existe backend real;
- nao existe banco de dados real;
- a autenticacao e local;
- a chave de demonstracao fica no frontend;
- a IA/OpenCV e simulada;
- notificacoes push sao simuladas ou nao implementadas;
- o CEMADEN e usado como fonte visual oficial, nao como JSON estruturado.

Essas limitacoes estao documentadas e fazem sentido para o escopo da Global Solution.

## 19. Melhorias Futuras

Possiveis evolucoes:

- backend real;
- banco de dados;
- autenticacao com JWT;
- controle de permissoes por perfil;
- API propria para regioes e alertas;
- integracao real com IA/OpenCV;
- notificacoes push;
- dashboard administrativo;
- deploy em nuvem;
- logs enviados para backend;
- uso de cofre de segredos;
- mapa real com coordenadas;
- monitoramento em tempo real.

## 20. Conclusao

O Orbital Guardian e um MVP academico completo para demonstrar uma solucao de monitoramento ambiental com foco em queimadas e riscos climaticos. O projeto combina dados simulados, integracoes publicas, visual operacional, controle de alertas, sensores, analise visual simulada e modulo de ciberseguranca.

Com as implementacoes atuais, o app esta pronto para ser apresentado como uma solucao funcional, organizada e alinhada a proposta da Global Solution da FIAP.

