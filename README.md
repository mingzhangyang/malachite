# Malachite

Interactive procedural SVG artwork built with React + Vite, deployable on Cloudflare Workers.

## Prerequisites

- Node.js 20+
- Cloudflare account
- Wrangler auth (`npx wrangler login`)

## Local Development

1. Install dependencies:
   `npm install`
2. Run Vite dev server:
   `npm run dev`

## Cloudflare Worker Development

1. Build static assets:
   `npm run build`
2. Run Worker locally (serves `dist/` via `ASSETS` binding):
   `npm run cf:dev`

## Deploy to Cloudflare Workers

1. Login once:
   `npx wrangler login`
2. Deploy:
   `npm run cf:deploy`
3. Stream logs (optional):
   `npm run cf:tail`

## SEO/OG Assets

- OG SVG source: `public/og-malachite.svg`
- OG PNG image: `public/malachite-og-1200x630.png`
- SEO metadata: `index.html`
- robots/sitemap: `public/robots.txt`, `public/sitemap.xml`
