Sim, agora precisa ser um prompt **completo, porém organizado**, para a IA entender o projeto inteiro e implementar as funcionalidades em **todas as telas existentes**, sem recriar tudo do zero.

Use este prompt:

---

# Prompt — Implementar funcionalidades no app Orbital Guardian

Você é um desenvolvedor mobile especialista em criação de protótipos funcionais. Já existe um protótipo visual do aplicativo **Orbital Guardian** com as telas criadas. Agora preciso que você implemente as funcionalidades, organize os dados simulados e deixe o app navegável, funcional e convincente para apresentação acadêmica.

## Objetivo do projeto

O **Orbital Guardian** é uma plataforma mobile de monitoramento climático inteligente, criada para a Global Solution da FIAP.

A proposta do projeto é ajudar equipes de monitoramento ambiental, defesa civil e operadores de emergência a identificar, acompanhar e priorizar riscos de queimadas em regiões vulneráveis.

O sistema simula a integração entre:

* dados espaciais/satelitais;
* sensores ambientais;
* visão computacional;
* inteligência artificial;
* alertas operacionais;
* priorização de atendimento.

Nesta etapa, o app deve funcionar como um **protótipo mobile funcional**, usando dados simulados. Não é necessário integrar backend real, banco de dados real, API real ou IA real agora.

## Conceito do app

O app deve funcionar como uma **central operacional de monitoramento ambiental**.

O usuário deve conseguir:

* entrar no app por login simulado;
* visualizar um dashboard geral;
* acompanhar regiões monitoradas;
* visualizar sensores ambientais;
* consultar alertas ativos;
* abrir detalhes de alertas;
* alterar status de ocorrências;
* visualizar uma análise visual simulada por IA/OpenCV;
* ver histórico de ocorrências;
* acessar recomendações operacionais.

O foco do MVP é **risco de queimadas**, principalmente fumaça, fogo provável, calor extremo, baixa umidade e sensores ambientais críticos.

## Regras importantes

1. Não recriar o projeto do zero.
2. Não apagar o visual já criado.
3. Manter a identidade visual escura, tecnológica e profissional.
4. Implementar funcionalidades nas telas existentes.
5. Usar dados simulados/mockados.
6. Criar ou organizar um arquivo central de dados.
7. Garantir navegação funcional entre as telas.
8. Evitar funcionalidades complexas que dependam de backend.
9. O app deve parecer real para uma apresentação.
10. Preparar a estrutura para futura integração com API, mas sem implementar API agora.

---

# Dados simulados obrigatórios

Crie ou organize dados mockados consistentes para o app inteiro.

Os dados devem incluir:

* usuário;
* regiões monitoradas;
* sensores;
* alertas;
* análises visuais;
* histórico;
* recomendações.

Os dados precisam se relacionar entre si. Por exemplo: se existe um alerta na região **Serra Norte**, essa região também deve existir na lista de regiões, sensores e análise visual.

## Regiões simuladas

Use estas regiões:

1. **Serra Norte**

   * Tipo: Reserva Ambiental
   * Risco: Crítico
   * Temperatura: 39°C
   * Umidade: 18%
   * Vento: 24 km/h
   * Último alerta: Fumaça provável detectada

2. **Vale Verde**

   * Tipo: Área Rural
   * Risco: Alto
   * Temperatura: 36°C
   * Umidade: 24%
   * Vento: 18 km/h
   * Último alerta: Temperatura extrema

3. **Comunidade Solar**

   * Tipo: Área Habitacional
   * Risco: Médio
   * Temperatura: 32°C
   * Umidade: 31%
   * Vento: 12 km/h
   * Último alerta: Baixa umidade crítica

4. **Reserva Horizonte**

   * Tipo: Área Ambiental
   * Risco: Baixo
   * Temperatura: 27°C
   * Umidade: 48%
   * Vento: 8 km/h
   * Último alerta: Nenhum alerta ativo

---

# Telas e funcionalidades

## 1. Tela de Login

A tela de login deve ser simulada, mas funcional.

### Deve ter:

* campo de e-mail;
* campo de senha;
* botão **Entrar**;
* botão **Acessar demonstração**;
* opção de mostrar/ocultar senha;
* mensagem de erro se tentar entrar sem preencher os campos;
* loading curto ao clicar em entrar;
* redirecionamento para o Dashboard após login válido.

### Regras:

* Se o usuário preencher qualquer e-mail e senha, permitir acesso.
* Se clicar em **Acessar demonstração**, entrar direto.
* Criar usuário simulado:

  * Nome: Operador Ambiental
  * Perfil: Analista
  * E-mail: [demo@orbitalguardian.com](mailto:demo@orbitalguardian.com)

---

## 2. Dashboard Principal

O Dashboard é a tela central do app.

### Deve mostrar:

* nome do usuário logado;
* saudação;
* data e hora da última atualização;
* card de risco ambiental geral;
* total de regiões monitoradas;
* total de alertas ativos;
* total de sensores online;
* último alerta crítico;
* últimas regiões com maior risco;
* atalhos para Regiões, Alertas, Sensores, Análise Visual, Histórico e Recomendações.

