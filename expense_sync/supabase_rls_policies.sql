-- ExpenseSync RLS and Policy Setup (for Supabase SQL Editor)
-- 
-- Each policy ensures users can only access and modify their own rows.
-- => Enable RLS, then define SELECT, INSERT, UPDATE, DELETE policies
-- 
-- INSTRUCTIONS:
-- 1. Run this script AFTER creating the tables in supabase_schema.sql
-- 2. Run each block in the Supabase SQL editor as needed

----------------------------------------------------------------------
-- Enable Row Level Security (RLS) for relevant tables
----------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.expenses enable row level security;

----------------------------------------------------------------------
-- POLICIES FOR CATEGORIES TABLE
----------------------------------------------------------------------

-- Allow SELECT only if user_id = current user's UID
create policy "Select own categories"
  on public.categories
  for select
  using (user_id = auth.uid());

-- Allow INSERT only if user_id = current user's UID
create policy "Insert own categories"
  on public.categories
  for insert
  with check (user_id = auth.uid());

-- Allow UPDATE only on rows where user_id = current user's UID
create policy "Update own categories"
  on public.categories
  for update
  using (user_id = auth.uid());

-- Allow DELETE only on rows where user_id = current user's UID
create policy "Delete own categories"
  on public.categories
  for delete
  using (user_id = auth.uid());

----------------------------------------------------------------------
-- POLICIES FOR EXPENSES TABLE
----------------------------------------------------------------------

-- Allow SELECT only if user_id = current user's UID
create policy "Select own expenses"
  on public.expenses
  for select
  using (user_id = auth.uid());

-- Allow INSERT only if user_id = current user's UID
create policy "Insert own expenses"
  on public.expenses
  for insert
  with check (user_id = auth.uid());

-- Allow UPDATE only on rows where user_id = current user's UID
create policy "Update own expenses"
  on public.expenses
  for update
  using (user_id = auth.uid());

-- Allow DELETE only on rows where user_id = current user's UID
create policy "Delete own expenses"
  on public.expenses
  for delete
  using (user_id = auth.uid());

----------------------------------------------------------------------
-- REVIEW
-- After running this, verify that:
-- - Only logged-in users can read/modify their own expenses and categories.
-- - Any queries that try to read/write other users' data will fail.
-- - Admin/Superuser access may need additional policies if required.
----------------------------------------------------------------------

-- END OF RLS POLICY SCRIPT
