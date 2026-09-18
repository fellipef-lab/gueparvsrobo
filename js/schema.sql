-- =====================================================================
-- Painel Guepar vs RobÔ — estrutura do banco
-- Cole tudo isto no SQL Editor do Supabase e clique em Run.
-- =====================================================================

-- ---------- Tabelas ----------
create table if not exists public.pecas (
  id          bigint generated always as identity primary key,
  nome        text    not null,
  estoque     integer not null default 0 check (estoque >= 0),
  min_estoque integer not null default 0 check (min_estoque >= 0),
  criado_em   timestamptz not null default now()
);

create table if not exists public.guepar_uso (
  id          bigint generated always as identity primary key,
  nome        text    not null,
  estoque     integer not null default 0 check (estoque >= 0),
  marca integer not null default 0 check (marca >= 0),
  criado_em   timestamptz not null default now()
);

create table if not exists public.fornecedores (
  id        bigint generated always as identity primary key,
  nome      text not null,
  contato   text,
  telefone  text,
  cnpj      text,
  criado_em timestamptz not null default now()
);

create table if not exists public.manutencoes (
  id        bigint generated always as identity primary key,
  nome      text not null,
  tipo      text not null default 'bateria',
  validade  date not null,
  criado_em timestamptz not null default now()
);

-- ---------- Segurança em nível de linha ----------
-- Sem isto, a chave anon publicada no HTML daria acesso livre ao banco.
alter table public.pecas        enable row level security;
alter table public.guepar_uso   enable row level security;
alter table public.fornecedores enable row level security;
alter table public.manutencoes  enable row level security;

-- Quem estiver logado lê e escreve; quem não estiver não enxerga nada.
do $$
declare t text;
begin
  foreach t in array array['pecas','guepar_uso','fornecedores','manutencoes'] loop
    execute format('drop policy if exists "acesso_autenticado" on public.%I', t);
    execute format(
      'create policy "acesso_autenticado" on public.%I
         for all
         to authenticated
         using (true)
         with check (true)', t);
  end loop;
end $$;

-- ---------- Sincronização em tempo real ----------
alter publication supabase_realtime add table public.pecas;
alter publication supabase_realtime add table public.guepar_uso;
alter publication supabase_realtime add table public.fornecedores;
alter publication supabase_realtime add table public.manutencoes;

-- ---------- Dados que já existiam no sistema_web.db ----------
insert into public.pecas (nome, estoque, min_estoque) values
  ('Bateria',  1,  1),
  ('Sensores', 4,  0),
  ('modulo',   2,  0),
  ('Suporte',  4,  0),
  ('Rodinha',  12, 12);

insert into public.fornecedores (nome, contato, telefone, cnpj) values
  ('Delta Limpeza de Vidros',       'Tiago',           '21 99439-7564', '48.501.713/0001-65'),
  ('Eco Boxes Pallets',             'Amanda',          '19 97129-6722', '19.749.735/0001-40'),
  ('Central de Embalagens Pallets', 'Ralph',           '19 98234-4972', '01.247.578/0001-00'),
  ('Total Plástico Pallets',        'Marcella Bastos', '11 2267-3750',  '07.965.311/0001-34'),
  ('Indumak Máquina Stretch',       'Israel',          '47 9710-0489',  '84.431.352/0001-91'),
  ('Força1 Locações',               'Ivan',            '21 99999-2880', '13.284.920/0001-20');

-- =====================================================================
-- Usuários: crie em Authentication > Users > Add user, com e-mail e senha.
-- O admin/1234 antigo não migra — senha em texto puro não vai para produção.
-- Desligue "Confirm email" em Authentication > Providers > Email enquanto testa.
-- =====================================================================
