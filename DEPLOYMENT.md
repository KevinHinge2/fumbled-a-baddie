# Deployment Guide (Vercel)

## 1) Preflight checks (local)

```bash
npm ci
npm run build
```

- Ensure the build succeeds and generates `dist/`.
- Verify there are no missing assets in the generated output.

## 2) Vercel project settings

Use these settings in Vercel:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci`

## 3) Environment variables

Only expose client-safe values prefixed with `VITE_`.

Example:

- `VITE_API_URL`

Set the same values for Preview and Production environments when appropriate.

## 4) Deployment flow

1. Push to your production branch (`main` by default).
2. Let Vercel build automatically.
3. Open the deployment URL and smoke-test the app.

## 5) Post-deploy smoke test

Validate the following:

- Page loads without console errors.
- Character assets render.
- Countdown logic and modals still behave correctly.
- Mobile viewport layout is usable.

## 6) Rollback

If a deploy is bad:

1. Promote the previous healthy deployment in Vercel **or**
2. Revert the commit on `main` and redeploy.
