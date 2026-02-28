# Fumbled a Baddie - Retro Arcade GAME OVER

A Vite + Vanilla JS retro landing page with CRT flavor, responsive character layout, live system notice data, and playful lock-in/logout interactions.

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

## Feature highlights

- **Responsive retro layout**
  - Desktop 3-column composition (left character / center UI / right character).
  - Tablet keeps both characters visible but smaller.
  - Mobile collapses to one column with a `SHOW CHARACTERS` toggle.
- **Live SYSTEM NOTICE data**
  - Date timer updates every second.
  - Local timezone and live time display.
  - Geolocation-backed location with manual fallback (`UNKNOWN SECTOR` if denied).
  - Attempts-to-reschedule persisted in `localStorage`.
- **Interaction polish**
  - Reusable component templates (Layout, NoticePanel, Button, Settings, Modal).
  - Accessible keyboard focus rings, focus-trapped modals, and Escape-to-close behavior.
  - Persisted Sound and Motion settings with reduced-motion defaults respected.
  - Lock In modal generates a shareable message with copy-to-clipboard support.

## Environment variables

Create a `.env` file if needed (see `.env.example`). All client-exposed values must use the `VITE_` prefix.

- `VITE_API_URL` - Optional endpoint used for a lightweight availability check.

## Deploy

This is a static Vite build. Deploy the generated `dist/` folder to Vercel, Netlify, GitHub Pages, or any static host.

For Vercel-specific steps, see `DEPLOYMENT.md`.
