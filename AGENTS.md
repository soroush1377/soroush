# Horizon Properties — working notes

Premium real estate site: a Vite + React single-page app over an Express + PostgreSQL API.
Nothing here converts the app to another stack — the repo's own stack is the one that runs.

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d          # db → migrate → api → web
docker compose -f docker-compose.base44.yml ps             # wait for web to be healthy
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/
```

| Service | Host port | Notes |
| --- | --- | --- |
| `web` | 3000 → container 5173 | Vite dev server; the only public entry point |
| `api` | 8000 | Express; `/api/health` is the readiness probe |
| `db` | internal only | PostgreSQL 16, data in the `db-data` volume |

The catalogue is seeded by the one-shot `migrate` service, which applies `backend/src/schema.sql`
and upserts the records from `backend/src/data/properties.js` + `agents.js`. Re-run it after editing
that data:

```bash
docker compose -f docker-compose.base44.yml run --rm migrate
```

## Non-obvious things worth knowing

- **Single-origin wiring.** The browser only ever talks to port 3000. Vite proxies `/api` to the
  `api` service (`API_PROXY_TARGET`), so cookies/CORS never come into play. `CORS_ORIGINS` only
  matters if you hit port 8000 directly.
- **PostgreSQL 16 needs explicit casts on `LIMIT`/`OFFSET` parameters** (`LIMIT $1::int`), otherwise
  the query fails with `42P18 could not determine data type of parameter`. Already handled in
  `backend/src/routes/properties.js`; keep the casts when adding paginated queries.
- **Favourites are deliberately client-side** (`localStorage` key `horizon:favorites`, see
  `src/context/FavoritesContext.jsx`). There is no user accounts system, so saved homes are per
  browser. Enquiries, viewing requests and newsletter signups *are* persisted:
  `inquiries` and `newsletter_subscribers` tables.
- **Property copy lives in one place** — `backend/src/data/properties.js` (gallery paths, alt text,
  features, amenities, agent assignment). `frontend/src/lib/content.js` holds navigation, services,
  team-free marketing copy, filter options and contact details.
- **Imagery is local.** Every photo lives in `frontend/public/images/**` (downloaded from Pexels,
  free-to-use licence) so pages never depend on a third-party host. Card/hero images are the 1400px
  files, gallery thumbnails the `-thumb.jpg` 600px files. Fonts are self-hosted in
  `frontend/public/fonts` (latin subsets) — no external font or image requests at runtime.
- **The home hero is a scroll-scrubbed film, not a video player.** `components/home/Hero.jsx` picks
  between `ScrollVideoHero` (default) and a still `StillHero` for `prefers-reduced-motion`. The video
  never plays: a 300vh section pins a 100svh sticky stage and scroll progress 0→1 is mapped onto
  `video.currentTime` 0→duration inside one rAF loop (`SMOOTHING` lerp + a >0.02s write threshold).
  Keep it that way — calling `play()`, adding `loop`/`autoPlay`, or writing `currentTime` straight
  from a scroll handler all break the effect. The header stays transparent while `#home-hero` is
  pinned (see `Header.jsx`).
- **Hero video encoding is the performance budget.** Scrubbing decodes from the nearest keyframe, so
  the files in `frontend/public/videos/` are re-encodes of the supplied master (which had 2 keyframes
  over 9s and stutters): 1168×768 H.264 at CRF 23, `-g 8 -keyint_min 8 -sc_threshold 0`,
  `+faststart`, no audio (`hero-scrub.mp4`, 5.7 MB), an 854px `hero-scrub-mobile.mp4` (2.9 MB,
  chosen at mount below 768px — `media` on a `<source>` in `<video>` is ignored by browsers), and a
  VP9 `hero-scrub.webm` fallback. When replacing the film, keep a short GOP, faststart and a sane
  bitrate, or the experience will stutter no matter what the JS does. `images/hero-video-poster.jpg`
  is frame 0 and doubles as the poster/fallback layer.
- **The hero still photo** (`frontend/public/images/hero-dusk-villa.jpg`) is the reduced-motion
  visual (and the photo the film was made from). It came from a 736×480 design screenshot with its
  own header and headline baked in; those were removed so the live nav and copy are not duplicated.
- **Contrast tokens are load-bearing.** `champagne-deep` (#8A6A28) and `ink-faint` (#6E7684) exist
  specifically to reach ≥4.5:1 text contrast on white. Do not swap them back to the decorative gold
  (#C5A059) or a lighter grey for small text; use `champagne` / `champagne-soft` only on navy
  backgrounds, rules, and icons.
- **Filter state lives in the URL** (`/properties?location=Malibu&beds=4`), so results are shareable
  and the back button works. The search box is debounced 350 ms before it queries.

## Base44 preview overrides

The sandbox sets `BASE44_PREVIEW_MODE=1` (plus `BASE44_SANDBOX_HOST_DOMAIN`). Compose passes both
into the `web` service, and `frontend/vite.config.js` uses them only when
`process.env.BASE44_PREVIEW_MODE === '1'`:

- `server.allowedHosts` gains `.${BASE44_SANDBOX_HOST_DOMAIN}` — the preview proxy forwards
  `<port>-<sandbox id>.<domain>` as the Host header, and the sandbox id rotates.
- `server.watch.usePolling` is enabled, because bind mounts do not always emit inotify events.

With the flag unset, Vite keeps its stock behaviour (localhost-only host checking, native watching).
No other sandbox-specific code paths exist: the app is not auth-gated, so there is no host/origin/
cookie/redirect handling to relax, and no secret is required for it to boot.

## Working on the code

- The web dev server hot-reloads. The API runs `node --watch`; if a backend edit does not take,
  `docker compose -f docker-compose.base44.yml restart api`.
- There is no automated test suite configured in either package. Verify behaviour through the running
  app and the API:
  ```bash
  curl -s 'http://localhost:3000/api/properties?featured=true&limit=2' | head -c 200
  curl -s http://localhost:3000/api/properties/facets
  curl -s http://localhost:3000/api/properties/lakeside-modern-villa | head -c 200
  ```
- Useful checks after a UI change: no horizontal overflow at 375px/768px/1280px
  (`document.documentElement.scrollWidth <= clientWidth`), the featured carousel moves with its
  arrow buttons, and every route in `src/App.jsx` renders (no "page could not be found" scaffold).
- Database inspection:
  ```bash
  docker compose -f docker-compose.base44.yml exec db psql -U horizon -d horizon -c 'select slug from properties;'
  ```
  Credentials are development-only values defined inline in the compose file; they are not secrets.
