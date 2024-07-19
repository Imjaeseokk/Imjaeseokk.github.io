---
layout: default
title: "yes Readlog"
permalink: /readlog/
---

## This is Readlog

<ul>
  {% for entry in site.readlog %}
    <li>
      <a href="{{ entry.url }}">{{ entry.title }}</a>
      <p>{{ entry.excerpt }}</p>
    </li>
  {% endfor %}
</ul>
