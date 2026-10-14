# imjaeseokk.github.io

Personal portfolio and technical notes for Jaeseok Heo, hosted with GitHub Pages.

The site uses Jekyll only for layouts, data, and Markdown collections. The interface is custom HTML, CSS, and vanilla JavaScript with no theme dependency.

## Content

- Profile: `_data/profile.yml`
- Projects: `_data/projects.yml`
- Experience and education: `_data/experience.yml`, `_data/education.yml`
- Notes: `_notes/*.md`
- Library: `_library/*.md` or `_library/*.html` with `category` set to `fonts`, `colors`, `ui-components`, or `commands`. Entries render in full inside their category page. Command entries can also specify `system` (Git, tmux, Linux, CMD, or PowerShell).
- Readlog: `_readlog/*.md` (`media_type` identifies 책, 유튜브, 칼럼, 아티클, 뉴스, etc.)

Readlog entries use front matter like this:

```yaml
---
title: "Entry title"
date: 2026-10-11
media_type: 책
description: "A short summary shown in the archive."
published: true
---
```

Recommended `media_type` values are `책`, `유튜브`, `칼럼`, `아티클`, `뉴스`, and `팟캐스트`.

Library entries use front matter like this (create `_library` when adding the first reference):

```yaml
---
title: "tmux session commands"
category: commands
system: tmux
description: "Creating, attaching to, and closing sessions."
published: true
---
```

Library category pages live in `reference-pages/` and keep their public `/library/.../` URLs.
You can write directly below a category page's front matter, or add separate references in
`_library/`. Both Markdown and HTML references need front matter. Existing Notes and Readlog
entries stay in their original collections.

Fenced Markdown code blocks and HTML `<pre><code>` blocks inside Library category pages
receive a Copy code button automatically. For a live component preview, put its markup
inside `<div class="reference-preview">...</div>` and add a code block containing the source.
Use scoped styles so a component demo does not change the site's navigation or typography.

For a color swatch and a button that copies its exact HEX value, use this in a reference:

```liquid
<div class="reference-preview" style="background:#3366FF; min-height:100px;"></div>
{% include copy-value.html value="#3366FF" label="Copy #3366FF" %}
```

Fonts can be previewed with ordinary HTML and CSS, followed by a Markdown explanation or
installation code block. Font files and reusable demo assets can live in `assets/`.

## Local development

```sh
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`.
