# Documento Final - Testing, Compliance & Quality Assurance

## Capa

**Projeto:** Orbital Guardian  
**Disciplina:** Testing, Compliance & Quality Assurance  
**Entrega:** Global Solution FIAP  
**Tema:** Seguranca Cibernetica em Solucoes Baseadas no Ecossistema Espacial  
**Grupo:** [preencher nome do grupo]  
**Integrantes e RM:**  

| Integrante | RM |
| --- | --- |
| [Nome do integrante 1] | [RM] |
| [Nome do integrante 2] | [RM] |
| [Nome do integrante 3] | [RM] |
| [Nome do integrante 4] | [RM] |
| [Nome do integrante 5] | [RM] |

**Link do video pitch no YouTube:** [inserir link nao listado]

---

## 1. Breve Descritivo do Projeto

O **Orbital Guardian** e um prototipo academico de monitoramento ambiental voltado a identificacao e priorizacao de regioes de risco, especialmente queimadas e eventos climaticos extremos. A solucao simula uma central operacional capaz de organizar dados ambientais, exibir alertas, acompanhar sensores, consultar regioes monitoradas e apoiar decisoes preventivas.

O problema tratado pelo projeto e a dificuldade de monitorar, interpretar e priorizar riscos ambientais em tempo adequado, principalmente em regioes vulneraveis a queimadas, baixa umidade, calor extremo e propagacao de fogo. O sistema serve como uma interface de apoio para operadores, orgaos responsaveis e equipes de resposta, permitindo visualizar dados, alertas e recomendacoes de forma centralizada.

O escopo atual e um **prototipo academico** em React/Vite, com dados simulados, armazenamento local, modulo de ciberseguranca e algumas integracoes publicas de apoio, como ViaCEP, Open-Meteo, INPE Queimadas e imagens oficiais do CEMADEN. Nao ha backend real, banco de dados real, IoT fisico obrigatorio ou integracao direta com satelites nesta etapa.

O projeto se conecta ao tema da Global Solution por usar uma abordagem inspirada no ecossistema espacial e ambiental, considerando dados climaticos, territoriais e de risco para apoiar a prevencao de desastres e a seguranca de informacoes sensiveis.

---

## 2. Arquitetura de Solucao

O Orbital Guardian foi estruturado como uma aplicacao web responsiva com foco em operacao ambiental. A arquitetura atual e composta por:

- interface web em React;
- rotas protegidas por autenticacao local;
- Context API para estado da aplicacao;
- dados simulados e derivados;
- servicos para APIs publicas;
- modulo de ciberseguranca;
- armazenamento local do navegador.

Como proposta futura, a arquitetura pode evoluir para:

- API em nuvem;
- banco de dados persistente;
- servico real de autenticacao;
- integracao com dispositivos IoT;
- integracao com pipelines de dados satelitais;
- logs centralizados;
- monitoramento e backup em nuvem.

---

## 3. Visao da Arquitetura no Padrao TOGAF com ArchiMate

### 3.1 Stakeholders

| Stakeholder | Interesse no projeto |
| --- | --- |
| Usuario comum | Consultar alertas, recomendacoes e informacoes preventivas. |
| Defesa Civil ou orgao responsavel | Acompanhar areas criticas e apoiar a resposta a riscos ambientais. |
| Administradores da solucao | Gerenciar parametros, dados e regras da plataforma. |
| Equipe tecnica | Manter, evoluir e integrar a solucao com APIs e infraestrutura futura. |
| Comunidade em regiao de risco | Receber informacoes que apoiem prevencao e resposta a eventos ambientais. |

### 3.2 Drivers

| Driver | Descricao |
| --- | --- |
| Aumento das queimadas | Crescimento de eventos ambientais exige monitoramento mais rapido e organizado. |
| Necessidade de monitoramento ambiental | Regioes vulneraveis precisam ser acompanhadas de forma continua. |
| Uso de dados espaciais/satelitais | Dados territoriais, climaticos e oficiais podem apoiar analise de risco. |
| Apoio a tomada de decisao | Equipes precisam priorizar alertas e respostas. |
| Prevencao de desastres | A antecipacao de riscos reduz impactos ambientais e sociais. |
| Seguranca da informacao | Dados de usuarios, regioes e alertas precisam de protecao minima. |

### 3.3 Objetivos e Metas

