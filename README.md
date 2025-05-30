# ExpenseSync Project – Onboarding, Setup & Usage Guide

ExpenseSync is a secure, multi-user expense management application. The project includes a React frontend and relies on Supabase for authentication, storage, and robust row-level security (RLS) to guarantee each user's data is fully isolated. This guide covers setup from scratch—including Supabase project creation, schema and RLS installation, environment variable configuration, and frontend usage—for a seamless onboarding experience.

---

## 1. Initial Supabase Setup

> You must have a Supabase account. If you don’t, register at [https://app.supabase.com/](https://app.supabase.com/).

### a. Create a New Supabase Project

1. Log in and create a new project in the Supabase Dashboard.
2. Set the database password and region as prompted. Remember your DB password (but it isn't used directly in the frontend).

### b. Enable Authentication

ExpenseSync requires Supabase Auth to manage sign-up and login:
1. In the dashboard sidebar, click **Authentication** > **Providers**.
2. Enable “Email” Auth. (Toggle the Email provider on.)
3. Optionally, configure allowed email domains, SMTP, or templates as needed for your project.
   - By default, Supabase provides dev-ready email delivery.
4. On the **Settings** tab, configure sign-up restrictions if your use case needs them.

### c. Get Project URL and anon public API Key

You need two values for your React app:
- **SUPABASE_URL** (Project URL)
- **SUPABASE_ANON_KEY** (anon public API Key)

Find them in **Project Settings > API** in the Supabase dashboard.

---

## 2. Database Schema and Row Level Security (RLS)

This app requires two SQL scripts to be applied in your Supabase project.

### a. Apply the Schema

1. In the dashboard, go to the **SQL Editor**.
2. Open the file [`expense_sync/supabase_schema.sql`](expense_sync/supabase_schema.sql) from this repo.
3. Paste the content into the SQL editor and RUN it.
   - This creates the `categories` and `expenses` tables, with user linkage and cascading constraints.

### b. Enable RLS and Add Security Policies

1. Still in the SQL Editor, open [`expense_sync/supabase_rls_policies.sql`](expense_sync/supabase_rls_policies.sql).
2. Copy-paste and RUN the entire script.
   - This enables RLS on all relevant tables and creates policies which guarantee each user only sees, changes, or deletes their own data.

**After running both scripts:**
- Tables are secure by default. Only authenticated users can CRUD their own `categories` or `expenses`.
- No backend code is needed for security; both client and DB enforce user-level isolation.

---

## 3. Configuring the React Frontend

This project’s frontend lives in [`expense_sync/`](expense_sync/). It is a standard React app (`create-react-app`).

### a. Environment Variables

Create a `.env` file inside the `expense_sync/` folder (not at the repo root). Add:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```
Replace with your own values from the Supabase dashboard.

Do **NOT** commit real keys to version control. The app reads these in [`expense_sync/src/supabaseClient.js`](expense_sync/src/supabaseClient.js).

### b. Install Frontend Dependencies

Open a terminal:

```bash
cd expense_sync
npm install
```

### c. Running the App

- Start for development:
  ```bash
  npm start
  ```
  - Opens [http://localhost:3000](http://localhost:3000)
- To run unit tests:
  ```bash
  npm test
  ```
- To build for production:
  ```bash
  npm run build
  ```

### d. Where the Keys Go

The environment variables are loaded by React via `process.env.*` and passed to the Supabase JS client (see [`src/supabaseClient.js`](expense_sync/src/supabaseClient.js)). Never hard-code your keys.

---

## 4. App Features & Data Isolation

### Main Features

- **User Authentication:** Secure sign-up, log-in, and log-out via Supabase Auth (see [`src/Signup.js`](expense_sync/src/Signup.js) and [`src/Login.js`](expense_sync/src/Login.js)).
- **Expense Management:** Add, edit, or delete expenses with fields for amount, date, notes, and category (`src/Expenses.js`, `src/ExpenseForm.js`).
- **Expense Categories:** Organize expenses with categories (create/edit/delete in [`src/Categories.js`](expense_sync/src/Categories.js)).
- **Real-time Updates:** Data automatically refreshes after changes (some additional real-time subscriptions may be added).
- **Multi-user Data Isolation:** 
  - RLS in Supabase enforces each user may only access their own data.
  - **Additionally, all queries in the frontend are client-side filtered by `user_id` (see `eq("user_id", user.id)` in code).**  
    This double-enforces isolation, providing a consistent, secure UX and preventing any accidental cross-user leaks at the UI level.

### Data Relationships

- Each user (via Supabase Auth) only sees their own expenses and categories (enforced both in frontend queries and via RLS on the backend).
- Categories are unique per user—duplicate names are blocked for a given user only.

### Directory and File Reference

- [`expense_sync/src/`](expense_sync/src/) – Source code for all React components, styles, Supabase client, and utilities.
- [`expense_sync/supabase_schema.sql`](expense_sync/supabase_schema.sql) – SQL file for DB table schema; **run this first** in Supabase SQL Editor.
- [`expense_sync/supabase_rls_policies.sql`](expense_sync/supabase_rls_policies.sql) – SQL for RLS security policy setup; **run this after the schema**.
- `.env` (create this yourself) – Holds your Supabase URL and anon key for local dev.

---

## 5. Important Manual Steps & Common Issues

- **DO NOT use your service_role or admin key in the frontend. Use only the anon key.**
- **.env** file must be in the `expense_sync/` folder, not the repo root.
- If you change Supabase keys, restart the frontend dev server.
- Always run schema SQL **before** policy SQL. Running out of order can cause script errors.

- If a user is stuck on “Loading…,” check the env variables and Supabase credentials.
- To avoid CORS or API errors, make sure your Supabase project is not in "Paused" status on the dashboard.

---

## 6. Contact & Support Notes

- For billing lockout, project access, or authentication trouble, refer to the [Supabase project support docs](https://supabase.com/docs).
- For app code issues, open an issue in your project repo or review the comments in source files for hints about structure and troubleshooting.
- Extend with new tables, summary views, or analytics by following the patterns in `supabase_schema.sql`, `Categories.js`, and `Expenses.js`.

---

## 7. Additional Resources

- [Supabase Docs – Getting Started](https://supabase.com/docs/guides/getting-started)
- [React Docs](https://reactjs.org/)
- [Supabase Auth Quickstart (React)](https://supabase.com/docs/guides/auth/quickstarts/react)

---

## 8. Feature Summary Table

| Feature                  | File(s) / Area                                    | Notes                        |
|--------------------------|---------------------------------------------------|------------------------------|
| Auth (Email Signup/Login)| `src/useAuth.js`, `Signup.js`, `Login.js`         | Supabase Auth                |
| User Data Isolation      | All queries: `eq("user_id", user.id)` + RLS       | Enforced in RLS & frontend   |
| Expenses CRUD            | `Expenses.js`, `ExpenseForm.js`                   | Per-user expenses            |
| Categories CRUD          | `Categories.js`                                   | Per-user categories          |
| Real-time updates        | Built-in Supabase JS fetch, easy to extend        | -                            |
| Fully client-driven UX   | No backend beyond Supabase                        | -                            |

---

## 9. TL;DR: Setup Checklist

1. Create Supabase project, enable Email Auth, get keys.
2. Run `supabase_schema.sql` THEN `supabase_rls_policies.sql` in SQL Editor.
3. Place keys in `.env` in `expense_sync/`.
4. `npm install`, then `npm start` in `expense_sync/`.
5. Sign up and track your first expense—securely!

---

Happy expense tracking! For code reference and support, see inline comments throughout the source code and consult the directory `expense_sync/README.md` for template and styling info.