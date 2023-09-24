# U of Toronto Graduate Astronomy Students Association

Commits in ``master`` branch will be auto-pusheded to department server under https://www.astro.utoronto.ca/gasa/ after ~5 minutes you have pushed commit to github

## Modifying CSS

We use scss to build the CSS stylesheet for the website. It makes it easier to, for example upgrade bootstrap version while keeping our own style. To build a new one

``npm i bootstrap autoprefixer upath sass shelljs`` and ``node src/build-scss.js`` in the root directory of this repository
