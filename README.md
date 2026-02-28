# Fumbled a Baddie - Retro Arcade GAME OVER

A Vite + Vanilla JS mini-site that recreates a 90s arcade GAME OVER vibe with CRT effects, countdown logic, modal scheduling, endings, audio synthesis, and a Konami easter egg.

## Run locally

```bash
npm install
npm run dev
```

## Build / preview

```bash
npm run build
npm run preview
```

## Environment variables

Create a `.env` file if needed (see `.env.example`). All client-exposed values must use the `VITE_` prefix.

- `VITE_API_URL` - Optional endpoint used for a lightweight availability check.

## Deploy

This is a static Vite build. Deploy the generated `dist/` folder to Vercel, Netlify, GitHub Pages, or any static host.

For Vercel-specific steps, see `DEPLOYMENT.md`.

## Operational readiness

Use this quick sequence before each release:

```bash
npm ci
npm run build
```

Then deploy `dist/` to your static host. For Vercel settings and rollback guidance, see `DEPLOYMENT.md`.

A GitHub Actions workflow is included at `.github/workflows/ci.yml` to verify builds on pull requests and pushes to `main`.

## Replace characters

Character art is loaded from the `public/assets` folder by default.

To customize, add or replace:

- `public/assets/kevin_character.png`
- `public/assets/brianna_character.png`

You can also override the paths with environment variables:

- `VITE_KEVIN_CHARACTER_SRC`
- `VITE_BRIANNA_CHARACTER_SRC`

## Easter egg

Enter Konami code:

`↑ ↑ ↓ ↓ ← → ← → B A`

It unlocks **SECOND CHANCE MODE** and reveals the one-time `+5 MIN` button.
