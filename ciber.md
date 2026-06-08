Preciso implementar no meu projeto da Global Solution um Módulo de Cibersegurança conforme a atividade da FIAP.

O projeto é um protótipo acadêmico relacionado ao tema integrador “Segurança Cibernética em Soluções Baseadas no Ecossistema Espacial”. O sistema não precisa obrigatoriamente ter dispositivo IoT físico. Caso não exista IoT real no projeto, considerar como ativos críticos: aplicativo, API simulada ou futura API, dados de usuários, dados de localização/região de risco, módulo de alertas, armazenamento local e painel/dashboard.

A atividade de Cibersegurança pede três partes principais:

1. Identificação de Riscos e Ameaças
- Identificar de 3 a 5 ativos críticos da solução.
- Listar ameaças relacionadas ao projeto, como vazamento de dados, acesso não autorizado, manipulação de dados, falha de disponibilidade, DDoS ou alteração indevida de dados de monitoramento.
- Descrever impactos possíveis caso essas ameaças aconteçam.
- Usar apenas uma metodologia simplificada, preferencialmente STRIDE, por ser mais fácil de aplicar.

2. Controles de Segurança
Implementar ou documentar pelo menos 4 controles de segurança entre:
- Criptografia de dados sensíveis;
- Controle de acesso;
- Backup e recuperação;
- Monitoramento básico de logs;
- Validação de entrada de dados;
- Proteção contra dados inválidos ou malformados;
- Política simples de privacidade/LGPD;
- Segurança para comunicação com API futura;
- Hardening ou boas práticas de configuração.

3. Pequena Implementação Prática
A implementação prática escolhida será:
“Implementar criptografia em um campo sensível do projeto”.

Preciso que você implemente essa parte no código de forma simples, real e demonstrável.

Requisitos técnicos da implementação:

1. Criar uma pasta chamada:
src/security

2. Dentro dela, criar os seguintes arquivos:

- cryptoService.js
- validators.js
- auditLogger.js
- securityREADME.md

3. No arquivo cryptoService.js:
- Criar funções para criptografar e descriptografar um campo sensível.
- Pode usar uma biblioteca segura compatível com o projeto.
- Caso o projeto seja React Native/Expo, usar uma solução compatível com Expo.
- Caso seja Node.js, usar o módulo crypto nativo.
- O código deve conter:
  - encryptData(value)
  - decryptData(encryptedValue)
  - exemplo de uso
- O campo sensível pode ser e-mail, telefone, localização ou observação do usuário.
- Nunca deixar a chave secreta escrita diretamente de forma insegura no código final. Se necessário para protótipo acadêmico, deixar claro que é uma chave de demonstração e recomendar uso de variável de ambiente em produção.

4. No arquivo validators.js:
Criar funções de validação para:
- validar e-mail;
- validar senha mínima;
- validar campo obrigatório;
- validar tamanho máximo de texto;
- impedir entrada vazia ou malformada.

Criar funções como:
- validateEmail(email)
- validatePassword(password)
- validateRequired(value)
- validateMaxLength(value, max)
- sanitizeText(value)

A função sanitizeText deve remover ou neutralizar caracteres perigosos básicos, como tags HTML simples, scripts ou entradas que possam gerar XSS em uma aplicação real.

5. No arquivo auditLogger.js:
Criar uma função simples para registrar eventos importantes de segurança, como:
- login realizado;
- tentativa de acesso negado;
- dado sensível criptografado;
- dado sensível descriptografado;
- logout;
- erro de validação.

Criar função:
- logSecurityEvent(eventType, description)

O log pode ser exibido no console ou salvo em uma estrutura local simples, dependendo do tipo do projeto.

6. Integrar no projeto:
- Usar a validação no formulário de login ou cadastro.
- Usar criptografia em pelo menos um campo sensível.
- Usar log de auditoria quando o dado for criptografado ou quando houver tentativa de login/acesso.
- Se já existir tela de login, proteger o acesso às telas internas com uma verificação simples de usuário autenticado.
- Se não existir backend, manter a implementação local e deixar documentado que é um MVP acadêmico.

7. Criar o arquivo securityREADME.md explicando:
- Qual foi a implementação prática escolhida;
- Qual campo sensível foi criptografado;
- Quais riscos foram considerados;
- Quais controles de segurança foram aplicados;
- Como executar/testar a implementação;
- Quais evidências devem ser colocadas no repositório, como prints do código funcionando, logs no console e tela mostrando dado criptografado/descriptografado.

8. O projeto também precisa ter um conteúdo textual pronto para o Documento Técnico da GS, contendo:

Título: Módulo de Cibersegurança

Seção 1: Identificação de Riscos e Ameaças
Criar uma tabela com:
- Ativo crítico;
- Ameaça;
- Categoria STRIDE;
- Impacto;
- Mitigação proposta.

Usar ativos como:
- Aplicativo mobile/web;
- Dados do usuário;
- Módulo de alertas;
- Armazenamento local ou banco de dados;
- API simulada ou futura API.

Seção 2: Controles de Segurança
Listar no mínimo 4 controles:
- Criptografia de dados sensíveis;
- Validação e sanitização de entradas;
- Controle de acesso básico;
- Monitoramento de logs;
- Backup/recuperação ou política de retenção.

Seção 3: Diagrama de Segurança
Descrever um diagrama simples com:
Usuário → Aplicativo → Módulo de Validação → Módulo de Criptografia → Armazenamento Local/Banco → Logs de Auditoria

Indicar onde cada controle de segurança entra.

Seção 4: Implementação Prática
Explicar que foi implementada criptografia em um campo sensível do projeto.
Mostrar:
- trecho do código;
- campo original;
- campo criptografado;
- campo descriptografado;
- log de auditoria gerado.

Seção 5: Integração com GS e ODS
Explicar que a segurança protege dados do usuário, regiões monitoradas, alertas ambientais e informações sensíveis usadas na solução espacial/ambiental.
Relacionar com ODS, principalmente:
- ODS 9: Indústria, inovação e infraestrutura;
- ODS 11: Cidades e comunidades sustentáveis;
- ODS 13: Ação contra a mudança global do clima.

9. Não criar uma implementação muito complexa.
O professor pediu uma implementação pequena, mas real, com evidências.
O foco deve ser:
- código funcionando;
- organização;
- clareza;
- prints/logs para comprovar;
- README explicando a integração com a GS.

10. Entregar os arquivos prontos e organizados, sem quebrar o projeto atual.
Se for necessário instalar biblioteca, explicar exatamente qual comando usar.
Se o projeto já tiver uma estrutura existente, adaptar a implementação sem alterar telas que já funcionam.