### Regras de funcionamento:

O risco ambiental geral deve ser calculado automaticamente:

* se existir alerta crítico, risco geral = **Crítico**;
* se existir alerta alto, risco geral = **Alto**;
* se existir alerta médio, risco geral = **Médio**;
* se não existir alerta ativo, risco geral = **Baixo**.

O card de último alerta deve mostrar o alerta mais recente.

### Ações:

* botão **Atualizar dados**;
* ao clicar, atualizar horário da última atualização;
* exibir mensagem: **Dados atualizados com sucesso**.

---

## 3. Tela de Regiões Monitoradas

Essa tela deve listar todas as regiões monitoradas.

### Cada card deve mostrar:

* nome da região;
* tipo da área;
* nível de risco;
* temperatura;
* umidade;
* vento;
* último alerta;
* quantidade de sensores vinculados;
* status operacional.

### Funcionalidades:

* busca por nome da região;
* filtro por risco:

  * Todos;
  * Baixo;
  * Médio;
  * Alto;
  * Crítico.
* ordenação automática por risco, colocando regiões críticas primeiro;
* clique no card para abrir detalhes da região.

### Detalhes da região:

Ao abrir detalhes, mostrar:

* nome;
* tipo;
* descrição;
* risco atual;
* temperatura;
* umidade;
* vento;
* sensores vinculados;
* alertas recentes;
* recomendação de ação.

### Ações:

* botão **Ver alertas desta região**;
* ao clicar, ir para Alertas já filtrando pela região selecionada.

---

## 4. Tela de Alertas

Essa tela deve listar os alertas ativos e permitir interação.

### Cada alerta deve mostrar:

* título;
* região;
* prioridade;
* status;
* data/hora;
* descrição curta;
* origem do alerta;
* nível de confiança, quando existir.

### Alertas simulados:

1. **Fumaça provável detectada**

   * Região: Serra Norte
   * Prioridade: Crítica
   * Status: Em análise
   * Origem: Análise Visual
   * Confiança: 87%

2. **Temperatura extrema**

   * Região: Vale Verde
   * Prioridade: Alta
   * Status: Novo
   * Origem: Sensor Ambiental

3. **Baixa umidade crítica**

   * Região: Comunidade Solar
   * Prioridade: Média
   * Status: Monitorando
   * Origem: Sensor Ambiental

### Funcionalidades:

* busca por título ou região;
* filtro por prioridade;
* filtro por status;
* ordenação por prioridade:

  1. Crítico;
  2. Alto;
  3. Médio;
  4. Baixo.
* contador no topo:

  * críticos;
  * altos;
  * médios;
  * resolvidos.

### Detalhes do alerta:

Ao clicar em um alerta, abrir detalhes com:

* título;
* região;
* prioridade;
* status;
* descrição completa;
* temperatura;
* umidade;
* vento;
* origem;
* confiança;
* recomendação de ação;
* histórico de atualização.

### Botões funcionais:

No detalhe do alerta, criar botões:

* **Marcar como em análise**;
* **Marcar como em atendimento**;
* **Marcar como resolvido**.

Esses botões devem atualizar o status localmente e mostrar mensagem de sucesso.

---

## 5. Tela de Sensores

Essa tela deve exibir sensores ambientais simulados.

### Cada sensor deve mostrar:

* nome;
* tipo;
* região;
* valor atual;
* unidade;
* status;
* última leitura;
* bateria, se existir.

### Sensores simulados:

1. Sensor de Temperatura

   * Região: Serra Norte
   * Valor: 39°C
   * Status: Online

2. Sensor de Umidade

   * Região: Serra Norte
   * Valor: 18%
   * Status: Online

3. Sensor de Vento

   * Região: Vale Verde
   * Valor: 24 km/h
   * Status: Online

4. Sensor de Fumaça

   * Região: Serra Norte
   * Valor: Nível Elevado
   * Status: Online

5. Sensor de Temperatura

   * Região: Reserva Horizonte
   * Valor: 27°C
   * Status: Online

6. Sensor de Umidade

   * Região: Comunidade Solar
   * Valor: 31%
   * Status: Instável

### Funcionalidades:

* busca por nome, tipo ou região;
* filtro por região;
* filtro por status:

  * Todos;
  * Online;
  * Offline;
  * Instável.
* botão **Simular leitura**.

### Ao clicar em Simular leitura:

* alterar alguns valores dos sensores;
* atualizar horário da última leitura;
* mostrar mensagem de sucesso;
* se algum valor ficar crítico, destacar visualmente o sensor.

---

## 6. Tela de Análise Visual por IA

Essa tela representa a integração futura com Python/OpenCV.

### Deve mostrar:

* título: **Análise Visual por IA**;
* região analisada;
* imagem ou placeholder visual;
* resultado da análise;
* confiança;
* origem: **Módulo Python/OpenCV**;
* data/hora da análise;
* alerta relacionado;
* explicação curta.

### Texto explicativo:

Use este texto:

