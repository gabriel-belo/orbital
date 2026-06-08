Preciso organizar a entrega da disciplina Testing, Compliance & Quality Assurance da Global Solution da FIAP.

O objetivo é montar a documentação de arquitetura da solução no padrão TOGAF usando ArchiMate, além de preparar a estrutura para o vídeo pitch da GS.

O projeto é um protótipo acadêmico chamado Orbital Guardian, voltado ao monitoramento ambiental e identificação de regiões de risco, especialmente queimadas e eventos climáticos extremos. O projeto pode usar dados simulados e não precisa obrigatoriamente de dispositivo IoT físico.

Preciso que você crie a documentação e a estrutura textual para a entrega seguindo exatamente estes requisitos:

1. BREVE DESCRITIVO DO PROJETO
Criar um texto curto explicando:
- O que é o projeto;
- Qual problema ele resolve;
- Para que ele serve;
- Qual é o escopo;
- Como ele se conecta ao tema da Global Solution.

O texto deve ser claro, acadêmico e direto.

2. VISÃO DA ARQUITETURA NO PADRÃO TOGAF COM ARCHIMATE
Criar uma seção com:
- Stakeholders do projeto;
- Drivers do projeto;
- Objetivos e metas;
- Requisitos;
- Constraints, ou seja, restrições do projeto.

Usar exemplos coerentes com o projeto:
Stakeholders:
- Usuário comum;
- Defesa Civil ou órgão responsável;
- Administradores da solução;
- Equipe técnica;
- Comunidade em região de risco.

Drivers:
- Aumento das queimadas;
- Necessidade de monitoramento ambiental;
- Uso de dados espaciais/satelitais;
- Apoio à tomada de decisão;
- Prevenção de desastres.

Objetivos:
- Monitorar regiões de risco;
- Exibir alertas;
- Organizar dados ambientais;
- Apoiar decisões preventivas;
- Melhorar a comunicação de risco.

Constraints:
- Protótipo acadêmico;
- Uso de dados simulados;
- Sem backend real nesta etapa, se aplicável;
- Sem IoT físico obrigatório;
- Sem integração real com satélites nesta etapa;
- Limitações de tempo da Global Solution.

3. ARQUITETURA DE NEGÓCIO NO PADRÃO TOGAF COM ARCHIMATE
Criar uma seção com:
- Processo principal do negócio;
- Tarefas do processo;
- Atores;
- Papéis;
- Localidade de operação.

Processo sugerido:
Monitoramento e resposta a risco ambiental.

Tarefas:
- Coleta ou simulação de dados ambientais;
- Análise do nível de risco;
- Geração de alerta;
- Exibição de informações no aplicativo;
- Consulta de regiões;
- Registro de histórico;
- Apoio à decisão preventiva.

Atores e papéis:
- Usuário comum: consulta alertas e recomendações;
- Operador/Defesa Civil: acompanha áreas críticas;
- Sistema: processa dados e gera alertas;
- Administrador: gerencia dados e parâmetros;
- Comunidade: recebe informações preventivas.

Localidade de operação:
- Regiões urbanas, rurais ou ambientais sujeitas a queimadas, enchentes ou eventos climáticos extremos.

4. ARQUITETURA DE SISTEMA NO PADRÃO TOGAF COM ARCHIMATE
Criar uma seção descrevendo:
- Camadas de serviço do software;
- Componentes por camada;
- Comunicação entre componentes;
- Componentes de dados;
- Relações entre componentes de aplicação.

Camadas sugeridas:
- Camada de apresentação;
- Camada de aplicação;
- Camada de dados;
- Camada de segurança.

Componentes da camada de apresentação:
- Tela de login;
- Dashboard;
- Tela de alertas;
- Tela de regiões monitoradas;
- Tela de sensores/dados ambientais;
- Tela de histórico.

Componentes da camada de aplicação:
- Módulo de autenticação;
- Módulo de alertas;
- Módulo de regiões;
- Módulo de sensores ou dados simulados;
- Módulo de recomendações;
- Módulo de segurança.

Componentes de dados:
- Dados de usuários;
- Dados de regiões;
- Dados de alertas;
- Dados de sensores simulados;
- Histórico de eventos.

Comunicação:
Usuário acessa o aplicativo → aplicativo consulta módulos internos/API futura → módulos acessam dados simulados ou banco → sistema retorna alertas, regiões e recomendações.

5. ARQUITETURA DE TECNOLOGIA NO PADRÃO TOGAF COM ARCHIMATE
Criar uma seção descrevendo:
- Servidores;
- Infraestrutura;
- Rede;
- Conectividade;
- Ambiente de execução.

Mesmo sendo protótipo, representar uma arquitetura futura com:
- Smartphone do usuário;
- Aplicativo mobile;
- Internet;
- API em nuvem;
- Banco de dados em nuvem;
- Serviço externo de dados espaciais/satelitais ou meteorológicos;
- Firewall;
- HTTPS;
- Backup;
- Monitoramento de logs.

Topologia sugerida:
Usuário no smartphone → Internet segura HTTPS → API em nuvem → Banco de dados → Serviços externos de dados ambientais/espaciais.

6. DIAGRAMA ARCHIMATE
Preparar uma descrição de como montar o diagrama no ArchiMate com quatro visões:

Visão 1: Motivacional
- Stakeholders;
- Drivers;
- Goals;
- Requirements;
- Constraints.

Visão 2: Negócio
- Business Actor;
- Business Role;
- Business Process;
- Business Service.

Visão 3: Aplicação/Sistema
- Application Component;
- Application Service;
- Application Interface;
- Data Object.

Visão 4: Tecnologia
- Device;
- Node;
- System Software;
- Communication Network;
- Technology Service.

Também criar uma versão resumida do fluxo:
Usuário → Aplicativo Orbital Guardian → Módulo de autenticação → Dashboard → Módulo de alertas → Dados ambientais simulados/API futura → Banco de dados → Logs e segurança.

7. VÍDEO PITCH DA GS
Criar um roteiro para vídeo pitch de até 3 minutos contendo:
- Apresentação do grupo;
- Problema identificado;
- Solução proposta;
- Funcionamento básico do sistema;
- Diferenciais;
- Relação com a Global Solution;
- Relação com ODS;
- Encerramento.

O vídeo será postado no YouTube como “não listado”.
O link do vídeo deve ficar disponível no slide 1 ou no início do documento final.

8. DOCUMENTO FINAL ÚNICO
Criar uma estrutura de documento único contendo:
- Capa;
- Nome do projeto;
- Nome e RM dos integrantes;
- Link do vídeo pitch;
- Breve descritivo do projeto;
- Arquitetura de solução;
- Visão TOGAF/ArchiMate;
- Arquitetura de negócio;
- Arquitetura de sistema;
- Arquitetura de tecnologia;
- Prints ou exportação do diagrama;
- Conclusão.

Não gerar arquivos separados.
O documento deve ser organizado para exportar em PDF.

9. README PARA O GITHUB
Criar um README explicando:
- Nome do projeto;
- Objetivo;
- Tecnologias usadas;
- Estrutura da arquitetura;
- Como visualizar o diagrama;
- Link do vídeo pitch;
- Integrantes;
- Relação com GS e ODS.

10. IMPORTANTE
Não inventar funcionalidades que não existem no projeto.
Quando algo for arquitetura futura, deixar escrito como “proposta de arquitetura futura”.
Quando algo for protótipo, deixar escrito como “protótipo acadêmico”.
Usar linguagem clara, objetiva e adequada para entrega universitária.