| Objetivo | Meta associada |
| --- | --- |
| Monitorar regioes de risco | Permitir cadastro, listagem e detalhamento de regioes monitoradas. |
| Exibir alertas ambientais | Apresentar alertas por prioridade, status e regiao. |
| Organizar dados ambientais | Centralizar clima, sensores, regioes, historico e recomendacoes. |
| Apoiar decisoes preventivas | Exibir recomendacoes e acao emergencial para alertas criticos. |
| Melhorar comunicacao de risco | Apresentar dashboard e telas claras para interpretacao operacional. |
| Proteger dados sensiveis | Criptografar e-mail, aplicar hash de senha e registrar logs de auditoria. |

### 3.4 Requisitos

| Requisito | Classificacao |
| --- | --- |
| Permitir login, criacao de conta local e acesso demonstrativo. | Funcional |
| Proteger telas internas por autenticacao. | Funcional / Seguranca |
| Exibir dashboard operacional. | Funcional |
| Listar regioes, alertas, sensores, historico e recomendacoes. | Funcional |
| Permitir alteracao de status de alertas. | Funcional |
| Simular analise visual por IA. | Funcional |
| Consultar APIs publicas quando disponiveis. | Funcional |
| Criptografar dado sensivel do usuario. | Seguranca |
| Validar e sanitizar entradas. | Qualidade / Seguranca |
| Funcionar como prototipo sem backend real. | Restricao / Arquitetural |

### 3.5 Constraints

| Constraint | Impacto |
| --- | --- |
| Prototipo academico | A solucao prioriza demonstracao funcional e documentacao. |
| Uso de dados simulados | Algumas informacoes nao representam operacao real em campo. |
| Sem backend real nesta etapa | Persistencia e autenticacao sao locais. |
| Sem IoT fisico obrigatorio | Sensores sao simulados ou derivados de dados climaticos. |
| Sem integracao real direta com satelites | O projeto usa APIs publicas e proposta futura para dados espaciais. |
| Limite de tempo da Global Solution | Escopo foi mantido como MVP. |
| Chave de criptografia no frontend | Adequado apenas para evidencia academica, nao para producao. |

---

## 4. Arquitetura de Negocio no Padrao TOGAF com ArchiMate

### 4.1 Processo Principal de Negocio

**Processo:** Monitoramento e resposta a risco ambiental.

O processo representa o fluxo de acompanhamento de regioes sujeitas a risco, coleta ou simulacao de dados ambientais, analise de risco, geracao de alertas e apoio a decisao preventiva.

### 4.2 Tarefas do Processo

| Ordem | Tarefa | Descricao |
| --- | --- | --- |
| 1 | Coleta ou simulacao de dados ambientais | O sistema utiliza dados simulados, APIs publicas ou leituras simuladas de sensores. |
| 2 | Analise do nivel de risco | Regras locais avaliam temperatura, umidade, vento, risco oficial e alertas. |
| 3 | Geracao de alerta | Alertas sao exibidos por prioridade e status. |
| 4 | Exibicao no aplicativo | Dashboard e telas operacionais apresentam os dados ao usuario. |
| 5 | Consulta de regioes | Operador consulta regioes cadastradas e detalhes ambientais. |
| 6 | Registro de historico | Ocorrencias e eventos sao organizados em historico operacional. |
| 7 | Apoio a decisao preventiva | Recomendacoes e modo emergencial ajudam na priorizacao de resposta. |

### 4.3 Atores e Papeis

| Ator | Papel | Responsabilidade |
| --- | --- | --- |
| Usuario comum | Consultor de informacoes | Consulta alertas, recomendacoes e dados preventivos. |
| Operador / Defesa Civil | Operador ambiental | Acompanha areas criticas, prioriza alertas e aciona respostas. |
| Sistema Orbital Guardian | Processador operacional | Processa dados, calcula riscos e organiza informacoes. |
| Administrador | Gestor da solucao | Gerencia dados, parametros e configuracoes em uma arquitetura futura. |
| Comunidade | Publico impactado | Recebe ou se beneficia de informacoes preventivas. |

### 4.4 Servico de Negocio

**Servico de negocio:** Apoio ao monitoramento ambiental e resposta preventiva.

Esse servico entrega ao usuario informacoes organizadas sobre risco ambiental, alertas e recomendacoes, apoiando a tomada de decisao.

