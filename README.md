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

## Adding more photos (easiest way)

Photos are **not** linked to Google Drive — the site serves its own copies from
`public/images/`, and `content/site.json` lists which photo goes in which project.
To add or change photos, use the local upload page:

```
npm install        # first time only
npm run dev
```

Open http://localhost:5173/#/upload (or click **Upload** in the menu — it only
appears while running locally, never on the live site). There you can:

- **+ Add photos** to any project (or drag photos onto it). JPG, PNG and iPhone
  HEIC all work; they're resized and compressed automatically.
- Create a **New project** (title + category, e.g. Fashion / Commercial).
- Rename a project, pick its **Cover**, reorder (← →) or remove (×) photos.

Check the result on the site at http://localhost:5173, then click
**Publish (commit & push)**. Netlify redeploys once the change reaches the
branch it builds from (usually `main`).

### Bulk import from a folder

Put photos in `raw/<folder-name>/` and run `npm run process-images`; they land in
`public/images/<folder-name>/`. Then add their paths to `content/site.json`.
