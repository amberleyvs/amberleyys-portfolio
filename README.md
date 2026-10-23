# Amberley's portfolio

Personal site built with Next.js and exported as static files. Design is made with Claude Design with tweaks!

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit content

All text lives in `content/`, so most updates don't touch code.

| File | Holds |
| --- | --- |
| `site.json` | Name, tagline, links, photo, About text, 404 picture |
| `experience.json` | Roles, newest first |
| `projects.json` | Projects, their repo links and media |
| `off-the-clock.json` | Off the clock items and their media |
| `train.json` | The cats on the train |

Colours, fonts and sizes are in `styles/tokens.css`.

## Architecture

```
app/            Routes: the Home page, 404, and generated files (OG image, icons, sitemap, robots)
components/
  layout/       Header, mobile menu, footer, scroll-reveal observer
  hero/         Hero, typing tagline, train scene
  about/        About
  experience/   Experience and its timeline
  projects/     Project grid, cards, popup and repo links
  off-the-clock/
  ui/           Shared pieces: icons, photo, video, placeholder, See more
content/        JSON for all text and media paths
lib/            Typed content loader, page metadata, nav helpers
public/         Images, videos, resume
styles/         Design tokens and global styles
tests/          Vitest unit tests and Playwright browser tests
```

- `next build` exports plain HTML, CSS and JS into `out/`. There is no server or database.
- `lib/content.ts` loads the JSON in `content/` and gives it types. Components read from it, so changing text never means changing code.
- `app/page.tsx` stacks the sections in order. Each section folder holds the section and the parts only it uses. Anything shared lives in `ui/`.
- Components render on the server by default. Only the interactive parts run in the browser: the nav, typing text, train, project popup, See more and videos.
- Styling uses one CSS Module per component, with colours, sizes and timings from `styles/tokens.css`.