### 4.5 Localidade de Operacao

A solucao e aplicavel a regioes urbanas, rurais ou ambientais sujeitas a queimadas, enchentes, baixa umidade, calor extremo ou outros eventos climaticos. No prototipo atual, a localidade e representada por regioes cadastradas por CEP e por dados simulados.

---

## 5. Arquitetura de Sistema no Padrao TOGAF com ArchiMate

### 5.1 Camadas de Servico do Software

| Camada | Responsabilidade |
| --- | --- |
| Camada de apresentacao | Interface com usuario, telas, navegacao e exibicao visual. |
| Camada de aplicacao | Regras de autenticacao, alertas, regioes, sensores, recomendacoes e simulacoes. |
| Camada de dados | Dados simulados, estado local, historico, sessoes e contas locais. |
| Camada de seguranca | Criptografia, hash de senha, validacao, logs e controle de acesso. |

### 5.2 Componentes da Camada de Apresentacao

| Componente | Arquivo / Tela |
| --- | --- |
| Tela de login e criacao de conta | `src/pages/Login.jsx` |
| Dashboard | `src/pages/Dashboard.jsx` |
| Tela de alertas | `src/pages/ActiveAlerts.jsx` |
| Detalhes de alerta | `src/pages/AlertDetails.jsx` |
| Tela de regioes monitoradas | `src/pages/MonitoredRegions.jsx` |
| Detalhes de regiao | `src/pages/RegionDetails.jsx` |
| Tela de sensores | `src/pages/SensorNetwork.jsx` |
| Historico | `src/pages/SystemLogs.jsx` |
| Recomendacoes | `src/pages/Reports.jsx` |
| Perfil | `src/pages/OperatorProfile.jsx` |
| Mapa operacional | `src/pages/RadarMap.jsx` |
| Analise visual IA | `src/pages/AIAnalysis.jsx` |

### 5.3 Componentes da Camada de Aplicacao

| Componente | Responsabilidade |
| --- | --- |
| Modulo de autenticacao | Login, cadastro local, sessao e logout. |
| Modulo de alertas | Listagem, filtros, detalhes e mudanca de status. |
| Modulo de regioes | Cadastro por CEP, sincronizacao e simulacoes. |
| Modulo de sensores | Listagem, filtros, simulacao de leitura e detalhes. |
| Modulo de recomendacoes | Recomendacoes pendentes e concluidas. |
| Modulo de analise visual | Simulacao de resultado IA/OpenCV. |
| Modulo de seguranca | Criptografia, hash, validacao e logs. |

### 5.4 Componentes de Dados

| Data Object | Descricao |
| --- | --- |
| Dados de usuarios | Operador demonstrativo e contas locais. |
| Dados de regioes | Regioes cadastradas, metricas climaticas e risco. |
| Dados de alertas | Alertas ativos, status, prioridade e historico de atualizacao. |
| Dados de sensores simulados | Sensores de temperatura, umidade, vento e fumaca. |
| Historico de eventos | Ocorrencias, sincronizacoes e simulacoes. |
| Recomendacoes | Acoes preventivas e operacionais. |
| Logs de auditoria | Eventos de seguranca durante a sessao. |

### 5.5 Comunicacao Entre Componentes

Fluxo atual do prototipo:

```txt
Usuario
  -> Aplicativo React
  -> Rotas protegidas
  -> Context API
  -> Modulos internos
  -> Dados simulados / sessionStorage / localStorage
  -> Telas operacionais
```

Fluxo com APIs publicas:

```txt
Usuario cadastra CEP
  -> ViaCEP retorna endereco
  -> Open-Meteo Geocoding retorna coordenadas
  -> Open-Meteo Forecast retorna clima
  -> INPE e CEMADEN apoiam risco oficial
  -> App recalcula risco e atualiza telas
```

Fluxo de arquitetura futura:

```txt
Usuario
  -> Aplicativo Orbital Guardian
  -> API em nuvem
  -> Banco de dados
  -> Servicos ambientais/espaciais externos
  -> Logs e monitoramento
```

---

## 6. Arquitetura de Tecnologia no Padrao TOGAF com ArchiMate

### 6.1 Arquitetura Atual do Prototipo