**A imagem foi processada por visão computacional para identificar padrões compatíveis com fumaça ou fogo. O resultado ajuda no cálculo de prioridade do alerta.**

### Resultados simulados:

Permitir alternar entre:

1. **Sem risco visual**

   * Confiança: 72%
   * Risco: Baixo

2. **Fumaça provável detectada**

   * Confiança: 87%
   * Risco: Alto

3. **Fogo provável detectado**

   * Confiança: 91%
   * Risco: Crítico

### Funcionalidades:

* botão **Simular nova análise**;
* ao clicar, trocar o resultado da análise;
* atualizar data/hora;
* mostrar barra de confiança;
* mostrar badge de risco;
* se resultado for fumaça ou fogo, exibir alerta relacionado;
* botão **Ver alerta relacionado**, levando para a tela de Alertas.

---

## 7. Tela de Histórico

Essa tela deve mostrar ocorrências anteriores.

### Cada item do histórico deve ter:

* data/hora;
* região;
* tipo de alerta;
* prioridade;
* status final;
* tempo de resolução;
* responsável ou equipe simulada.

### Histórico simulado:

Exemplos:

* Fumaça detectada — Serra Norte — Crítico — Resolvido — 2h15min
* Temperatura extrema — Vale Verde — Alto — Resolvido — 1h40min
* Sensor instável — Comunidade Solar — Médio — Resolvido — 35min

### Funcionalidades:

* filtro por região;
* filtro por prioridade;
* filtro por status;
* ordenação por data mais recente;
* busca por região ou tipo de ocorrência.

---

## 8. Tela de Recomendações

Essa tela deve exibir recomendações operacionais geradas pelo sistema.

### Recomendações simuladas:

* Priorizar análise da região Serra Norte devido ao risco crítico.
* Verificar sensor de umidade da Comunidade Solar, pois está instável.
* Acionar equipe preventiva para área com baixa umidade.
* Monitorar regiões com temperatura acima de 35°C.
* Revisar alertas com confiança visual acima de 85%.
* Manter backup dos logs de alertas críticos.

### Cada recomendação deve mostrar:

* título;
* descrição;
* prioridade;
* região relacionada, se houver;
* tipo:

  * operacional;
  * preventiva;
  * técnica;
  * segurança.

### Funcionalidades:

* filtro por prioridade;
* marcar recomendação como concluída;
* exibir separação entre pendentes e concluídas.

---

## 9. Tela de Perfil ou Configurações

Se existir tela de perfil/configurações, implementar de forma simples.

### Deve mostrar:

* nome do usuário;
* e-mail;
* perfil;
* opção de sair;
* informações do app;
* versão do protótipo.

### Botão Sair:

* limpar usuário local;
* voltar para a tela de login.

---

# Estados locais necessários

O app deve controlar localmente:

* usuário logado;
* filtros;
* busca;
* lista de alertas;
* status dos alertas;
* sensores;
* últimas leituras;
* resultado da análise visual;
* histórico;
* recomendações concluídas;
* horário da última atualização.

Pode usar estado local simples ou Context API, conforme ficar mais organizado.

---

# Melhorias visuais obrigatórias

Além das funcionalidades, melhorar a experiência visual com:

* badges coloridos para risco e prioridade;
* cards com bom espaçamento;
* botões claros;
* mensagens de sucesso e erro;
* loading curto em ações simuladas;
* ícones nas principais seções;
* destaque para alertas críticos;
* indicação visual de sensores online, offline e instáveis;
* padronização de cores;
* layout responsivo;
* navegação intuitiva.

---

# Identidade visual

Manter uma identidade visual escura e tecnológica.

Sugestão de cores:

* Fundo principal: `#0B1020`
* Cards: `#151B2E`
* Azul principal: `#4F8CFF`
* Verde: `#2ECC71`
* Amarelo: `#F1C40F`
* Laranja: `#E67E22`
* Vermelho crítico: `#E74C3C`
* Texto principal: `#FFFFFF`
* Texto secundário: `#AAB2C8`

---

# Não fazer nesta etapa

Não implementar:

* backend real;
* banco de dados real;
* autenticação real;
* API real;
* mapa real;
* IA real;
* OpenCV real;
* notificações push reais;
* deploy.

Tudo deve ser simulado, mas precisa parecer funcional e realista.

---

# Resultado esperado

Ao final, o app deve permitir que o usuário:

1. Faça login simulado.
2. Acesse o Dashboard.
3. Veja indicadores gerais do Orbital Guardian.
4. Navegue entre todas as telas.
5. Consulte regiões monitoradas.
6. Filtre e pesquise regiões.
7. Consulte alertas ativos.
8. Altere status dos alertas.
9. Consulte sensores.
10. Simule novas leituras de sensores.
11. Visualize análise visual por IA.
12. Simule nova análise visual.
13. Acesse histórico de ocorrências.
14. Consulte recomendações.
15. Marque recomendações como concluídas.
16. Saia do app.

O objetivo é transformar o protótipo visual em um **protótipo funcional completo**, mantendo o foco no Orbital Guardian como uma solução mobile de monitoramento e priorização de riscos de queimadas.
