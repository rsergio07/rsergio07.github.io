# rsergio.com

Personal portfolio. Static HTML and CSS on GitHub Pages.

## How it works

`index.html` is **generated**. Do not edit it by hand — the next build
overwrites it, and CI fails if the committed copy does not match the data.

```
data/site.json   every word on the site
build.py         turns the data into index.html, sitemap.xml, robots.txt
style.css        the design
tools/           one-off asset generation
```

## Changing the site

```bash
# 1. edit the content
$EDITOR data/site.json

# 2. regenerate
python3 build.py

# 3. preview
python3 -m http.server 8000     # then open http://localhost:8000
```

`build.py` is standard library only. No pip install, no node, no build
service — GitHub Pages serves the committed `index.html` exactly as it does
today.

Open the preview over `http://localhost`, never as a `file://` path: the
page sets a Content Security Policy with `default-src 'self'`, which blocks
the stylesheet under a file origin and makes a working page look broken.

## The labs section

`data/site.json` has a `labs` block with an `enabled` flag:

```json
"labs": { "enabled": false, ... }
```

While it is `false`, `build.py` writes nothing about the channel into
`index.html`, `sitemap.xml`, or the JSON-LD. There is no hidden markup and
no link to find in the page source.

To publish it: set `"enabled": true`, run `python3 build.py`, commit.

## Regenerating assets

`assets/favicon.svg` and `assets/og-image.png` are generated:

```bash
python3 tools/gen_assets.py
```

Needs Pillow (`pip3 install Pillow`). Only re-run this after changing the
name or role on the image.
