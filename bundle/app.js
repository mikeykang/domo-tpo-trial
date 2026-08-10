(function () {
  var D = window.D, E = [];
  var CN = D.CN, MO = D.MO;
  var n = function (v) { return (v == null ? '-' : v.toLocaleString()); };
  var pc = function (v) { return (v == null ? '&mdash;' : v.toFixed(1) + '%'); };
  var p2 = function (v) { return (v == null ? '&mdash;' : v.toFixed(2) + '%'); };
  var sg = function (v) { return (v >= 0 ? '+' : '') + v.toFixed(1); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var ib = function (t) { return '<i class="ib" title="' + esc(t) + '">i</i>'; };
  var MK = { both: '양국', kr: '한국', jp: '일본' };
  var g = D.grid;

  // ── 머리
  E.push('<div class="top"><div>' +
    '<div class="kick">Bundle &amp; TPO &middot; SERUM + PAD &middot; KR 5 + JP 5</div>' +
    '<h1>세럼과 패드를 같이 파는 제품, 컨셉 후보 5</h1>' +
    '<div class="sub">세럼과 토너패드가 <b>한 SKU로 함께 오는</b> 리스팅만 골랐다 · 한국 올리브영 기획 ' + D.corpus.krProducts + '종 · 일본 큐텐 세트 ' + D.corpus.jpProducts + '종 · 같은 브랜드가 패드를 따로 파는 것은 대상이 아니다</div>' +
    '</div><div class="topmeta">' +
    '<span>리뷰 <b class="mono">' + n(D.corpus.krReviews) + '</b>' + ib('한국은 층화 표본이다. 올리브영 전체 ' + n(D.corpus.krSite) + '건 중 ' + (D.corpus.krReviews / D.corpus.krSite * 100).toFixed(1) + '%. 일본은 전량.') + ' + <b class="mono">' + n(D.corpus.jpReviews) + '</b></span>' +
    '<span>상세 <b class="mono">' + n(D.corpus.krDetail) + '</b></span>' +
    '<span>광고 <b class="mono">' + n(D.corpus.krAds) + '</b></span>' +
    '<span>수집 <b class="mono">' + D.collected + '</b></span>' +
    '</div></div>');

  // ── 대상 제품
  var padCell = function (p) { return '<td>' + esc(p.pad) + '</td>'; };
  E.push('<div class="panel"><div class="ph"><h3>대상 · 한 SKU로 세럼과 패드가 함께 오는 리스팅' +
    ib('선정: 브랜드 중복 제외, 리뷰 최다순. 선택형 리스팅은 리뷰의 옵션 필드로 실제 동시구매율을 확인한 뒤 채택했다. beplain(리뷰 5,586)은 2개 선택 리스팅인데 패드 선택이 4%라 제외, One-day\'s you(93,185)는 선택 7종이 전부 패드라 제외, APRILSKIN 세럼팩패드는 번들이 아니라 패드 자체가 세럼인 융합 제품이라 제외.') +
    '</h3></div><table class="auto"><tr><th>한국 · 올리브영 기획</th><th>세럼</th><th>패드</th><th style="text-align:right">리뷰</th><th style="text-align:right">커버리지</th><th style="text-align:right">패드 언급</th></tr>' +
    D.prod.map(function (p) { return '<tr><td><b>' + esc(p.name) + '</b></td><td>' + esc(p.serum) + '</td>' + padCell(p) +
      '<td class="n">' + n(p.revs) + '</td><td class="n">' + pc(p.cov) + '</td><td class="n">' + p2(p.padTalk) + '</td></tr>'; }).join('') +
    '</table><table class="auto" style="margin-top:12px"><tr><th>일본 · 큐텐 세트</th><th>세럼</th><th>패드</th><th style="text-align:right">리뷰</th><th style="text-align:right"></th><th style="text-align:right">패드 언급</th></tr>' +
    D.jprod.map(function (p) { return '<tr><td><b>' + esc(p.name) + '</b></td><td>' + esc(p.serum) + '</td>' + padCell(p) +
      '<td class="n">' + n(p.revs) + '</td><td class="n">전량</td><td class="n">' + p2(p.padTalk) + '</td></tr>'; }).join('') +
    '</table><p>한국 기획은 패드가 <b>2~10매 소량</b>이고 일본 세트는 대부분 <b>60~70매 본품</b>이다. 그 차이가 리뷰의 패드 언급률에 그대로 찍힌다 — 한국 평균 ' + p2(D.probes.find(function(x){return x.lab==='패드를 말한다'}).kr) + ' 대 일본 ' + p2(D.probes.find(function(x){return x.lab==='패드를 말한다'}).jp) + '.</p></div>');

  // ── 후보 색인
  var oneNum = {
    compose: '구성 +11.4pp 대 증정 −2.7pp',
    notstick: '세트 7.3% 대 패드단품 8.0%',
    kera: '일본 최대 칸 20.3% 대 한국 0.9%',
    volume: '효과 모르겠다 −8.8pp · 용량 +10.5pp',
    cospa: '세트 리스팅 최저축이 コスパ'
  };
  E.push('<div class="panel dark"><div class="ph"><h3 style="color:#fff">후보 컨셉 5 · 순위</h3>' +
    '<div class="hint" style="color:#8f8f8f">기준: 고객 언어에 이미 있고(수요) 브랜드 주장에 없다(공급). 카드마다 근거 전체를 붙였다</div></div>' +
    '<ul class="cidx">' + D.cand.map(function (c) {
      return '<li><span class="ci-r mono">' + c.rank + '</span><span class="ci-m ' + c.market + '">' + MK[c.market] + '</span>' +
        '<span class="ci-n">' + esc(c.name) + '</span><span class="ci-k mono">' + esc(oneNum[c.id] || '') + '</span></li>';
    }).join('') + '</ul></div>');

  // ── 후보 카드
  var evTable = function (title, rows) {
    return '<div class="evb"><div class="evh">' + title + '</div><table class="ev">' + rows.map(function (r) {
      return '<tr><td class="ek">' + esc(r[0]) + '</td><td class="evv mono">' + esc(r[1]) + '</td><td class="es">' + esc(r[2] || '') + '</td></tr>';
    }).join('') + '</table></div>';
  };
  D.cand.forEach(function (c) {
    var body = '<div class="evrow">' + evTable('수요 · 고객이 말한다', c.demand) + evTable('공급 · 브랜드가 판다', c.supply) + '</div>';
    body += '<ul class="why">' + c.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>';
    if (c.id === 'notstick') {
      body += '<table class="auto sub"><tr><th>리쥬란 한 리스팅 안의 구매 형태</th><th style="text-align:right">n</th><th style="text-align:right">평점</th><th style="text-align:right">리피트 언어</th><th style="text-align:right">둘 다 언급</th></tr>' +
        D.experiment.filter(function (e) { return e.k !== 'unknown'; }).map(function (e) {
          var nm = { set: '세트 (앰플+패드)', padOnly: '패드 단품', ampOnly: '앰플 단품' }[e.k];
          return '<tr><td><b>' + nm + '</b></td><td class="n">' + n(e.n) + '</td><td class="n">' + e.avg + '</td><td class="n' + (e.k === 'padOnly' ? ' pos' : '') + '">' + p2(e.rep) + '</td><td class="n">' + p2(e.both) + '</td></tr>';
        }).join('') + '</table>';
    }
    if (c.id === 'cospa') {
      body += '<table class="auto sub"><tr><th>일본 5종의 큐텐 강제 3축 (낮은 순)</th><th>1</th><th>2</th><th>3</th></tr>' +
        D.jpAxes.map(function (j) {
          return '<tr><td><b>' + esc(j.name) + '</b></td>' + j.axes.map(function (a, i) {
            return '<td class="n"' + (i === 0 ? ' style="color:var(--bad)"' : '') + '>' + esc(a.k) + ' ' + a.pct + '%</td>'; }).join('') + '</tr>';
        }).join('') + '</table><p style="margin-top:4px">세트로 등록된 리스팅(리쥬란·성분에디터)에는 <b>セット内容 · コスパ</b> 축이 붙고, 단품 세럼으로 등록된 리스팅에는 스페셜케어 축이 붙는다. 큐텐이 카테고리별로 다른 축을 강제한다.</p>';
    }
    body += c.quotes.map(function (q) {
      return '<div class="qt"><span class="pill">' + esc(q.name) + '</span> ' + esc(q.t) + (q.ko ? '<div class="qko">' + esc(q.ko) + '</div>' : '') + '</div>';
    }).join('');
    body += '<div class="risk"><b>깨지는 조건</b> ' + esc(c.risk) + '</div>';
    E.push('<div class="panel cand"><div class="ch">' +
      '<span class="cr mono">' + c.rank + '</span><div class="ct"><div class="cn">' + esc(c.name) + '</div>' +
      (c.jp ? '<div class="cj">' + esc(c.jp) + '</div>' : '') + '</div>' +
      '<div class="cp"><span class="pill ' + (c.market === 'jp' ? 'jp' : c.market === 'kr' ? 'kr' : '') + '">' + MK[c.market] + '</span>' +
      '<span class="pill">' + esc(c.cell) + '</span></div></div>' + body + '</div>');
  });

  // ── 진단 1: TPO 격자
  var mx = 0; CN.forEach(function (c) { MO.forEach(function (o) { mx = Math.max(mx, g.kr[c + '|' + o], g.jp[c + '|' + o]); }); });
  var rows = '<tr><th style="width:84px"></th>' + MO.map(function (o) { return '<th style="text-align:center">' + o + '</th>'; }).join('') + '</tr>';
  CN.forEach(function (c) {
    rows += '<tr><td class="lab">' + c + '</td>' + MO.map(function (o) {
      var a = g.kr[c + '|' + o], b = g.jp[c + '|' + o], hi = Math.max(a, b) >= mx * 0.45;
      return '<td><div class="cell' + (hi ? ' hi' : '') + '"><div class="duo"><span class="a">' + a.toFixed(1) + '</span><span class="b">' + b.toFixed(1) + '</span></div>' +
        '<div class="bars"><i class="a" style="width:' + Math.max(2, a / mx * 28) + 'px"></i><i class="b" style="width:' + Math.max(2, b / mx * 28) + 'px"></i></div></div></td>';
    }).join('') + '</tr>';
  });
  E.push('<div class="panel"><div class="ph"><h3>진단 1 · TPO 격자, 칸별 문장 점유' +
    ib('한국 리뷰에서 뽑은 문장 ' + n(g.krSent) + '개, 일본 ' + n(g.jpSent) + '개. 고민어와 순간어를 함께 담은 문장만 센다. 제품 동일가중. 순간축 마지막 「패드와 함께」는 이 문서 전용 축이다 — 패드를 언급한 문장.') +
    '</h3><div class="lg"><span><i class="a"></i>한국 ' + D.corpus.krProducts + '종</span><span><i class="b"></i>일본 ' + D.corpus.jpProducts + '종</span></div></div>' +
    '<table class="cellgrid">' + rows + '</table>' +
    '<p>일본 최대 칸이 <b>각질·모공 × 패드와 함께 ' + g.jp['각질·모공|패드와 함께'].toFixed(1) + '%</b>인데 한국 같은 칸은 <b>' + g.kr['각질·모공|패드와 함께'].toFixed(1) + '%</b>다. 22배 차이다. 일본은 세트를 사면 패드로 각질을 정리하고 세럼으로 수분을 넣는 두 단계로 쓰고, 한국은 그 역할 분담이 없다. 후보 3이 여기서 나온다.</p></div>');

  // ── 진단 2·3: 축
  var cmp = function (labels, a, b) {
    var top = Math.max.apply(null, a.concat(b));
    return labels.map(function (l, i) {
      return '<div class="cmp"><div class="cl">' + l + '</div>' +
        '<div class="side"><span class="nm">' + a[i].toFixed(1) + '%</span><span class="tk"><i class="a" style="width:' + (a[i] / top * 100) + '%"></i></span></div>' +
        '<div class="side"><span class="nm">' + b[i].toFixed(1) + '%</span><span class="tk"><i class="b" style="width:' + (b[i] / top * 100) + '%"></i></span></div></div>';
    }).join('');
  };
  E.push('<div class="two">' +
    '<div class="panel"><div class="ph"><h3>진단 2 · 고민축</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(CN, g.krConcern, g.jpConcern) +
    '<p>한국은 수분·진정으로, 일본은 각질·모공으로 기운다. 같은 조합(세럼+패드)인데 한국 기획은 수분 세럼 중심이고 일본 세트는 모공 세트 중심으로 팔린다.</p></div>' +
    '<div class="panel"><div class="ph"><h3>진단 3 · 순간축</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(MO, g.krMoment, g.jpMoment) +
    '<p>「패드와 함께」가 한국 ' + g.krMoment[6].toFixed(1) + '% 대 일본 ' + g.jpMoment[6].toFixed(1) + '%다. 일본 세트 리뷰의 3분의 1이 패드를 말한다. 한국은 계절·컨디션(' + g.krMoment[5].toFixed(1) + '%)으로 쏠린다.</p></div></div>');

  // ── 진단 4: 프로브 수요 대 공급
  E.push('<div class="panel"><div class="ph"><h3>진단 4 · 수요와 공급을 같은 자로' +
    ib('컨셉을 제품별로 새로 쓰지 않고 양국에 같은 뜻으로 존재하는 프로브 27개로만 쟀다. 이 문서의 단위는 「제품 컨셉」이 아니라 「두 물건을 한 SKU로 산 사람의 행동」이기 때문이다. 수요=리뷰, 공급=상세페이지 OCR ' + n(D.corpus.krDetail) + '장 + 메타 광고 ' + n(D.corpus.krAds) + '건.') +
    '</h3><div class="hint">리뷰(수요)와 상세·광고(공급)의 격차가 큰 순</div></div>' +
    '<table class="auto"><tr><th>프로브</th><th style="text-align:right;width:62px">리뷰</th><th style="text-align:right;width:62px">상세</th><th style="text-align:right;width:62px">광고</th><th style="text-align:right;width:62px">일본</th></tr>' +
    D.probes.slice().sort(function (a, b) { return (b.kr - Math.max(b.det, b.ad)) - (a.kr - Math.max(a.det, a.ad)); }).slice(0, 10).map(function (p) {
      var gap = p.kr - Math.max(p.det, p.ad);
      return '<tr><td><b>' + esc(p.lab) + '</b>' + (gap >= 5 ? '<span class="pill kr">공급 없음</span>' : '') + '</td>' +
        '<td class="n">' + p2(p.kr) + '</td><td class="n" style="color:var(--subtle)">' + p2(p.det) + '</td><td class="n" style="color:var(--subtle)">' + p2(p.ad) + '</td><td class="n">' + p2(p.jp) + '</td></tr>';
    }).join('') + '</table>' +
    '<p>「효과를 모르겠다」가 리뷰 ' + p2(D.probes.find(function(x){return x.lab==='효과를 모르겠다'}).kr) + '인데 상세 ' + p2(D.probes.find(function(x){return x.lab==='효과를 모르겠다'}).det) + ' · 광고 ' + p2(D.probes.find(function(x){return x.lab==='효과를 모르겠다'}).ad) + '다. 아무도 답하지 않는다. 반대로 「가성비」는 광고가 ' + p2(D.probes.find(function(x){return x.lab==='가성비·싸다'}).ad) + '로 크게 파는데 리뷰는 ' + p2(D.probes.find(function(x){return x.lab==='가성비·싸다'}).kr) + '다.</p></div>');

  // ── 진단 5: 재구매 리프트
  E.push('<div class="panel"><div class="ph"><h3>진단 5 · 재구매를 올리는 말과 깎는 말' +
    ib('제품 · 리뷰 길이 · 채널이 같은 그룹 안에서 그 말이 든 리뷰와 아닌 리뷰의 재구매율 차이를 내고 가중평균했다(Mantel-Haenszel). 재구매 어휘가 본문에 든 리뷰는 계산에서 뺐다(자기 자신을 세는 것을 막기 위해). 재구매 표본 3,301건.') +
    '</h3><div class="hint">읽는 법: 이 말을 쓴 고객은 같은 제품의 다른 고객보다 재구매가 그만큼 많다(적다)</div></div>' +
    '<table class="auto"><tr><th>말</th><th style="text-align:right;width:82px">재구매 차이</th><th style="text-align:right;width:56px">z</th><th style="text-align:right;width:64px">n</th><th style="text-align:right;width:110px">제품 일치</th></tr>' +
    D.lift.filter(function (r) { return r.n >= 150 && Math.abs(r.z) >= 2; }).map(function (r) {
      return '<tr><td><b>' + esc(r.lab) + '</b></td><td class="n ' + (r.lift >= 0 ? 'pos' : 'neg') + '">' + sg(r.lift) + 'pp</td>' +
        '<td class="n">' + r.z + '</td><td class="n">' + n(r.n) + '</td><td class="n">' + (r.nProd > 1 ? r.nProd + '종 중 ' + Math.round(r.nProd * r.agree / 100) + '종' : '1종') + '</td></tr>';
    }).join('') + '</table>' +
    '<p>같은 패드가 두 이름으로 불린다. <b>「구성」으로 읽히면 +11.4pp, 「증정·사은품」으로 읽히면 −2.7pp</b>다. 후보 1의 전부다. 그리고 가장 강한 음수는 「효과를 모르겠다」(z=−17.4)인데, 상세·광고 어디에도 답이 없다 — 후보 4.</p></div>');

  // ── 진단 6: 불만
  E.push('<div class="panel"><div class="ph"><h3>진단 6 · 불만이 무엇에 대한 불만인가' +
    ib('한국은 1~3점 리뷰, 일본은 큐텐 구조 필드에 イマイチ가 붙은 리뷰. 배수는 각 시장 전체 대비. 일본 리뷰가 짧아 시장 간 절대율은 비교하지 않는다.') +
    '</h3></div><table class="auto"><tr><th>속성</th><th style="text-align:right;width:78px">한국 불만</th><th style="text-align:right;width:52px">배수</th><th style="text-align:right;width:78px">일본 불만</th><th style="text-align:right;width:52px">배수</th></tr>' +
    D.faults.slice().sort(function (a, b) { return (b.kb + b.jb) - (a.kb + a.jb); }).map(function (f) {
      return '<tr><td><b>' + esc(f.lab) + '</b></td><td class="n">' + pc(f.kb) + '</td><td class="n">' + f.kl.toFixed(1) + 'x</td>' +
        '<td class="n">' + pc(f.jb) + '</td><td class="n">' + f.jl.toFixed(1) + 'x</td></tr>';
    }).join('') + '</table></div>');

  // ── 발
  E.push('<div class="foot">' +
    '<b>대상</b> 세럼(앰플·에센스)과 토너패드가 <b>한 SKU로 함께 오는</b> 리스팅만. 같은 브랜드가 패드를 따로 판다는 사실은 기준이 아니다. ' +
    '한국 = 올리브영 기획 ' + D.corpus.krProducts + '종 (' + D.corpus.krNames.join(' · ') + '), 브랜드 중복 제외 리뷰 최다순. ' +
    '일본 = 큐텐 세트 ' + D.corpus.jpProducts + '종 (' + D.corpus.jpNames.join(' · ') + ').<br>' +
    '<b>코퍼스</b> 리뷰 ' + n(D.corpus.krReviews) + ' + ' + n(D.corpus.jpReviews) + '건 · 한국 상세페이지 ' + n(D.corpus.krDetail) + '장(OCR) · 한국 메타 광고 ' + n(D.corpus.krAds) + '건. 스냅샷 ' + D.collected + '. 인용문은 전부 원문 문자열 대조로 검증했다(생성 없음).<br>' +
    '<b>단위</b> 이 문서는 「제품 컨셉」이 아니라 <b>「두 물건을 한 SKU로 산 사람의 행동」</b>을 잰다. 그래서 컨셉을 제품별로 authoring 하지 않고 양국 공용 프로브 27개로만 쟀다. 시장 간 절대율은 비교하지 않고 같은 시장 안의 순위·배수, 그리고 같은 리스팅 안의 통제 비교로만 읽는다.<br>' +
    '<b>한계</b> 한국 리뷰는 층화 표본이다 (' + n(D.corpus.krReviews) + ' / ' + n(D.corpus.krSite) + '건 = ' + (D.corpus.krReviews / D.corpus.krSite * 100).toFixed(1) + '%). 올리브영이 스트림당 500건에서 끊어서 피부타입 × 피부톤 42셀 · 정렬 5축 · 리뷰유형 4축으로 나눠 모았다. 메디큐브만 41.9%로 낮고 나머지 4종은 62.8~80.5%다. ' +
    '일본 상세페이지와 일본 광고는 수집하지 않았다(한국은 둘 다 수집). 재구매 리프트는 관찰 상관이지 실험이 아니다. 후보 2의 리쥬란 비교는 같은 리스팅 안이라 제품·기간은 통제되지만 옵션 선택이 무작위 배정은 아니다.<br>' +
    '<b>수집</b> 전부 공개 페이지에서 속도 제한을 지켜 수집. 작성자 식별정보는 수집하지 않았다.' +
    '</div>');

  document.getElementById('app').innerHTML = E.join('');
})();
