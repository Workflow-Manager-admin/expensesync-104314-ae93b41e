-- ExpenseSync Supabase SQL Schema
-- This file contains SQL statements to set up all necessary tables and constraints
-- for the ExpenseSync multi-user expense tracker app.
-- Run these via the Supabase SQL editor or dashboard.

----------------------------------------------------------------------
-- TABLE: categories
-- Each user has their own expense categories.
-- Fields:
--   id:          UUID PK, auto-generated.
--   user_id:     UUID of the owning user (references auth.users.id).
--   name:        Name of the category (e.g. 'Food', 'Travel').
--   color:       HEX or color label for the category UI.
--   created_at:  Timestamp of creation.
-- Constraints:
--   - (user_id, name) UNIQUE: A user cannot have two categories with the same name.
----------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, name)
);

comment on table public.categories is 'Expense categories, user-scoped. Each user can have multiple categories with unique names per user.';
comment on column public.categories.user_id is 'The Supabase Auth user ID who owns this category.';

----------------------------------------------------------------------
-- TABLE: expenses
-- Each row is a single expense record.
-- Fields:
--   id:          UUID PK, auto-generated.
--   user_id:     UUID of the user who owns this expense (references auth.users.id).
--   category_id: UUID FK to categories.id (nullable for "uncategorized").
--   amount:      Numeric, required. (e.g., 12.50)
--   currency:    Text (default 'USD', can be extended).
--   date:        Date the expense was made.
--   notes:       Optional text notes.
--   created_at:  Timestamp of record creation.
----------------------------------------------------------------------

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'USD',
  date date not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.expenses is 'Expense records. Each expense belongs to a user, optionally linked to a category.';
comment on column public.expenses.user_id is 'The Supabase Auth user ID who owns this expense.';
comment on column public.expenses.category_id is 'Links to public.categories (owned by the same user). Nullable for uncategorized expenses.';

----------------------------------------------------------------------
-- INDEXING & USAGE NOTES
----------------------------------------------------------------------

-- Index for rapid lookup by user (for both tables)
create index if not exists idx_categories_user_id on public.categories (user_id);
create index if not exists idx_expenses_user_id on public.expenses (user_id);

-- Index for filtering by category
create index if not exists idx_expenses_category_id on public.expenses (category_id);

----------------------------------------------------------------------
-- FOREIGN KEY INTEGRITY
-- - Cascading delete: When a user is deleted (via auth.users), all their
--   categories and expenses are deleted automatically.
-- - On deleting a category, expenses will have category_id set to NULL
--   but not deleted (preserves "uncategorized" data).
----------------------------------------------------------------------

----------------------------------------------------------------------
-- RECOMMENDED: ROW LEVEL SECURITY (RLS, define in Supabase dashboard)
-- Example RLS policies (DO NOT skip in production!):
-- 1. For both tables, only allow SELECT, INSERT, UPDATE, DELETE where user_id = auth.uid()
-- 2. Only allow INSERT where user_id = auth.uid()
-- 3. For categories: Prevent two categories with the same name for one user (enforced by unique constraint)
----------------------------------------------------------------------

----------------------------------------------------------------------
-- HOW TO USE
-- 1. Run this file in your Supabase project SQL editor.
-- 2. Afterward, set up Row Level Security (RLS). Suggested policy:
--      USING (user_id = auth.uid())
-- 3. Tables relate as follows:
--      - users (auth.users) 1:M categories (public.categories)
--      - users (auth.users) 1:M expenses (public.expenses)
--      - categories 1:M expenses via category_id (nullable)
-- 4. Always set user_id from the authenticated user's session/token.
-- 5. You may extend further with budgets, recurring expenses, or team/group abilities.
----------------------------------------------------------------------

-- END OF FILE
