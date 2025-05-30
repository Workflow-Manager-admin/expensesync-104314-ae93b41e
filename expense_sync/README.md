# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

### Supabase Authentication Setup

ExpenseSync uses Supabase to provide user authentication (sign up, login, logout) and user-specific data isolation.  
**Before you can connect your React app to Supabase, you must enable authentication and obtain two environment variables: `SUPABASE_URL` and `SUPABASE_ANON_KEY`.**

#### Step-by-Step: Enable Email/Password Auth on Supabase

1. **Go to the Supabase Dashboard**  
   Log in to your Supabase project at [https://app.supabase.com/](https://app.supabase.com/). Select your project.

2. **Open the Authentication Settings**  
   In the left sidebar, click on **"Authentication"** and then **"Providers"**.

3. **Enable Email Auth**  
   - Locate the "Email" provider.
   - Toggle the switch to **enable** "Email" as an authentication method.
   - (Optional) Configure the email templates and SMTP settings as desired. For most development cases, Supabase provides built-in email delivery.

4. **(Optional) Restrict or allow signups**  
   On the "Settings" tab, you can allow email signups immediately, or restrict them as needed for your app.

5. **Save Changes**  
   Click "Save" at the bottom if you changed any settings.

#### Getting Your Supabase Project Keys

1. In the Supabase Dashboard, in the left sidebar click on **Project Settings** (gear icon).
2. Go to the **"API"** section.
3. Locate the following (copy for use in your frontend app):
   - **Project URL** – This will be your `SUPABASE_URL`
   - **anon public API key** – This will be your `SUPABASE_ANON_KEY`

**DO NOT share the anon or service keys publicly. Only the anon key should be used in client applications.**

#### Setting Environment Variables

For local development, set the following in a `.env` file in `expense_sync/`:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

If you are deploying, configure these environment variables in your hosting provider (Vercel, Netlify, etc) as well.

#### Usage in React

When integrating Supabase in your React code (eg. with `@supabase/supabase-js`), access the environment variables as follows:
```js
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
```

> For a full guide on connecting React to Supabase Auth, see the [Supabase Docs: Auth Quickstart](https://supabase.com/docs/guides/auth/quickstarts/react).

---

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
