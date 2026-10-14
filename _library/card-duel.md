---
title: Headsup
category: ui-components
description: For fun — 결정하기 어려운 두 선택지, 더 높은 카드에게 맡깁니다.
---

좋아요와 싫어요, 볼륨 올리기와 내리기. 못 고르겠으면 카드로 정해 봅니다.
작은 버튼을 누르면 좌우 카드가 돌아가고, 높은 쪽의 결과가 버튼에 남습니다.

{% capture card_duel_source %}{% include components/card-duel.html %}{% endcapture %}
<div class="reference-preview">{{ card_duel_source }}</div>

2부터 10, J, Q, K, A 순서로 비교합니다. 무늬는 승패에 영향을 주지 않으며,
동점은 제외하고 뽑습니다. 볼륨 예제는 선택만 표시하며 실제 기기 볼륨은 바꾸지 않습니다.

### Code

구현은 모듈에 두고, 사용할 때는 아래 세 줄만 붙이면 됩니다.

```html
<script type="module" src="https://imjaeseokk.github.io/assets/components/card-duel.js"></script>
<card-duel mode="volume"></card-duel>
<card-duel mode="reaction"></card-duel>
```

외부 라이브러리는 필요하지 않습니다. [전체 소스]({{ '/assets/components/card-duel.js' | relative_url }})를 저장해 자신의 사이트에서 제공할 수도 있습니다.
선택 결과는 `card-duel-choice` 이벤트의 `detail`로 받을 수 있습니다.

버튼을 작게 실험하는 방향은 [chadcn/ui](https://chad-cn.com/docs/components/button/)에서 영감을 받았습니다.
