# Modulo de Ciberseguranca

## 1. Identificacao de Riscos e Ameacas

Metodologia usada: STRIDE simplificado.

| Ativo critico | Ameaca | Categoria STRIDE | Impacto | Mitigacao proposta |
| --- | --- | --- | --- | --- |
| Aplicativo mobile/web | Acesso nao autorizado as telas internas | Spoofing | Usuario indevido pode consultar alertas, regioes monitoradas e dados operacionais | Controle de acesso com rotas protegidas e auditoria de acesso negado |
| Dados do usuario | Vazamento de e-mail do operador | Information Disclosure | Exposicao de dado pessoal e risco de descumprimento de boas praticas LGPD | Criptografia do e-mail antes de salvar no armazenamento local |
| Modulo de alertas | Alteracao indevida do status de ocorrencias | Tampering | Alerta ambiental pode ser encerrado ou manipulado incorretamente | Logs de auditoria e historico de atualizacao dos alertas |
| Armazenamento local ou banco futuro | Insercao de dados invalidos ou malformados | Tampering | Sessao corrompida, falhas no painel e dados inconsistentes | Validacao, sanitizacao e tratamento de erros ao ler dados locais |
| API simulada ou futura API | Falha de disponibilidade, DDoS ou resposta invalida | Denial of Service | App pode ficar sem dados climaticos, regioes ou alertas atualizados | Fallback para dados simulados, validacao de resposta e recomendacao de hardening em producao |

## 2. Controles de Seguranca

1. Criptografia de dados sensiveis: o e-mail do operador e criptografado com AES-GCM usando a Web Crypto API.
2. Hash de senha: o cadastro local salva senha como hash PBKDF2 com salt, sem persistir senha em texto puro.
3. Validacao e sanitizacao de entradas: o login/cadastro valida e-mail, senha minima, obrigatoriedade, tamanho maximo e remove caracteres perigosos basicos.
4. Controle de acesso basico: as telas internas continuam protegidas por verificacao de usuario autenticado.
5. Monitoramento basico de logs: eventos de cadastro, login, logout, acesso negado, criptografia, descriptografia e erro de validacao sao registrados.
6. Backup/recuperacao e retencao: para o MVP, os logs ficam em sessao local limitada. Para producao, recomenda-se retencao controlada, backup criptografado e exportacao para SIEM ou backend seguro.
7. Seguranca para API futura: recomenda-se HTTPS, API gateway, rate limiting, rotacao de chaves, validacao de payload e variaveis de ambiente.

## 3. Diagrama de Seguranca

Fluxo:

```txt
Usuario
  -> Aplicativo Orbital Guardian
  -> Modulo de Validacao
  -> Modulo de Criptografia
  -> Armazenamento Local / Banco futuro
  -> Logs de Auditoria
```

Controles aplicados:

- Usuario -> Aplicativo: controle de acesso no login.
- Aplicativo -> Modulo de Validacao: validacao de e-mail, senha, obrigatoriedade e tamanho maximo.
- Modulo de Validacao -> Modulo de Criptografia: somente dados validados seguem para criptografia.
- Modulo de Criptografia -> Armazenamento Local/Banco futuro: e-mail e salvo criptografado.
- Logs de Auditoria: registram eventos relevantes de seguranca durante o fluxo.

## 4. Implementacao Pratica

A implementacao pratica escolhida foi criptografia em um campo sensivel. O campo escolhido foi o e-mail do operador.

Tambem foi adicionado cadastro local para o operador criar a propria conta. A senha dessa conta e salva como hash PBKDF2 com salt, e o e-mail continua criptografado.

Arquivos:

- `src/security/cryptoService.js`
- `src/security/validators.js`
- `src/security/auditLogger.js`
- `src/security/securityREADME.md`
- `src/context/AuthContext.jsx`
- `src/pages/Login.jsx`
- `src/pages/OperatorProfile.jsx`

Trecho do codigo:

```js
const encryptedEmail = await encryptData(sensitiveEmail)
sessionStorage.setItem(SESSION_KEY, JSON.stringify({
  id: op.id,
  name: op.name,
  profile: op.profile,
  encryptedEmail,
}))
```

Campo original:

```txt
demo@orbitalguardian.com
```

Campo criptografado:

```txt
og:v1:IV_BASE64:DADO_CRIPTOGRAFADO_BASE64
```

Campo descriptografado:

```txt
demo@orbitalguardian.com
```

Log de auditoria esperado:

```txt
[SecurityAudit] dado_sensivel_criptografado
[SecurityAudit] conta_criada
[SecurityAudit] login_realizado
[SecurityAudit] dado_sensivel_descriptografado
```

Como testar:

1. Rodar `npm run dev`.
2. Clicar em `Criar conta`.
3. Informar nome, e-mail valido e senha com pelo menos 6 caracteres.
4. Abrir o console do navegador e verificar os logs `[SecurityAudit]`.
5. Abrir a tela `Perfil`.
6. Conferir o e-mail descriptografado e o valor criptografado exibido.
7. Abrir `sessionStorage.nebula_ops_session` e verificar que o campo salvo e `encryptedEmail`.
8. Abrir `localStorage.orbital_guardian_accounts` e verificar que a senha esta salva como `passwordHash`.

## 5. Integracao com GS e ODS

O Orbital Guardian lida com informacoes de monitoramento ambiental, regioes de risco, sensores, alertas e dados de operador. O modulo de ciberseguranca aumenta a confiabilidade da solucao ao proteger dados pessoais, reduzir risco de manipulacao indevida e registrar eventos relevantes de seguranca.

A seguranca e importante porque uma falha de integridade ou disponibilidade pode afetar a leitura de alertas ambientais e a priorizacao de resposta operacional.

Relacao com ODS:

- ODS 9: Industria, inovacao e infraestrutura. O modulo fortalece a infraestrutura digital do prototipo.
- ODS 11: Cidades e comunidades sustentaveis. A protecao dos dados ajuda solucoes de monitoramento urbano e ambiental a serem mais confiaveis.
- ODS 13: Acao contra a mudanca global do clima. A integridade dos alertas apoia respostas a riscos climaticos e ambientais.
