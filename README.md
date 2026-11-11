# U of Toronto Graduate Astronomy Students Association

Source for the GASA website at https://www.astro.utoronto.ca/~gasa/. It's a static site made of HTML pages, one stylesheet compiled from SCSS (Bootstrap 5), and JavaScript libraries loaded from CDNs.

| Path | What it is |
| --- | --- |
| `index.html`, `calendar.html`, `droppings/` | Pages |
| `src/scss/` | SCSS sources. `node src/build-scss.js` compiles them into `css/styles.css`, which is generated, so don't edit it. |
| `js/scripts.js` | Site JavaScript |
| `img/` | Photos (`img/execs/` holds the exec headshots) |
| `members/` | Yearly member lists. See [members/README.md](members/README.md). |
| `.github/workflows/main.yml` | Builds and deploys the site on every push to `master` |

## Install

You need Git, Node.js (any current LTS) with npm, and Python 3 for the local server and the members script.

```bash
git clone https://github.com/uoftgasa/gasa-website.git
cd gasa-website
npm ci    # installs Bootstrap and the Sass toolchain from package-lock.json
```

## Run locally

```bash
node src/build-scss.js                          # compile SCSS -> css/styles.css
python3 -m http.server 8000 --bind 127.0.0.1    # then open http://127.0.0.1:8000/
```

- Serve the site over HTTP rather than opening `index.html` directly.
- After editing `src/scss/`, re-run `node src/build-scss.js` and refresh the page.
- `--bind 127.0.0.1` keeps the server private to your machine.

## Modify CSS

1. Edit `src/scss/`. Theme colours, fonts and spacing are in `variables/`.
2. Run `node src/build-scss.js`.
3. Check the result locally.
4. Commit both the SCSS and the regenerated `css/styles.css`. The deploy rebuilds the CSS anyway, but committing it keeps local previews in sync.

## Updating the members list

Each year a new members list needs to be added. For the steps to do this, see [members/README.md](members/README.md).

## Package and deploy

**Push or merge to `master`.** Changes go live about 5 minutes later. Other branches and pull requests are not deployed.

Notes:

- **Secrets:** the SSH step reads `HOST`, `USERNAME`, `PASSWORD` and `PORT` from Settings → Secrets and variables → Actions. If the server account's password changes, update `PASSWORD`.
- **Redeploying without changes:** there's no manual trigger. Re-run the latest run from the **Actions** tab, or push an empty commit (`git commit --allow-empty -m "Redeploy" && git push`).
- **Server-only files:** the live directory also holds things that aren't in this repo (`astrotours/`, `backups/`, `droppings/*/` and `.htaccess`, listed in `.gitignore`). Don't delete them if you deploy by hand.