| Elemento | Descricao |
| --- | --- |
| Dispositivo do usuario | Computador ou navegador local usado para acessar o prototipo. |
| Aplicacao web | React/Vite executando no navegador. |
| Ambiente de desenvolvimento | Node.js e Vite. |
| Armazenamento local | `localStorage` e `sessionStorage`. |
| Rede | Internet para acessar APIs publicas. |
| APIs externas | ViaCEP, Open-Meteo, INPE Queimadas, CEMADEN. |

### 6.2 Proposta de Arquitetura Futura

| Elemento | Descricao |
| --- | --- |
| Smartphone do usuario | Dispositivo de acesso principal para operadores e usuarios. |
| Aplicativo mobile/web | Interface do Orbital Guardian. |
| Internet | Meio de comunicacao entre usuario e servicos. |
| HTTPS | Canal seguro para trafego de dados. |
| Firewall / WAF | Protecao contra acessos indevidos e ataques comuns. |
| API em nuvem | Backend para autenticacao, alertas, regioes e sensores. |
| Banco de dados em nuvem | Persistencia segura de usuarios, regioes, alertas e historico. |
| Servicos externos ambientais | Fontes meteorologicas, espaciais, satelitais e oficiais. |
| Backup | Recuperacao de dados em caso de falha. |
| Monitoramento de logs | Observabilidade, auditoria e deteccao de falhas. |

### 6.3 Topologia Sugerida

```txt
Usuario no smartphone
  -> Internet segura HTTPS
  -> Firewall / API Gateway
  -> API em nuvem
  -> Banco de dados em nuvem
  -> Servicos externos de dados ambientais/espaciais
  -> Monitoramento de logs e backup
```

### 6.4 Conectividade

No prototipo atual, a conectividade ocorre diretamente entre navegador e APIs publicas. Na arquitetura futura, recomenda-se que as chamadas externas sejam mediadas por uma API propria, para aplicar autenticacao, rate limiting, validacao, cache e protecao de chaves.

---

## 7. Diagrama ArchiMate

Esta secao descreve como montar o diagrama no ArchiMate. A entrega pode ser criada em ferramenta como Archi, draw.io com notacao ArchiMate, ou ferramenta equivalente.

### 7.1 Visao 1 - Motivacional

Elementos ArchiMate:

- **Stakeholder**
  - Usuario comum
  - Defesa Civil / orgao responsavel
  - Administradores da solucao
  - Equipe tecnica
  - Comunidade em regiao de risco

- **Driver**
  - Aumento das queimadas
  - Necessidade de monitoramento ambiental
  - Uso de dados espaciais/satelitais
  - Apoio a tomada de decisao
  - Prevencao de desastres

- **Goal**
  - Monitorar regioes de risco
  - Exibir alertas
  - Organizar dados ambientais
  - Apoiar decisoes preventivas
  - Melhorar comunicacao de risco

- **Requirement**
  - Login e controle de acesso
  - Dashboard operacional
  - Listagem de regioes
  - Listagem de alertas
  - Registro de historico
  - Criptografia de dado sensivel

- **Constraint**
  - Prototipo academico
  - Uso de dados simulados
  - Sem backend real nesta etapa
  - Sem IoT fisico obrigatorio
  - Sem integracao real direta com satelites
  - Prazo limitado da Global Solution

Relacionamentos sugeridos:

- Stakeholders influenciam Drivers.
- Drivers motivam Goals.
- Goals sao realizados por Requirements.
- Constraints limitam Requirements e Goals.

### 7.2 Visao 2 - Negocio

Elementos ArchiMate:

- **Business Actor**
  - Usuario comum
  - Operador / Defesa Civil
  - Administrador
  - Comunidade

- **Business Role**
  - Consultor de alertas
  - Operador ambiental
  - Gestor da solucao
  - Beneficiario da informacao

- **Business Process**
  - Monitoramento e resposta a risco ambiental

- **Business Service**
  - Apoio ao monitoramento ambiental e resposta preventiva

Tarefas dentro do processo:

- Coleta ou simulacao de dados ambientais
- Analise do nivel de risco
- Geracao de alerta
- Exibicao no aplicativo
- Consulta de regioes
- Registro de historico
- Apoio a decisao preventiva

Relacionamentos sugeridos:

- Business Actor assume Business Role.
- Business Role participa do Business Process.
- Business Process realiza Business Service.
- Business Service atende stakeholders.

