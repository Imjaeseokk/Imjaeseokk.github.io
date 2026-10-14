# imjaeseokk.github.io

Personal portfolio and technical notes for Jaeseok Heo, hosted with GitHub Pages.

The site uses Jekyll only for layouts, data, and Markdown collections. The interface is custom HTML, CSS, and vanilla JavaScript with no theme dependency.

## Content

- Profile: `_data/profile.yml`
- Projects: `_data/projects.yml`
- Experience and education: `_data/experience.yml`, `_data/education.yml`
- Notes: `_notes/*.md`
- Library: `_library/*.md` with `category` set to `fonts`, `colors`, `ui-components`, or `commands`. Command entries can also specify `system` (Git, tmux, Linux, CMD, or PowerShell).
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

## Local development

```sh
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000`.
