# FITPRO Online V6.1

Versão estável para teste real do Personal Trainer Online com IA.

## Fluxo principal

Cadastro/Login → avaliação online → análise automática → prescrição → publicação da ficha → execução do treino → registro de séries → conclusão → adaptação semanal.

## Backend

Supabase Auth + PostgreSQL/RLS + Edge Functions `fitpro-analyze-assessment` e `fitpro-adapt-plan`.

## Deploy

O frontend é uma PWA estática. Para GitHub Pages, publique a raiz da branch `main`.