### 7.3 Visao 3 - Aplicacao / Sistema

Elementos ArchiMate:

- **Application Component**
  - Aplicativo Orbital Guardian
  - Modulo de autenticacao
  - Modulo de dashboard
  - Modulo de alertas
  - Modulo de regioes
  - Modulo de sensores
  - Modulo de recomendacoes
  - Modulo de historico
  - Modulo de seguranca

- **Application Service**
  - Autenticacao local
  - Monitoramento de regioes
  - Gestao de alertas
  - Simulacao de sensores
  - Recomendacoes operacionais
  - Auditoria de seguranca

- **Application Interface**
  - Interface web responsiva
  - Telas internas protegidas
  - API futura

- **Data Object**
  - Usuario
  - Regiao
  - Alerta
  - Sensor
  - Historico
  - Recomendacao
  - Log de auditoria

Relacionamentos sugeridos:

- Aplicativo Orbital Guardian compoe os modulos internos.
- Modulos realizam servicos de aplicacao.
- Interface web expoe servicos ao usuario.
- Modulos acessam Data Objects.
- Modulo de seguranca protege Usuario, Sessao e Logs.

### 7.4 Visao 4 - Tecnologia

Elementos ArchiMate:

- **Device**
  - Smartphone do usuario
  - Computador do operador

- **Node**
  - Navegador web
  - Servidor em nuvem futuro
  - Banco de dados em nuvem futuro

- **System Software**
  - React/Vite
  - Node.js no ambiente de desenvolvimento
  - API em nuvem futura
  - Sistema de banco de dados futuro

- **Communication Network**
  - Internet
  - HTTPS

- **Technology Service**
  - Hospedagem web
  - API segura
  - Armazenamento persistente
  - Backup
  - Monitoramento de logs

Relacionamentos sugeridos:

- Device acessa Communication Network.
- Communication Network conecta ao Node de aplicacao.
- Node executa System Software.
- System Software entrega Technology Service.
- Technology Service suporta Application Component.

### 7.5 Fluxo Resumido do Diagrama

```txt
Usuario
  -> Aplicativo Orbital Guardian
  -> Modulo de autenticacao
  -> Dashboard
  -> Modulo de alertas
  -> Dados ambientais simulados / API futura
  -> Banco de dados
  -> Logs e seguranca
```

### 7.6 Orientacao Visual Para Montar o Diagrama

Sugestao de organizacao em quatro blocos:

1. **Motivacional** no topo: stakeholders, drivers, goals, requirements e constraints.
2. **Negocio** abaixo: atores, papeis, processo e servico de negocio.
3. **Aplicacao** no centro: app, modulos e dados.
4. **Tecnologia** na base: dispositivos, rede, API futura, banco e monitoramento.

Use setas para mostrar dependencia e realizacao:

- Drivers motivam objetivos.
- Objetivos geram requisitos.
- Requisitos sao realizados por componentes de aplicacao.
- Componentes de aplicacao usam dados.
- Componentes rodam sobre tecnologia.

---

## 8. Video Pitch da GS

### 8.1 Informacoes Gerais

O video pitch deve ter ate 3 minutos e ser publicado no YouTube como **nao listado**. O link deve ser colocado no slide 1 ou no inicio do documento final.

### 8.2 Roteiro Sugerido - Ate 3 Minutos

**0:00 - 0:15 | Apresentacao do grupo**

Ola, somos o grupo [nome do grupo], da FIAP, e este e o Orbital Guardian, nosso projeto para a Global Solution.

**0:15 - 0:40 | Problema identificado**

Queimadas, baixa umidade, calor extremo e eventos climaticos severos afetam regioes urbanas, rurais e ambientais. Um dos desafios e organizar dados de risco e transformar essas informacoes em alertas claros para apoiar decisoes rapidas.

**0:40 - 1:10 | Solucao proposta**

O Orbital Guardian e um prototipo de central operacional para monitoramento ambiental. Ele permite acompanhar regioes de risco, visualizar alertas, consultar sensores simulados, acessar historico e receber recomendacoes operacionais.

**1:10 - 1:45 | Funcionamento basico**

No sistema, o operador faz login ou cria uma conta local. Em seguida, acessa o dashboard, consulta regioes monitoradas, acompanha alertas, simula leituras de sensores e visualiza uma analise visual por IA. O app tambem integra APIs publicas como ViaCEP, Open-Meteo, INPE Queimadas e CEMADEN.

