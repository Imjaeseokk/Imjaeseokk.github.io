---
layout: default
title: "Readlog"
permalink: /readlog/
---

## Readlog

<ul>
  {% for entry in site.readlog %}
    <li>
      <a href="{{ entry.url }}">{{ entry.title }}</a>
      <p>{{ entry.excerpt }}</p>
    </li>
  {% endfor %}
</ul>
