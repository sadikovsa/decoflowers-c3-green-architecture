# DecoFlowers — Зелёная архитектура · Ташкент

GitHub Pages: https://sadikovsa.github.io/decoflowers-c3-green-architecture/

Approved DecoFlowers design, with real brand photography, local assets and verified contact information.

## Preview locally

Run `python3 -m http.server 4173 --directory dist` and open http://localhost:4173/. Static HTML/CSS/JavaScript; no dependency installation or build required. Check JavaScript with `node --check dist/app.js`.

## GitHub Pages

`main` contains editable sources, design decisions and QA. `gh-pages` contains only the verified `dist/` snapshot. Pages is configured to serve the root of `gh-pages`. Relative asset paths support the repository URL. To publish an update, verify the source, commit `main`, then publish the same `dist` snapshot to `gh-pages`.

The brief dialog prepares editable text for copying/downloading; it does not send inquiries to a server. Brand phone and Instagram links work independently.

See `SEO.md` for indexing policy, `DESIGN.md` for approved design, and `qa/` for verification evidence. Earlier reports describe historical revisions. The original Git history is retained.
