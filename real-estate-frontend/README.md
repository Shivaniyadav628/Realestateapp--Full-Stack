# EstateHub Real Estate App

## Local development

Run the backend from `Documents/realestateapp`:

```powershell
npm start
```

Run the frontend from this folder in another terminal:

```powershell
npm run dev
```

The frontend uses `http://localhost:5000/api` only through the backend's local `/api` setup. In production, `VITE_API_URL` can point to a separately hosted API; when Express serves the built frontend, the app automatically uses the same-domain `/api` path.

## Deploy as one public URL

Keep `real-estate-frontend` and `realestateapp` together in the GitHub repository. Deploy the backend as a Node web service (for example, on Render) with:

- Build command: `npm install --prefix realestateapp && npm install --prefix real-estate-frontend && npm run build --prefix real-estate-frontend`
- Start command: `node realestateapp/server.js`
- Root directory: the repository root

Set these backend environment variables in the host dashboard: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `JWT_SECRET`. Use a hosted MySQL database; the local `.env` values cannot work on a public server. Set `FRONTEND_URL` to the deployed URL only when using a separate frontend host. The service URL is the single URL recruiters can open.

Never commit `.env`, database passwords, JWT secrets, or uploaded private files.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
