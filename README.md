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

## Replace characters

Default character art is bundled from `src/assets`.

To customize, replace:

- `src/assets/kevin_character.svg`
- `src/assets/brianna_character.svg`

## Easter egg

Enter Konami code:

`↑ ↑ ↓ ↓ ← → ← → B A`

It unlocks **SECOND CHANCE MODE** and reveals the one-time `+5 MIN` button.
