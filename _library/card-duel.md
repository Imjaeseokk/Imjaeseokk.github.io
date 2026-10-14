---
title: Card Duel
category: ui-components
description: For fun — 결정하기 어려운 두 선택지, 더 높은 카드에게 맡깁니다.
---

좋아요와 싫어요, 볼륨 올리기와 내리기. 못 고르겠으면 카드로 정해 봅니다.
어느 쪽 버튼을 눌러도 양쪽 카드가 나오고, 높은 쪽이 선택됩니다.

{% capture card_duel_source %}{% include components/card-duel.html %}{% endcapture %}
<div class="reference-preview">{{ card_duel_source }}</div>

2부터 10, J, Q, K, A 순서로 비교합니다. 무늬는 승패에 영향을 주지 않으며,
동점은 제외하고 뽑습니다. 볼륨 예제는 선택만 표시하며 실제 기기 볼륨은 바꾸지 않습니다.

### Code

HTML 파일에 아래 코드를 붙이면 실행됩니다. 외부 라이브러리는 필요하지 않습니다.
여러 개를 넣으려면 `<card-duel></card-duel>`을 추가하세요.
선택 결과는 `card-duel-choice` 이벤트의 `detail`로 받을 수 있습니다.

<pre><code class="language-html">{{ card_duel_source | escape }}</code></pre>

버튼을 작게 실험하는 방향은 [chadcn/ui](https://chad-cn.com/docs/components/button/)에서 영감을 받았습니다.
