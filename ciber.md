# Orbital Guardian ReadMe
Sistema de monitoramento e gerenciamento de informações críticas relacionadas ao ecossistema espacial, desenvolvido como parte da Global Solution do curso de Engenharia de Software da FIAP.

## Sobre o Projeto
O Orbital Guardian foi desenvolvido para auxiliar operadores no monitoramento de eventos, alertas e informações relevantes para ambientes que dependem de dados espaciais e sistemas de observação.

A plataforma centraliza informações estratégicas em uma interface intuitiva, permitindo acompanhamento de alertas, regiões monitoradas, sensores e análises operacionais.

## Objetivos
* Monitorar eventos e alertas críticos.
* Centralizar informações operacionais.
* Melhorar a rastreabilidade de eventos.
* Garantir maior confiabilidade dos dados processados.
* Aplicar boas práticas de segurança da informação.

## Arquitetura do Projeto

```bash
src/
    components/
    context/
    data/
    lib/
    pages/
    security/
        auditLogger.js
        cryptoService.js
        validators.js
    services/
    App.jsx
```

## Módulo de Cibersegurança
Como parte da disciplina de Cibersegurança, foram implementados controles para proteção da aplicação e dos dados armazenados.

## Controles Implementados

### 1. Controle de Acesso (IAM)
A aplicação utiliza autenticação para restringir o acesso às funcionalidades internas.

Rotas protegidas impedem que usuários não autenticados acessem recursos sensíveis.

### 2. Validação de Entradas
Todos os dados fornecidos pelos usuários passam por validação antes do processamento.

### 3. Criptografia de Dados Sensíveis
Informações confidenciais são protegidas utilizando:

* AES-GCM
* Web Crypto API

A criptografia garante a confidencialidade dos dados armazenados.

### 4. Proteção de Credenciais
As senhas são protegidas utilizando:

* PBKDF2
* SHA-256
* Salt aleatório
* 120.000 iterações

Essa abordagem reduz significativamente os riscos de ataques de força bruta.

## Auditoria e Monitoramento
Eventos críticos são registrados automaticamente através do módulo de auditoria.


