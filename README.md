# FITPRO Online V6.1 — Release Candidate Estável

Aplicativo mobile-first de personal trainer online com Supabase.

## Fluxo funcional
1. Cadastro/login do aluno ou personal via Supabase Auth.
2. Aluno preenche avaliação inteligente.
3. `fitpro-analyze-assessment` faz triagem de segurança e cria uma prescrição automática.
4. Prescrição `ready` é publicada automaticamente em `fitpro_workouts` e `fitpro_exercises`.
5. Aluno executa o treino e registra séries, carga, repetições e RIR.
6. Ao concluir o treino, `fitpro-adapt-plan` recalcula a semana.
7. A adaptação é idempotente por semana: chamadas repetidas reutilizam a mesma revisão e não empilham alterações.
8. Personal vinculado pode acompanhar alunos, mensagens, avaliações e editar treinos opcionalmente.

## Supabase
Projeto conectado: `ciqzrrpsnhbsqafpbdsu`.

Edge Functions ativas:
- `fitpro-analyze-assessment`
- `fitpro-adapt-plan` (v2)

RLS está habilitado nas tabelas FITPRO. A adaptação possui índice único por aluno/período para impedir aplicação duplicada.

## IA generativa
A função de avaliação possui motor estruturado de fallback, portanto o fluxo continua funcionando sem provedor externo. Para análise generativa da OpenAI, configure `OPENAI_API_KEY` nos secrets das Edge Functions. O código mantém a chave somente no servidor; nunca no HTML.

## Segurança
Bandeiras vermelhas importantes (ex.: dor/pressão no peito ao esforço, desmaio importante, pressão não controlada ou cirurgia recente) bloqueiam a prescrição automática. Casos moderados recebem plano conservador automaticamente.

## PWA
Arquivos: `index.html`, `manifest.json`, `sw.js`.
O app web requer internet no primeiro carregamento para obter `supabase-js` pelo CDN. Depois, recursos visitados podem ser armazenados pelo service worker. Para APK, recomenda-se empacotar a dependência no bundle.

## Validações executadas nesta entrega
- Sintaxe JavaScript validada com `node --check`.
- Todos os handlers inline (`onclick`/`onsubmit`) correspondem a funções existentes.
- Cache do service worker atualizado para `fitpro-v6-1`.
- Prescrição agora publica `target_rir` explicitamente nos exercícios.
- Adaptação semanal protegida contra execução duplicada.
