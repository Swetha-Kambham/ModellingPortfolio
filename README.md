# Swetha Kambham — Modeling Portfolio

A minimalist, editorial modeling portfolio. Plain React (Vite), no backend — content
lives in [`content/site.json`](content/site.json) and photos in `public/images/`.

Pages: Home, Work (filterable by category), Digitals, About, Motion, Contact.
Routing is hash-based (`#/work`, `#/digitals`, ...), so no server-side redirect
rules are needed on static hosting.

## Local development

```
npm install
npm run dev
```

## Editing content

All text and photos are driven by `content/site.json`. You can either:

1. Edit that file directly and push, or
2. Use the `/admin` content editor (see below) — no code required.

### `/admin` — owner-only editor

`/admin` is a [Decap CMS](https://decapcms.org) editor gated by Netlify Identity
login. It is only usable by an invited account; the public site never shows an
edit UI. Saving in `/admin` commits directly to this repo's `main` branch and
Netlify redeploys automatically.

Setup (one-time, in the Netlify dashboard for this site):

1. **Site configuration → Identity → Enable Identity.**
2. Identity → **Registration** → set to "Invite only".
3. Identity → **Services → Git Gateway** → Enable Git Gateway.
4. Identity → **Invite users** → invite the owner's email. They'll get an email
   to set a password.
5. Visit `https://<your-site>.netlify.app/admin/` and log in.

## Adding more photos later

Drop new images anywhere under `public/images/` (or upload via `/admin`, which
saves into `public/images/`), then reference the path in `content/site.json`
(or add them through the relevant list in `/admin`).

If you have new HEIC photos to convert/resize in bulk, put them in `raw/general`
or `raw/digitals` and run:

```
npm run process-images
```
