# Modulo de Ciberseguranca

## Implementacao pratica escolhida

Foi implementada criptografia em um campo sensivel do projeto Orbital Guardian. O campo escolhido foi o e-mail do operador autenticado, pois ele identifica o usuario e pode ser considerado dado pessoal pela LGPD.

No login e no cadastro local, o e-mail informado e criptografado antes de ser salvo no `sessionStorage`. Quando uma conta e criada, o app salva o e-mail criptografado no `localStorage` e salva a senha apenas como hash PBKDF2, nunca em texto puro. O app mantem o e-mail descriptografado apenas em memoria para exibicao no dashboard e no perfil do operador.

Arquivos da implementacao:

- `src/security/cryptoService.js`
- `src/security/validators.js`
- `src/security/auditLogger.js`
- `src/security/securityREADME.md`
- Integracao no login: `src/pages/Login.jsx`
- Cadastro local: `src/pages/Login.jsx`
- Integracao na sessao: `src/context/AuthContext.jsx`
- Evidencia visual no perfil: `src/pages/OperatorProfile.jsx`

## Campo sensivel criptografado

Campo: e-mail do operador.

Exemplo de uso:

```js
const encryptedEmail = await encryptData('demo@orbitalguardian.com')
const decryptedEmail = await decryptData(encryptedEmail)
const passwordHash = await createPasswordHash('senha123')
const passwordMatches = await verifyPasswordHash('senha123', passwordHash)
```

O valor salvo localmente segue o formato:

```txt
og:v1:IV_BASE64:DADO_CRIPTOGRAFADO_BASE64
```

A chave de criptografia usa `VITE_SECURITY_DEMO_KEY` quando existir. Caso a variavel de ambiente nao esteja configurada, o projeto usa uma chave de demonstracao academica. Em producao, a chave deve ser gerenciada fora do codigo-fonte, por variavel de ambiente ou cofre de segredos.

## Riscos considerados

| Ativo critico | Ameaca | Categoria STRIDE | Impacto | Mitigacao proposta |
| --- | --- | --- | --- | --- |
| Aplicativo mobile/web | Acesso nao autorizado as telas internas | Spoofing | Usuario indevido pode consultar alertas, regioes e dados operacionais | Rotas protegidas por estado de autenticacao e auditoria de acesso negado |
| Dados do usuario | Vazamento de e-mail ou identificador pessoal | Information Disclosure | Exposicao de dado pessoal e descumprimento de boas praticas LGPD | Criptografia do e-mail no armazenamento local |
| Modulo de alertas | Manipulacao indevida de status de ocorrencias | Tampering | Priorizacao incorreta ou encerramento falso de alertas ambientais | Logs de auditoria e controle local de status |
| Armazenamento local | Alteracao manual de dados salvos no navegador | Tampering | Sessao inconsistente ou dados invalidos no painel | Validacao, sanitizacao e tratamento de erro ao carregar sessao |
| API simulada ou futura API | Falha de disponibilidade, abuso de requisicoes ou DDoS | Denial of Service | App sem dados climaticos ou oficiais atualizados | Fallback para dados simulados, logs e recomendacao de hardening/API gateway na evolucao |

## Controles de seguranca aplicados

1. Criptografia de dados sensiveis: o e-mail do operador e criptografado com AES-GCM via Web Crypto API.
2. Hash de senha: contas locais usam PBKDF2 com salt, sem salvar senha em texto puro.
3. Validacao e sanitizacao de entradas: o login/cadastro valida e-mail, senha minima, campo obrigatorio, tamanho maximo e remove caracteres perigosos basicos.
4. Controle de acesso basico: rotas internas continuam protegidas por autenticacao local.
5. Monitoramento de logs: eventos de cadastro, login, logout, acesso negado, validacao e criptografia sao registrados pelo `auditLogger`.
6. Politica de armazenamento local: o dado sensivel fica criptografado no `sessionStorage` e `localStorage`; a senha fica apenas como hash.
7. Seguranca para API futura: a documentacao recomenda HTTPS, variaveis de ambiente, rotacao de chaves e validacao de payloads.

## Diagrama de seguranca

Fluxo proposto:

```txt
Usuario
  -> Aplicativo Orbital Guardian
  -> Modulo de Validacao
  -> Modulo de Criptografia
  -> Armazenamento Local / Banco futuro
  -> Logs de Auditoria
```

Onde cada controle entra:

- Modulo de Validacao: impede entradas vazias, malformadas ou com conteudo perigoso.
- Modulo de Criptografia: protege o e-mail antes de salvar localmente.
- Armazenamento Local/Banco: guarda apenas o e-mail criptografado no MVP.
- Logs de Auditoria: registra login, logout, criptografia, descriptografia e acesso negado.
- Controle de Acesso: bloqueia rotas internas quando nao existe usuario autenticado.

## Implementacao pratica

Trecho principal:

```js
const encryptedEmail = await encryptData(sensitiveEmail)
sessionStorage.setItem(SESSION_KEY, JSON.stringify({
  id: operator.id,
  name: operator.name,
  profile: operator.profile,
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

Log de auditoria gerado:

```txt
[SecurityAudit] dado_sensivel_criptografado
[SecurityAudit] conta_criada
[SecurityAudit] login_realizado
[SecurityAudit] dado_sensivel_descriptografado
```

## Como executar e testar

1. Execute o projeto:

```bash
npm run dev
```

2. Acesse o app no navegador.
3. Clique em `Criar conta`, informe nome, e-mail valido e senha com pelo menos 6 caracteres.
4. Abra o perfil e veja o e-mail descriptografado em memoria e o e-mail criptografado salvo na sessao.
5. Saia do app e entre novamente usando a conta criada.
6. Como alternativa para apresentacao rapida, clique em `Acessar demonstracao`.
7. Abra o console do navegador e verifique os eventos `[SecurityAudit]`.
8. No DevTools, confira `sessionStorage.nebula_ops_session` e veja que o e-mail salvo esta criptografado.
9. No DevTools, confira `localStorage.orbital_guardian_accounts` e veja que a senha esta salva como `passwordHash`.

## Evidencias recomendadas para o repositorio

- Print do login com validacao funcionando.
- Print da criacao de conta local.
- Print do console com eventos `[SecurityAudit]`.
- Print da tela de perfil exibindo e-mail descriptografado e valor criptografado.
- Print do `sessionStorage` mostrando `encryptedEmail`.
- Print do `localStorage` mostrando `passwordHash`.
- Print ou trecho dos arquivos `cryptoService.js`, `validators.js` e `auditLogger.js`.
- Print do `npm run build` concluindo com sucesso.

## Integracao com GS e ODS

O modulo de ciberseguranca protege dados do usuario, regioes monitoradas, alertas ambientais, armazenamento local e futuras APIs do Orbital Guardian. Como o projeto simula uma solucao baseada em dados ambientais e espaciais, a protecao dos dados ajuda a manter confiabilidade operacional e integridade das decisoes de emergencia.

Relacao com ODS:

- ODS 9: fortalece infraestrutura digital confiavel e inovadora.
- ODS 11: apoia cidades e comunidades mais resilientes ao proteger dados de monitoramento.
- ODS 13: ajuda solucoes de acao climatica a manter integridade, disponibilidade e confianca.