**1:45 - 2:15 | Diferenciais**

Os diferenciais do projeto sao a visao operacional integrada, o foco em risco de queimadas, a simulacao de IA visual, o uso de dados ambientais e a implementacao de um modulo de ciberseguranca com criptografia de e-mail, hash de senha, validacao de entradas e logs de auditoria.

**2:15 - 2:40 | Relacao com GS e ODS**

O projeto se conecta a Global Solution por propor uma solucao tecnologica para monitoramento ambiental e prevencao de desastres. Ele se relaciona com ODS 9, por inovacao e infraestrutura; ODS 11, por cidades e comunidades sustentaveis; e ODS 13, por acao climatica.

**2:40 - 3:00 | Encerramento**

Assim, o Orbital Guardian demonstra como tecnologia, dados ambientais e seguranca da informacao podem apoiar decisoes preventivas e reduzir impactos de eventos extremos. Obrigado.

### 8.3 Checklist Para o Video

- Mostrar tela de login ou criar conta.
- Mostrar dashboard.
- Mostrar regioes monitoradas.
- Mostrar alertas.
- Mostrar sensores.
- Mostrar analise visual.
- Mostrar perfil com evidencia de criptografia.
- Encerrar com ODS e proposta de valor.

---

## 9. Prints ou Exportacao do Diagrama

Espaco reservado para inserir os prints ou exportacoes dos diagramas ArchiMate.

### 9.1 Visao Motivacional

[Inserir imagem/exportacao da visao motivacional]

### 9.2 Visao de Negocio

[Inserir imagem/exportacao da visao de negocio]

### 9.3 Visao de Aplicacao/Sistema

[Inserir imagem/exportacao da visao de aplicacao/sistema]

### 9.4 Visao de Tecnologia

[Inserir imagem/exportacao da visao de tecnologia]

---

## 10. Compliance, Qualidade e Testes

Mesmo sendo um prototipo academico, o projeto considera praticas basicas de qualidade e conformidade.

### 10.1 Compliance

- Tratamento de dado pessoal: e-mail do operador.
- Protecao basica: criptografia do e-mail.
- Senha: armazenada como hash, nao em texto puro.
- Logs: eventos de seguranca sao registrados.
- LGPD: o projeto evita persistir dado sensivel em texto claro no armazenamento local.

### 10.2 Qualidade

- Organizacao por componentes, paginas, contextos, servicos e modulo de seguranca.
- Separacao entre apresentacao, aplicacao, dados e seguranca.
- Build validado com `npm run build`.
- `.gitignore` configurado para evitar envio de `node_modules`, `dist` e `.env`.

### 10.3 Testes Manuais Recomendados

| Teste | Resultado esperado |
| --- | --- |
| Abrir tela inicial | Login deve aparecer corretamente. |
| Criar conta local | Usuario deve ser autenticado e ir para dashboard. |
| Inserir e-mail invalido | Sistema deve exibir erro de validacao. |
| Inserir senha curta | Sistema deve exibir erro de senha minima. |
| Login com senha errada | Sistema deve negar acesso. |
| Acessar rota interna sem login | Sistema deve redirecionar para login. |
| Simular leitura de sensores | Leituras devem mudar e exibir mensagem de sucesso. |
| Alterar status de alerta | Status deve ser atualizado localmente. |
| Ver perfil | Deve exibir e-mail descriptografado e valor criptografado. |
| Rodar build | Comando deve finalizar sem erro. |

---

## 11. Conclusao

O Orbital Guardian apresenta uma proposta de arquitetura coerente para um prototipo academico de monitoramento ambiental. A solucao combina interface operacional, dados simulados, integracoes publicas, seguranca basica e uma visao arquitetural alinhada ao TOGAF com representacao em ArchiMate.

O projeto atende ao escopo da Global Solution ao demonstrar como tecnologia, dados ambientais e seguranca cibernetica podem apoiar prevencao de riscos, resposta operacional e comunicacao de alertas em regioes vulneraveis.

Como evolucao futura, a solucao pode incorporar backend real, banco de dados em nuvem, autenticacao robusta, integracao com sensores IoT, APIs espaciais/satelitais e monitoramento centralizado de logs.

