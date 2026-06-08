# Orbital Guardian

## Sobre o Projeto

O **Orbital Guardian** e um prototipo academico desenvolvido para a Global Solution da FIAP. A solucao simula uma central operacional de monitoramento ambiental para identificar, acompanhar e priorizar regioes de risco, especialmente queimadas, baixa umidade, calor extremo e eventos climaticos severos.

O projeto foi construido como uma aplicacao web em **React + Vite**, com dados simulados, armazenamento local, integracoes publicas e modulo de ciberseguranca.

## Objetivo

O objetivo do Orbital Guardian e apoiar operadores ambientais, Defesa Civil e equipes de resposta na visualizacao de dados ambientais, alertas, sensores simulados, historico e recomendacoes operacionais.

## Tecnologias Utilizadas

- React
- Vite
- React Router DOM
- Tailwind CSS
- Context API
- Web Crypto API
- APIs publicas:
  - ViaCEP
  - Open-Meteo
  - INPE Queimadas
  - CEMADEN

## Funcionalidades

- Login e criacao de conta local.
- Dashboard operacional.
- Cadastro e consulta de regioes por CEP.
- Sincronizacao com dados climaticos.
- Alertas por prioridade e status.
- Sensores ambientais simulados.
- Simulacao de analise visual por IA.
- Historico operacional.
- Recomendacoes.
- Perfil do operador.
- Mapa operacional.
- Modulo de ciberseguranca com criptografia, hash de senha, validacao e logs.

## Arquitetura

A documentacao de arquitetura foi organizada no padrao TOGAF com orientacao para ArchiMate.

Camadas principais:

- Camada de apresentacao;
- Camada de aplicacao;
- Camada de dados;
- Camada de seguranca;
- Proposta futura de tecnologia em nuvem.

Documento completo:

- [`docs/testing-compliance-quality-assurance.md`](docs/testing-compliance-quality-assurance.md)

Resumo completo do projeto:

- [`docs/resumo-completo-projeto.md`](docs/resumo-completo-projeto.md)

Modulo de ciberseguranca:

- [`docs/modulo-ciberseguranca.md`](docs/modulo-ciberseguranca.md)
- [`src/security/securityREADME.md`](src/security/securityREADME.md)

## Como Visualizar o Diagrama

O diagrama ArchiMate deve ser montado em ferramenta como Archi, draw.io ou equivalente, usando as quatro visoes descritas no documento:

1. Visao motivacional;
2. Visao de negocio;
3. Visao de aplicacao/sistema;
4. Visao de tecnologia.

O fluxo resumido sugerido e:

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

## Como Executar

Entre na pasta do projeto:

```bash
cd nebula-ops
```

Instale as dependencias:

```bash
npm install
```

Rode o projeto:

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

## Link do Video Pitch

Link do YouTube nao listado:

```txt
[inserir link do video pitch]
```

## Integrantes

| Integrante | RM |
| --- | --- |
| [Nome do integrante 1] | [RM] |
| [Nome do integrante 2] | [RM] |
| [Nome do integrante 3] | [RM] |
| [Nome do integrante 4] | [RM] |
| [Nome do integrante 5] | [RM] |

## Relacao com a Global Solution e ODS

O projeto se conecta a Global Solution por propor uma solucao tecnologica para monitoramento ambiental, prevencao de riscos e apoio a tomada de decisao em regioes vulneraveis.

ODS relacionados:

- **ODS 9:** Industria, inovacao e infraestrutura.
- **ODS 11:** Cidades e comunidades sustentaveis.
- **ODS 13:** Acao contra a mudanca global do clima.

## Observacoes

Este projeto e um **prototipo academico**. Algumas partes representam arquitetura futura, como backend em nuvem, banco de dados persistente, IoT fisico, APIs espaciais/satelitais diretas e monitoramento centralizado.

