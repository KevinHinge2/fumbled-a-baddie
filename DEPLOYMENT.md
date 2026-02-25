# Deployment Guide (Vercel)

## Build

```bash
npm install
npm run build
```

## Vercel Settings

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## Environment Variables

- Use variables prefixed with `VITE_`.
- Example: `VITE_API_URL`

## Deploy

Push to the `main` branch (or your configured production branch) and let Vercel build automatically.
