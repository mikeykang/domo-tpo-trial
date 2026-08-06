(function () {
  var D = window.D, E = [];
  var CN = ['각질·모공', '붉은기·진정', '수분·건조', '톤·결'];
  var MO = ['아침 세안 후', '밤 세안 후', '화장 전', '급할 때·밖에서', '계절·컨디션'];
  var n = function (v) { return (v == null ? '-' : v.toLocaleString()); };
  var pc = function (v) { return (v == null ? '&mdash;' : v.toFixed(1) + '%'); };
  var sg = function (v) { return (v >= 0 ? '+' : '') + v.toFixed(1); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var ib = function (t) { return '<i class="ib" title="' + esc(t) + '">i</i>'; };

  // ── 머리
  E.push('<div class="top"><div>' +
    '<div class="kick">Concept &amp; TPO &middot; KR 10 + JP 5</div>' +
    '<h1>토너패드 제품 컨셉 · TPO</h1>' +
    '<div class="sub">한국 올리브영 상위 ' + D.corpus.krProducts + '종 · 일본 큐텐 판매랭킹 상위 ' + D.corpus.jpProducts + '종 (광고 제외)</div>' +
    '</div><div class="topmeta">' +
    '<span>리뷰 <b class="mono">' + n(D.corpus.krReviews) + '</b> + <b class="mono">' + n(D.corpus.jpReviews) + '</b></span>' +
    '<span>@cosme <b class="mono">' + n(D.corpus.jpCosme) + '</b></span>' +
    '<span>상세 <b class="mono">' + n(D.corpus.krDetail) + '</b></span>' +
    '<span>광고 <b class="mono">' + n(D.corpus.krAds) + '</b></span>' +
    '<span>UGC <b class="mono">' + n(D.corpus.krUgc) + '</b></span>' +
    '<span>수집 <b class="mono">' + D.collected + '</b></span>' +
    '</div></div>');

  // ── 답
  var m = D.moment;
  var demN = m.kr.review.n + m.kr.ugc.n + m.jp.qoo10.n + m.jp.cosme.n;
  E.push('<div class="panel dark ans">' +
    '<div class="lead">샤워 후, 머리 말리는 동안</div>' +
    '<div class="jp">お風呂上がり、髪を乾かす間 (목욕 후, 머리를 말리는 사이)</div>' +
    '<div class="gap">' +
    '<div class="gc dem"><div class="k">한국 리뷰</div><div class="v">' + m.kr.review.pct + '%</div><div class="s">' + n(m.kr.review.n) + ' / ' + n(m.kr.review.tot) + '건</div></div>' +
    '<div class="gc dem"><div class="k">일본 @cosme</div><div class="v">' + m.jp.cosme.pct + '%</div><div class="s">' + n(m.jp.cosme.n) + ' / ' + n(m.jp.cosme.tot) + '건 · 큐텐 ' + m.jp.qoo10.pct + '%</div></div>' +
    '<div class="gc sup"><div class="k">한국 상세페이지</div><div class="v">' + m.kr.detail.pct + '%</div><div class="s">' + n(m.kr.detail.tot) + '장 중 ' + m.kr.detail.n + '장</div></div>' +
    '<div class="gc sup"><div class="k">한국 메타 광고</div><div class="v">' + m.kr.ad.pct + '%</div><div class="s">' + n(m.kr.ad.tot) + '건 중 ' + m.kr.ad.n + '건</div></div>' +
    '<div class="gc sup"><div class="k">일본 광고 클레임 축</div><div class="v">없음</div><div class="s">진정 · 수분 · 계절 · 모공 · 화장 전만 존재</div></div>' +
    '</div>' +
    '<p style="color:#b5b5b5;margin-top:14px;font-size:12.5px">' +
    '고객 <b style="color:#fff">' + n(demN) + '명</b>이 말하는 순간을 상세페이지 ' + n(m.kr.detail.tot) + '장 중 ' + m.kr.detail.n + '장이 말한다. ' +
    '한국에서 이 순간의 언급 점유는 <b style="color:#fff">' + (m.slope ? m.slope + '배' : '상승') + '</b>로 오르는 중이다 (최근 12개월 대 그 이전, 리뷰 길이 보정 후).</p>' +
    '</div>');

  // ── TPO 격자
  var g = D.grid;
  var mx = 0; CN.forEach(function (c) { MO.forEach(function (o) { mx = Math.max(mx, g.kr[c + '|' + o], g.jp[c + '|' + o]); }); });
  var rows = '<tr><th style="width:96px"></th>' + MO.map(function (o) { return '<th style="text-align:center">' + o + '</th>'; }).join('') + '</tr>';
  CN.forEach(function (c) {
    rows += '<tr><td class="lab">' + c + '</td>' + MO.map(function (o) {
      var a = g.kr[c + '|' + o], b = g.jp[c + '|' + o], hi = Math.max(a, b) >= mx * 0.45;
      return '<td><div class="cell' + (hi ? ' hi' : '') + '"><div class="duo"><span class="a">' + a.toFixed(1) + '</span><span class="b">' + b.toFixed(1) + '</span></div>' +
        '<div class="bars"><i class="a" style="width:' + Math.max(2, a / mx * 34) + 'px"></i><i class="b" style="width:' + Math.max(2, b / mx * 34) + 'px"></i></div></div></td>';
    }).join('') + '</tr>';
  });
  E.push('<div class="panel"><div class="ph"><h3>TPO 격자 · 칸별 문장 점유' +
    ib('한국 리뷰 ' + n(D.corpus.krReviews) + '건에서 뽑은 문장 ' + n(g.krSent) + '개, 일본 ' + n(g.jpSent) + '개. 고민어와 순간어를 함께 담은 문장만 센다. 제품마다 리뷰 수가 달라 큰 제품이 시장을 대표하지 않도록 제품별 분포를 낸 뒤 동일가중 평균했다.') +
    '</h3><div class="lg"><span><i class="a"></i>한국 ' + D.corpus.krProducts + '종</span><span><i class="b"></i>일본 ' + D.corpus.jpProducts + '종</span></div></div>' +
    '<table class="cellgrid">' + rows + '</table></div>');

  // ── 축 요약
  var cmp = function (labels, a, b) {
    var top = Math.max.apply(null, a.concat(b));
    return labels.map(function (l, i) {
      return '<div class="cmp"><div class="cl">' + l + '</div>' +
        '<div class="side"><span class="nm">' + a[i].toFixed(1) + '%</span><span class="tk"><i class="a" style="width:' + (a[i] / top * 100) + '%"></i></span></div>' +
        '<div class="side"><span class="nm">' + b[i].toFixed(1) + '%</span><span class="tk"><i class="b" style="width:' + (b[i] / top * 100) + '%"></i></span></div></div>';
    }).join('');
  };
  E.push('<div class="two">' +
    '<div class="panel"><div class="ph"><h3>고민축' +
    ib('오염 토큰을 대칭으로 뺀 값이다. 한국 진정축의 35%가 열감 계열(쿨링 제품이 많아서), 일본 수분축의 13%가 에센스 양 어휘(ヒタヒタ 등)였다. 빼기 전 값은 한국 ' + g.krConcern.join('/') + ', 일본 ' + g.jpConcern.join('/') + ' 이고 격차 방향은 같다.') +
    '</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(CN, g.krConcernStrict, g.jpConcernStrict) +
    '<p>진정과 수분이 거의 뒤집혀 있다. 한국 진정 <b>' + g.krConcernStrict[1].toFixed(1) + '%</b> 대 일본 <b>' + g.jpConcernStrict[1].toFixed(1) + '%</b>, ' +
    '일본 수분 <b>' + g.jpConcernStrict[2].toFixed(1) + '%</b> 대 한국 <b>' + g.krConcernStrict[2].toFixed(1) + '%</b>.</p></div>' +
    '<div class="panel"><div class="ph"><h3>순간축</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(MO, g.krMoment, g.jpMoment) +
    '<p>화장 전이 양국 유일한 공통 순간이다 (한국 ' + g.krMoment[2].toFixed(1) + '% · 일본 ' + g.jpMoment[2].toFixed(1) + '%). ' +
    '일본은 아침, 한국은 계절로 갈린다.</p></div></div>');

  // ── 제품 성질
  E.push('<div class="panel"><div class="ph"><h3>제품이 가져야 하는 성질</h3>' +
    '<div class="hint">각 항목의 수치는 그 어휘를 담은 리뷰 비율. 길이대를 시장별로 고정했다 (한국 35~75자 · 일본 21~45자)</div></div><ul class="rule">' +
    D.props.map(function (p, i) {
      var f = p.full, d2 = function (v) { return v.toFixed(2) + '%'; };
      return '<li><div class="rh"><span class="rt">' + (i + 1) + '. ' + p.label + '</span>' +
        '<span class="pill kr">한국 ' + (f ? d2(f.kr) : pc(p.kr)) + '</span><span class="pill jp">일본 ' + (f ? d2(f.jp) : pc(p.jp)) + '</span>' +
        '<span class="pill">@cosme ' + (f ? d2(f.co) : pc(p.co)) + '</span>' + (f ? '<span class="pill">코퍼스 전량</span>' : '') + '</div>' +
        '<div class="rb">' + esc(p.note) + '</div></li>';
    }).join('') + '</ul>' +
    (function(){var f=D.props[3].full;return '<div class="quote">양면 · 앞뒤 언급, 코퍼스 전량 기준 &nbsp; 한국 <b>' + f.kr.toFixed(2) + '%</b> (' + n(f.krN) + '/' + n(f.krT) + ') &nbsp; 일본 큐텐 <b>' + f.jp.toFixed(2) + '%</b> (' + n(f.jpN) + '/' + n(f.jpT) + ') &nbsp; @cosme <b>' + f.co.toFixed(2) + '%</b> (' + n(f.coN) + '/' + n(f.coT) + ')</div></div>';})());

  // ── 시장별 프레임
  var sat = D.jpSatTot;
  E.push('<div class="two">' +
    '<div class="panel"><div class="ph"><h3>한국 <span class="pill kr">진정</span></h3></div>' +
    '<p>고민 언어의 <b>' + g.krConcernStrict[1].toFixed(1) + '%</b>가 진정이다. 최대 불만은 <b>효과를 모르겠다 ' + D.faults.filter(function (f) { return /효과/.test(f.lab); })[0].kb.toFixed(1) + '%</b> (배수 ' + D.faults.filter(function (f) { return /효과/.test(f.lab); })[0].kl.toFixed(1) + 'x).</p>' +
    '<p>컨셉 ' + D.dist.n + '개 중 재구매자 쪽으로 유의하게 기운 것은 <b>' + D.dist.sigPos + '개</b>, 첫구매자 쪽은 <b>' + D.dist.sigNeg + '개</b>다. ' +
    '브랜드 컨셉 평균 <b class="mono">' + sg(D.dist.brand) + 'pp</b>, 고객 컨셉 평균 <b class="mono">' + sg(D.dist.user) + 'pp</b>.</p>' +
    '<table class="auto" style="margin-top:10px"><tr><th>재구매자가 쓰는 말</th><th style="text-align:right;width:78px">리프트</th><th style="text-align:right;width:56px">n</th></tr>' +
    D.settle.slice(0, 5).map(function (r) {
      return '<tr><td><b>' + esc(r.label) + '</b><span class="pill">' + r.name + '</span></td>' +
        '<td class="n pos">' + sg(r.lift) + 'pp</td><td class="n">' + n(r.n) + '</td></tr>';
    }).join('') + '</table>' +
    '<p style="margin-top:11px">1위와 2위 사이가 <b>' + (D.settle[0].lift - D.settle[1].lift).toFixed(1) + 'pp</b>다. 성분 · 임상 · 인증 · 수치는 전부 ±1pp 안에 있다.</p></div>' +

    '<div class="panel"><div class="ph"><h3>일본 <span class="pill jp">각질</span></h3></div>' +
    '<p>고민 언어의 <b>' + g.jpConcernStrict[0].toFixed(1) + '%</b>가 각질 · 모공이다. 큐텐은 만족도를 3축 구조 필드로 받는데 <b>角質ケア(각질 케어)가 ' + D.corpus.jpProducts + '종 전부에서 최저</b>다.</p>' +
    '<table class="auto" style="margin-top:4px"><tr><th>제품</th><th style="text-align:right">化粧ノリ<br>화장먹힘</th><th style="text-align:right">トラブルケア<br>트러블</th><th style="text-align:right">角質ケア<br>각질</th></tr>' +
    D.jpSat.map(function (r) {
      return '<tr><td><b>' + r.name + '</b></td><td class="n">' + pc(r['化粧ノリ']) + '</td><td class="n">' + pc(r['トラブルケア']) + '</td>' +
        '<td class="n"><b>' + pc(r['角質ケア']) + '</b></td></tr>';
    }).join('') +
    '<tr><td style="color:var(--subtle)">イマイチ(아쉬움) 건수</td><td class="n">' + n(sat['化粧ノリ'].bad) + '</td><td class="n">' + n(sat['トラブルケア'].bad) + '</td><td class="n"><b>' + n(sat['角質ケア'].bad) + '</b></td></tr>' +
    '</table>' +
    '<p style="margin-top:11px">각질 불만을 <b>글로 쓴 비율은 0.01%</b>다. 일본 고객은 이 불만을 문장이 아니라 체크박스로만 남긴다.</p>' +
    '<p>가장 잘 하는 축인 화장먹힘은 <b>' + sat['化粧ノリ'].pct.toFixed(1) + '%</b>로 포화다.</p></div></div>');

  // ── 컨셉 이전
  var tl = function (title, list, note) {
    return '<div class="panel"><div class="ph"><h3>' + title + '</h3></div>' +
      '<table class="auto"><tr><th>컨셉</th><th style="text-align:right;width:52px">한국</th><th style="text-align:right;width:52px">일본</th><th style="text-align:right;width:60px">@cosme</th></tr>' +
      list.map(function (r) {
        return '<tr><td>' + esc(r.label) + '<span class="pill">' + r.name + '</span></td>' +
          '<td class="n">' + pc(r.k) + '</td><td class="n">' + pc(r.j) + '</td><td class="n" style="color:var(--subtle)">' + pc(r.co) + '</td></tr>';
      }).join('') + '</table>' + (note ? '<p>' + note + '</p>' : '') + '</div>';
  };
  E.push('<div class="two">' +
    tl('한국에서 크고 일본에 발판이 없다', D.transfer.krOnly.slice(0, 8),
      '거의 전부 쿨링 · 열감 계열이다. 큐텐과 @cosme 둘 다 낮은 것만 진짜 부재로 읽는다. 붉은기 진정은 큐텐 1.4%지만 @cosme 35.6%라 매체 차이지 부재가 아니다.') +
    tl('일본이 더 크게 말한다', D.transfer.jpMore.slice(0, 8),
      '@cosme는 장문이라 모든 항목이 높게 나온다. 컨셉끼리의 비교로만 읽는다.') + '</div>');
  E.push(tl('양국 공통', D.transfer.shared, null));

  // ── 통제쌍
  E.push('<div class="panel"><div class="ph"><h3>같은 SKU 통제쌍 · 셀퓨전씨 포스트알파 쿨링패드 70매' +
    ib('한국 13,291건(2022.06~2026.08) 대 일본 12,499건(2022.07~2026.08). 같은 물건이므로 차이는 제품 차이일 수 없다. 월 구성도 거의 같다(여름 54.2% 대 50.8%).') +
    '</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    '<table class="auto"><tr><th>컨셉</th><th style="text-align:right;width:66px">한국</th><th style="text-align:right;width:66px">일본 큐텐</th><th style="text-align:right;width:74px">일본 @cosme</th></tr>' +
    D.pair.map(function (r) {
      var big = r.kr > r.jp * 1.4 ? 'kr' : (r.jp > r.kr * 1.4 ? 'jp' : '');
      return '<tr><td><b>' + esc(r.lab) + '</b>' + (big ? '<span class="pill ' + big + '">' + (big === 'kr' ? '한국' : '일본') + '</span>' : '') + '</td>' +
        '<td class="n">' + pc(r.kr) + '</td><td class="n">' + pc(r.jp) + '</td><td class="n" style="color:var(--subtle)">' + pc(r.co) + '</td></tr>';
    }).join('') + '</table>' +
    '<p>한국 상품명은 <b>[진로 콜라보/아이스 쿨러 증정] 셀퓨전씨 포스트 알파 쿨링 패드 70매</b>, ' +
    '일본 상품명은 <b>毛穴ケア!ポストアルファクーリングパッド70枚 肌温度DOWN&amp;化粧ノリUP</b> (모공케어! 포스트알파 쿨링패드 70매 피부온도DOWN&amp;화장먹힘UP).</p></div>');

  // ── 불만
  E.push('<div class="panel"><div class="ph"><h3>불만이 무엇에 대한 불만인가' +
    ib('한국은 1~3점 리뷰, 일본은 큐텐 구조 필드에 イマイチ가 붙은 리뷰. 일본 평점은 리뷰 포인트 보상 때문에 5점이 88%라 쓸 수 없다. 배수는 각 시장 전체 대비. 일본 리뷰가 절반 길이라 시장 간 절대율은 비교하지 않는다.') +
    '</h3></div>' +
    '<table class="auto"><tr><th>속성</th><th style="text-align:right;width:74px">한국 불만</th><th style="text-align:right;width:56px">배수</th>' +
    '<th style="text-align:right;width:74px">일본 불만</th><th style="text-align:right;width:56px">배수</th></tr>' +
    D.faults.slice().sort(function (a, b) { return b.kl + b.jl - a.kl - a.jl; }).slice(0, 9).map(function (f) {
      return '<tr><td><b>' + esc(f.lab) + '</b></td><td class="n">' + pc(f.kb) + '</td><td class="n">' + f.kl.toFixed(1) + 'x</td>' +
        '<td class="n">' + pc(f.jb) + '</td><td class="n"><b>' + f.jl.toFixed(1) + 'x</b></td></tr>';
    }).join('') + '</table></div>');

  // ── 획득 언어
  E.push('<div class="panel"><div class="ph"><h3>첫 구매를 만들고 재구매는 안 만드는 말' +
    ib('제품 · 리뷰 길이 · 채널로 층화한 뒤 언급/미언급 재구매율 차이를 층 가중평균했다(Mantel-Haenszel 위험차). 재구매 어휘가 본문에 있는 리뷰는 통째로 제외해 플래그가 자기 자신을 읽는 누수를 막았다.') +
    '</h3><div class="hint">제품 일치 = 그 정규식이 잡히는 제품들에서 부호가 같은 비율</div></div>' +
    '<table class="auto"><tr><th>컨셉</th><th style="text-align:right;width:70px">리프트</th><th style="text-align:right;width:56px">z</th>' +
    '<th style="text-align:right;width:60px">n</th><th style="text-align:right;width:90px">제품 일치</th></tr>' +
    D.acquire.slice(0, 10).map(function (r) {
      return '<tr><td><b>' + esc(r.label) + '</b><span class="pill">' + r.name + '</span></td>' +
        '<td class="n neg">' + sg(r.lift) + 'pp</td><td class="n">' + r.z.toFixed(1) + '</td><td class="n">' + n(r.n) + '</td>' +
        '<td class="n">' + (r.nProd > 1 ? r.nProd + '종 ' + r.agree + '%' : '단일제품') + '</td></tr>';
    }).join('') + '</table></div>');

  // ── 기울기
  var sl = function (title, list) {
    return '<div class="panel"><div class="ph"><h3>' + title + '</h3></div>' +
      '<table class="auto"><tr><th>컨셉</th><th style="text-align:right;width:110px">언급 점유</th><th style="text-align:right;width:56px">배수</th></tr>' +
      list.map(function (r) {
        return '<tr><td>' + esc(r.label) + '<span class="pill">' + r.name + '</span></td>' +
          '<td class="n" style="color:var(--subtle)">' + r.older.toFixed(1) + '% → <b style="color:var(--ink)">' + r.recent.toFixed(1) + '%</b></td>' +
          '<td class="n">' + r.slope.toFixed(2) + 'x</td></tr>';
      }).join('') + '</table></div>';
  };
  E.push('<div class="two">' + sl('한국에서 뜨는 컨셉', D.slope.up.slice(0, 7)) + sl('한국에서 지는 컨셉', D.slope.down.slice(0, 7)) + '</div>');

  // ── 기각
  var k = D.killed;
  E.push('<div class="panel"><div class="ph"><h3>검증 후 기각한 것</h3></div><ul class="kill">' +
    '<li><div class="t"><s>눈에 보이는 증거가 재구매를 만든다</s></div><div class="b">' +
    '더마토리 검정 패드는 리뷰 ' + k.black.share.toFixed(1) + '%가 증거를 말한다. 제품 내 재구매 리프트는 <b class="mono">' + sg(k.black.lift) + 'pp</b> (z=' + k.black.z.toFixed(1) + ', n=' + n(k.black.n) + ') = 무효과. ' +
    '제품 간 비교로는 음의 상관으로 보이지만 그것은 판매기간 교란이다 (<b>판매기간 × 재구매율 r=' + k.ageCorr.toFixed(2) + '</b>). 해롭지는 않으니 획득 장치로는 쓸 수 있다.</div></li>' +
    '<li><div class="t"><s>성분 · 임상 · 인증 · 수치가 재구매를 만든다</s></div><div class="b">한국 재구매 리프트가 전부 ±1pp 안이다. 일본은 판매고 · 수상 언어 자체가 리뷰의 1.3%뿐이다.</div></li>' +
    '<li><div class="t"><s>모델 · 굿즈 · 콜라보</s></div><div class="b">' +
    D.acquire.filter(function (r) { return /원희|핑구|꿈돌이|아랑|백현/.test(r.label); }).map(function (r) { return esc(r.label) + ' ' + sg(r.lift) + 'pp'; }).join(' · ') +
    '. 제품 간 부호 일치 100%. 첫 판매는 되고 재구매는 안 된다.</div></li>' +
    '<li><div class="t"><s>화장 전을 정면으로 친다</s></div><div class="b">양국 유일한 공통 순간이지만 일본 화장먹힘 만족도가 ' + sat['化粧ノリ'].pct.toFixed(1) + '%로 포화다.</div></li>' +
    '</ul></div>');

  // ── 발
  E.push('<div class="foot">' +
    '<b>대상</b> 한국 = 올리브영 토너패드 상위 ' + D.corpus.krProducts + '종 (' + D.corpus.krNames.join(' · ') + '). ' +
    '일본 = 큐텐 「トナーパッド」 판매랭킹 상위 ' + D.corpus.jpProducts + '종, 광고 슬롯 제외 (' + D.corpus.jpNames.join(' · ') + ').<br>' +
    '<b>코퍼스</b> 리뷰 ' + n(D.corpus.krReviews) + ' + ' + n(D.corpus.jpReviews) + '건 · 일본 @cosme ' + n(D.corpus.jpCosme) + '건 · ' +
    '한국 상세페이지 이미지 ' + n(D.corpus.krDetail) + '장(OCR) · 한국 메타 광고 ' + n(D.corpus.krAds) + '건 · 한국 UGC ' + n(D.corpus.krUgc) + '건. 스냅샷 ' + D.collected + '.<br>' +
    '<b>보정</b> 재구매 리프트는 제품 · 리뷰 길이 · 채널로 층화. 리뷰 길이가 짧을수록 재구매율이 높고(30~40자 18.1% 대 100~150자 13.6%), ' +
    '출시 직후 리뷰가 2~4배 길다(브링그린 192자 → 44자). 두 교란을 잡지 않으면 기울기와 리프트가 모두 뒤집힌다.<br>' +
    '<b>단위</b> 시장 간 절대율은 비교하지 않는다. 한국 리뷰 중앙 49자, 일본 큐텐 24자, @cosme는 장문이다. ' +
    '비교는 같은 시장 안의 순위와 배수로만 한다. TPO 격자는 제품 동일가중.<br>' +
    '<b>한계</b> 일본 공급 표본이 ' + D.corpus.jpProducts + '종이다. 빈칸은 「일본에 없다」가 아니라 <b>「큐텐 판매랭킹 상위 ' + D.corpus.jpProducts + '종에 없다」</b>로만 쓸 수 있다. ' +
    '일본 상세페이지는 OCR하지 않아 일본 브랜드 주장은 리스팅 제목과 광고 문안까지만 잰다. 가격 · 원가 · 실제 전환은 이 데이터에 없다.<br>' +
    '<b>수집</b> 전부 공개 페이지에서 속도 제한을 지켜 수집. 원자료는 공개하지 않고 짧은 인용만 싣는다. 작성자 식별정보는 저장하지 않았다.' +
    '</div>');

  document.getElementById('app').innerHTML = E.join('');
})();
