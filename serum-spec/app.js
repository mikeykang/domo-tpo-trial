(function () {
  var D = window.D, E = [];
  var CN = ['각질·모공', '붉은기·진정', '수분·건조', '톤·결'];
  var MO = ['아침 세안 후', '밤 세안 후', '토너 다음·크림 전', '화장 전', '급할 때·밖에서', '계절·컨디션'];
  var n = function (v) { return (v == null ? '-' : v.toLocaleString()); };
  var pc = function (v) { return (v == null ? '&mdash;' : v.toFixed(1) + '%'); };
  var p2 = function (v) { return (v == null ? '&mdash;' : v.toFixed(2) + '%'); };
  var sg = function (v) { return (v >= 0 ? '+' : '') + v.toFixed(1); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var ib = function (t) { return '<i class="ib" title="' + esc(t) + '">i</i>'; };
  var MK = { both: '양국', kr: '한국', jp: '일본' };
  var sat = D.jpSatTot;
  var g = D.grid;
  var KN = { esnature: '에스네이처', celladix: '셀라딕스', dermafactory: '더마팩토리', torriden: '토리든', mediheal: '메디힐',
    wellage: '웰라쥬', celimax: '셀리맥스', numbuzin: '넘버즈인', ordinary: '디오디너리', innisfree: '이니스프리',
    anua: 'Anua', cosrx: 'COSRX', feev: 'FEEV', skin1004: 'SKIN1004' };

  // ── 원자료 지연 로드 + 렌더
  var loaded = {};
  function lazy(f, cb) {
    if (loaded[f]) return cb();
    var s = document.createElement('script');
    s.src = f; s.onload = function () { loaded[f] = 1; cb(); };
    s.onerror = function () { alert('원자료 로드 실패: ' + f); };
    document.head.appendChild(s);
  }
  function evBtn(label, f, gname, k, extra) {
    return '<a class="evlink" data-f="' + f + '" data-g="' + gname + '" data-k="' + k + '"' + (extra || '') + '>' + label + '</a>';
  }
  var CHUNK = 300;
  function rowLine(r, badge) {
    var b = '';
    if (badge === 'eval') {
      if (typeof r[3] === 'string') b = r[3].split('|').map(function (x) {
        return '<span class="bpill' + (/아쉬움/.test(x) ? ' npill' : '') + '">' + x + '</span>'; }).join('');
    } else if (typeof r[3] === 'number' && r[3]) {
      if (badge === 're') b = '<span class="bpill">재구매</span>';
      if (badge === 'neg') b = '<span class="bpill npill">부정</span>';
    }
    return '<div class="evr"><span class="pill">' + (KN[r[0]] || r[0]) + '</span><span class="evd mono">' + esc(r[1] || '') + '</span>' +
      b + '<div class="evtw"><div class="evt">' + esc(r[2]) + '</div></div></div>';
  }
  function paneRender(pane) {
    var st = pane._st, q = st.q.trim();
    var arr = q ? st.arr.filter(function (r) { return r[2].indexOf(q) >= 0; }) : st.arr;
    var list = arr.slice(0, st.shown).map(function (r) { return rowLine(r, st.badge); }).join('');
    pane.querySelector('.evlist').innerHTML = list || '<div class="evr" style="color:var(--faint)">매치 없음</div>';
    pane.querySelector('.evcnt').textContent = (q ? arr.length.toLocaleString() + ' / ' : '') + st.arr.length.toLocaleString() + '건';
    pane.querySelector('.evmore').style.display = arr.length > st.shown ? '' : 'none';
  }
  function paneOpen(pane, title, arr, headHtml, note, badge) {
    pane.style.display = '';
    pane._st = { arr: arr, shown: CHUNK, q: '', badge: badge || '' };
    pane.innerHTML = '<div class="evhd"><b>' + title + '</b><span class="evcnt mono"></span>' +
      '<input class="evq" placeholder="본문 검색">' +
      (note ? '<span class="evnote">' + note + '</span>' : '') +
      '<a class="evclose">닫기</a></div>' + (headHtml || '') +
      '<div class="evlist"></div><a class="evmore">더 보기 (' + CHUNK + '건씩)</a>';
    paneRender(pane);
    pane.scrollIntoView({ block: 'nearest' });
  }
  document.addEventListener('input', function (e) {
    if (!e.target.classList.contains('evq')) return;
    var pane = e.target.closest('.evpane');
    pane._st.q = e.target.value; pane._st.shown = CHUNK; paneRender(pane);
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.classList.contains('evclose')) { t.closest('.evpane').style.display = 'none'; return; }
    if (t.classList.contains('evmore')) { var p = t.closest('.evpane'); p._st.shown += CHUNK; paneRender(p); return; }
    if (t.classList.contains('evlink')) {
      var f = t.dataset.f, gn = t.dataset.g, k = t.dataset.k, label = t.textContent;
      var pane = t.closest('.panel').querySelector('.evpane');
      lazy(f, function () {
        if (t.dataset.sup) {
          var S = window.EV1S;
          pane.style.display = '';
          pane.innerHTML = '<div class="evhd"><b>공급 원자료 · 덧바르기를 말하는 브랜드 자료 전부</b><a class="evclose">닫기</a></div>' +
            '<div class="evr"><span class="evt">한국 상세페이지 ' + n(D.corpus.krDetail) + '장 중 매치 <b>0장</b>. 10종 어느 브랜드도 이 사용법을 상세에 적지 않았다.</div></div>' +
            '<div class="evr" style="border-top:1px solid var(--line);margin-top:8px"><span class="evt"><b>메타 광고 매치 ' + S.adTotal + '건</b> (같은 문안 접어서 ' + S.ads.length + '종)</span></div>' +
            S.ads.map(function (a) { return '<div class="evr"><span class="pill">' + esc(KN[a.s] || a.s) + '</span>' + (a.n > 1 ? '<span class="bpill">같은 문안 ' + a.n + '건</span>' : '') + '<span class="evt">' + esc(a.b) + '</span></div>'; }).join('');
          pane.scrollIntoView({ block: 'nearest' });
          return;
        }
        var arr = window[gn][k];
        var head = '';
        if (t.dataset.sum) {
          head = '<table class="auto sub"><tr><th>제품</th><th style="text-align:right">매치</th><th style="text-align:right">매치 중 재구매</th><th style="text-align:right">그 제품 전체 재구매</th></tr>' +
            window.EV5.krSum.map(function (r) { return '<tr><td>' + KN[r[0]] + '</td><td class="n">' + r[1].toLocaleString() + '</td><td class="n"><b>' + r[2].toFixed(1) + '%</b></td><td class="n">' + r[3].toFixed(1) + '%</td></tr>'; }).join('') +
            '</table><p style="margin:4px 0 10px">원시 비율이라 층화 보정값과는 다르다. 방향 확인용.</p>';
        }
        var note = (k === 'jp' || k === 'co') ? '일본어 원문 그대로' : '';
        var badge = (k === 'kr') ? 're' : '';
        var title = label + ' · 매치 리뷰 전문';
        if (gn === 'EV2' && k === 'jp') {
          badge = 'eval';
          title = 'スペシャルケア(집중케어) イマイチ(아쉬움) 체크 리뷰 전문';
          note = '본문 매치가 아니라 구조 필드 매치다. 이 목록 전원이 집중케어 항목에 아쉬움을 체크했고, 본문은 제형 칭찬인 리뷰가 많다. 그 괴리 자체가 이 컨셉의 근거다. 행마다 그 고객의 3축 체크 결과를 붙였다';
        }
        paneOpen(pane, title, arr, head, note, badge);
      });
      return;
    }
    var cell = t.closest && t.closest('.evcell');
    if (cell) {
      var key = cell.dataset.gc;
      var pane2 = document.getElementById('evp-grid');
      lazy('evgrid.js', function () {
        var kr = window.EVG.kr[key] || [], jp = window.EVG.jp[key] || [];
        paneOpen(pane2, '칸 「' + key.replace('|', ' × ') + '」 · 한국 문장 ' + kr.length.toLocaleString() + ' + 일본 문장 ' + jp.length.toLocaleString(),
          kr.concat(jp), '', '일본 문장은 원문 그대로 · 부정 문장은 지우지 않고 실었다', 'neg');
      });
      return;
    }
    if (t.classList.contains('evfl')) {
      var m = t.dataset.m, lab = t.dataset.lab;
      var pane3 = document.getElementById('evp-faults');
      lazy('evfaults.js', function () {
        paneOpen(pane3, lab + ' · ' + (m === 'kr' ? '한국 1~3점' : '일본 イマイチ') + ' 매치 전문', window.EVF[m][lab] || [], '', m === 'jp' ? '일본어 원문 그대로' : '');
      });
      return;
    }
  });

  // ── 머리
  E.push('<div class="top"><div>' +
    '<div class="kick">Concept &amp; TPO &middot; SERUM &middot; KR 10 + JP 5</div>' +
    '<h1>세럼 제품 컨셉 후보 5</h1>' +
    '<div class="sub">한국 올리브영 에센스/세럼/앰플 상위 ' + D.corpus.krProducts + '종 · 일본 큐텐 「美容液」 판매랭킹 상위 ' + D.corpus.jpProducts + '종 (광고 제외) · 수요와 공급을 같은 자로 잰 결과 · 모든 수치는 눌러서 원자료를 연다</div>' +
    '</div><div class="topmeta">' +
    '<span>리뷰 <b class="mono">' + n(D.corpus.krReviews) + '</b> + <b class="mono">' + n(D.corpus.jpReviews) + '</b></span>' +
    '<span>@cosme <b class="mono">' + n(D.corpus.jpCosme) + '</b></span>' +
    '<span>상세 <b class="mono">' + n(D.corpus.krDetail) + '</b></span>' +
    '<span>광고 <b class="mono">' + n(D.corpus.krAds) + '</b></span>' +
    '<span>UGC <b class="mono">' + n(D.corpus.krUgc) + '</b></span>' +
    '<span>수집 <b class="mono">' + D.collected + '</b></span>' +
    '</div></div>');

  // ── 후보 색인 (다크)
  var oneNum = {
    layer: '수요 ' + n(D.moment.kr.review.n) + '건 · 공급 상세 0 / ' + D.corpus.krDetail + '장',
    special: '체크 아쉬움 ' + n(sat['スペシャルケア'].bad) + '건 · 5종 전부 최저',
    clock: '양국 1위 불만 · 상세 0 · 광고 0',
    mix: '수요 ' + n(Math.round(D.verbs[1].krN)) + '건 · 공식화한 브랜드 1곳',
    settle: '일본 리뷰의 ' + D.verbs[5].jp.toFixed(1) + '% · 상세 주장 0장'
  };
  E.push('<div class="panel dark"><div class="ph"><h3 style="color:#fff">후보 컨셉 5 · 순위</h3>' +
    '<div class="hint" style="color:#8f8f8f">기준: 고객 언어에 이미 있고(수요) 브랜드 주장에 없다(공급). 카드마다 근거 전체를 붙였다</div></div>' +
    '<ul class="cidx">' + D.cand.map(function (c) {
      return '<li><span class="ci-r mono">' + c.rank + '</span><span class="ci-m ' + c.market + '">' + MK[c.market] + '</span>' +
        '<span class="ci-n">' + esc(c.name) + '</span><span class="ci-k mono">' + esc(oneNum[c.id]) + '</span></li>';
    }).join('') + '</ul></div>');

  // ── 카드별 원자료 버튼 배선
  var EVMAP = {
    layer: { demand: { 0: [evBtn(n(D.moment.kr.review.n) + '건 전부 보기', 'ev1.js', 'EV1', 'kr')],
                       2: [evBtn(n(D.moment.jp.qoo10.n) + '건 전부 보기', 'ev1.js', 'EV1', 'jp'), evBtn('@cosme ' + n(D.moment.jp.cosme.n) + '건', 'ev1.js', 'EV1', 'co')] },
             supply: { 0: [evBtn('공급 원자료 열기', 'ev1sup.js', 'EV1S', 'ads', ' data-sup="1"')], 1: [evBtn('공급 원자료 열기', 'ev1sup.js', 'EV1S', 'ads', ' data-sup="1"')] } },
    special: { demand: { 0: [evBtn('체크 리뷰 ' + n(sat['スペシャルケア'].bad) + '건 전부 보기', 'ev2.js', 'EV2', 'jp')],
                         2: [evBtn('@cosme 효능 언급', 'ev2.js', 'EV2', 'co')] } },
    clock: { demand: { 0: [evBtn('한국 매치 전부 보기', 'ev3.js', 'EV3', 'kr')], 2: [evBtn('일본 매치 전부 보기', 'ev3.js', 'EV3', 'jp'), evBtn('@cosme', 'ev3.js', 'EV3', 'co')] } },
    mix: { demand: { 0: [evBtn('한국 매치 전부 보기', 'ev4.js', 'EV4', 'kr')], 2: [evBtn('일본 매치 전부 보기', 'ev4.js', 'EV4', 'jp')] } },
    settle: { demand: { 0: [evBtn('일본 매치 전부 보기', 'ev5.js', 'EV5', 'jp')],
                        1: [evBtn('한국 매치 전부 보기', 'ev5.js', 'EV5', 'kr', ' data-sum="1"')] } },
  };

  // ── 후보 카드 5장
  var evTable = function (title, rows, btnMap) {
    return '<div class="evb"><div class="evh">' + title + '</div><table class="ev">' + rows.map(function (r, i) {
      var btns = btnMap && btnMap[i] ? '<span class="evbtns">' + btnMap[i].join('') + '</span>' : '';
      return '<tr><td class="ek">' + esc(r[0]) + '</td><td class="evv mono">' + r[1] + '</td><td class="es">' + esc(r[2] || '') + btns + '</td></tr>';
    }).join('') + '</table></div>';
  };
  D.cand.forEach(function (c) {
    var m = EVMAP[c.id] || {};
    var body = '';
    body += '<div class="evrow">' + evTable('수요 · 고객이 말한다', c.demand, m.demand) + evTable('공급 · 브랜드가 판다', c.supply, m.supply) + '</div>';
    body += '<div class="evpane" style="display:none"></div>';
    body += '<ul class="why">' + c.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>';

    if (c.id === 'settle') {
      body += '<table class="auto sub"><tr><th>재구매를 확실히 올린 말 전부 (컨셉 ' + D.dist.n + '개 중 |z|≥3 인 양수 ' + D.dist.sigPos + '개)</th><th style="text-align:right;width:86px">재구매 차이</th><th style="text-align:right;width:64px">n</th></tr>' +
        D.settle.map(function (r) {
          return '<tr><td>' + esc(r.label) + '<span class="pill">' + r.name + '</span></td><td class="n pos">' + sg(r.lift) + 'pp</td><td class="n">' + n(r.n) + '</td></tr>';
        }).join('') + '</table>';
    }
    if (c.id === 'special') {
      body += '<table class="auto sub"><tr><th>제품</th><th style="text-align:right">スペシャルケア 집중케어</th><th style="text-align:right">浸透力 흡수력</th><th style="text-align:right">テクスチャー 제형</th></tr>' +
        D.jpSat.map(function (r) {
          return '<tr><td><b>' + r.name + '</b></td><td class="n"><b>' + pc(r['スペシャルケア']) + '</b></td><td class="n">' + pc(r['浸透力']) + '</td><td class="n">' + pc(r['テクスチャー']) + '</td></tr>';
        }).join('') +
        '<tr><td style="color:var(--subtle)">イマイチ(아쉬움) 건수</td><td class="n"><b>' + n(sat['スペシャルケア'].bad) + '</b></td><td class="n">' + n(sat['浸透力'].bad) + '</td><td class="n">' + n(sat['テクスチャー'].bad) + '</td></tr></table>';
    }
    body += c.quotes.map(function (q) {
      return '<div class="qt"><span class="pill">' + q.name + '</span> ' + esc(q.t) + (q.ko ? '<div class="qko">' + esc(q.ko) + '</div>' : '') + '</div>';
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
  var rows = '<tr><th style="width:88px"></th>' + MO.map(function (o) { return '<th style="text-align:center">' + o + '</th>'; }).join('') + '</tr>';
  CN.forEach(function (c) {
    rows += '<tr><td class="lab">' + c + '</td>' + MO.map(function (o) {
      var a = g.kr[c + '|' + o], b = g.jp[c + '|' + o], hi = Math.max(a, b) >= mx * 0.45;
      return '<td><div class="cell evcell' + (hi ? ' hi' : '') + '" data-gc="' + c + '|' + o + '" title="누르면 이 칸의 문장 전체"><div class="duo"><span class="a">' + a.toFixed(1) + '</span><span class="b">' + b.toFixed(1) + '</span></div>' +
        '<div class="bars"><i class="a" style="width:' + Math.max(2, a / mx * 30) + 'px"></i><i class="b" style="width:' + Math.max(2, b / mx * 30) + 'px"></i></div></div></td>';
    }).join('') + '</tr>';
  });
  E.push('<div class="panel"><div class="ph"><h3>진단 1 · TPO 격자, 칸별 문장 점유' +
    ib('한국 리뷰 ' + n(D.corpus.krReviews) + '건에서 뽑은 문장 ' + n(g.krSent) + '개, 일본 ' + n(D.corpus.jpReviews) + '건에서 ' + n(g.jpSent) + '개. 고민어와 순간어를 함께 담은 문장만 센다. 제품마다 리뷰 수가 달라 큰 제품이 시장을 대표하지 않도록 제품별 분포를 낸 뒤 동일가중 평균했다. 순간축 여섯 번째 「토너 다음·크림 전」은 패드에는 없던 세럼 전용 축이다.') +
    '</h3><div class="lg"><span><i class="a"></i>한국 ' + D.corpus.krProducts + '종</span><span><i class="b"></i>일본 ' + D.corpus.jpProducts + '종</span></div></div>' +
    '<table class="cellgrid">' + rows + '</table>' +
    '<div class="evpane" id="evp-grid" style="display:none"></div>' +
    '<p>칸을 누르면 그 칸에 실린 문장 전체(한국 ' + n(g.krSent) + ' + 일본 ' + n(g.jpSent) + ')가 열린다. 후보 1은 수분 × 토너 다음 칸(한국 ' + g.kr['수분·건조|토너 다음·크림 전'].toFixed(1) + '% 대 일본 ' + g.jp['수분·건조|토너 다음·크림 전'].toFixed(1) + '%), 후보 4는 각질·모공 축에 선다. 후보 2·3·5는 칸이 아니라 효능 축 전체에 걸린다.</p></div>');

  // ── 진단 2·3: 축 요약
  var cmp = function (labels, a, b) {
    var top = Math.max.apply(null, a.concat(b));
    return labels.map(function (l, i) {
      return '<div class="cmp"><div class="cl">' + l + '</div>' +
        '<div class="side"><span class="nm">' + a[i].toFixed(1) + '%</span><span class="tk"><i class="a" style="width:' + (a[i] / top * 100) + '%"></i></span></div>' +
        '<div class="side"><span class="nm">' + b[i].toFixed(1) + '%</span><span class="tk"><i class="b" style="width:' + (b[i] / top * 100) + '%"></i></span></div></div>';
    }).join('');
  };
  E.push('<div class="two">' +
    '<div class="panel"><div class="ph"><h3>진단 2 · 고민축' +
    ib('오염 토큰을 대칭으로 뺀 값이다. 한국 진정축에는 자극·트러블 어휘가, 일본 수분축에는 제형 어휘가 섞인다. 빼기 전 값은 한국 ' + g.krConcern.join('/') + ', 일본 ' + g.jpConcern.join('/') + ' 이고 격차 방향은 같다.') +
    '</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(CN, g.krConcernStrict, g.jpConcernStrict) +
    '<p>각질·모공이 갈린다. 한국 <b>' + g.krConcernStrict[0].toFixed(1) + '%</b> 대 일본 <b>' + g.jpConcernStrict[0].toFixed(1) + '%</b>. 한국 상위 10종은 절반이 모공·피지 세럼인데(더마팩토리 · 셀라딕스 · 디오디너리 · 이니스프리 · 에스네이처), 일본 상위 5종은 수분과 진정으로만 팔린다. 후보 4를 한국 전용으로 두는 이유다.</p></div>' +
    '<div class="panel"><div class="ph"><h3>진단 3 · 순간축</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(MO, g.krMoment, g.jpMoment) +
    '<p>세럼 전용 축인 「토너 다음·크림 전」이 한국 <b>' + g.krMoment[2].toFixed(1) + '%</b> 대 일본 <b>' + g.jpMoment[2].toFixed(1) + '%</b>다. 한국 고객은 루틴 안에서 세럼의 자리와 횟수를 스스로 정하고 그것을 리뷰에 쓴다. 일본은 아침(' + g.jpMoment[0].toFixed(1) + '%)으로 쏠린다. 화장 전은 양국 모두 작다 — 세럼은 패드와 달리 메이크업 준비물이 아니다.</p></div></div>');

  // ── 진단 4: 제품 성질
  E.push('<div class="panel"><div class="ph"><h3>진단 4 · 제품 성질 (어느 후보든 이 위에서 실행된다)</h3>' +
    '<div class="hint">각 항목의 수치는 그 어휘를 담은 리뷰 비율. 길이대를 시장별로 고정했다 (한국 35~75자 · 일본 21~45자)</div></div><ul class="rule">' +
    D.props.map(function (p, i) {
      var f = (p.full && p.full.kr != null) ? p.full : null;
      return '<li><div class="rh"><span class="rt">' + (i + 1) + '. ' + p.label + '</span>' +
        '<span class="pill kr">한국 ' + pc(p.kr) + '</span><span class="pill jp">일본 ' + pc(p.jp) + '</span>' +
        '<span class="pill">@cosme ' + pc(p.co) + '</span></div>' +
        '<div class="rb">' + esc(p.note) + '</div></li>';
    }).join('') + '</ul>' +
    (function () { var f = D.props[1].full; return '<div class="quote">덧바르기 · 레이어링 언급, 코퍼스 전량 기준 &nbsp; 한국 <b>' + f.kr.toFixed(2) + '%</b> (' + n(f.krN) + '/' + n(f.krT) + ') &nbsp; 일본 큐텐 <b>' + f.jp.toFixed(2) + '%</b> (' + n(f.jpN) + '/' + n(f.jpT) + ') &nbsp; @cosme <b>' + f.co.toFixed(2) + '%</b> (' + n(f.coN) + '/' + n(f.coT) + ')</div>'; })() + '</div>');

  // ── 진단 5: 통제쌍
  E.push('<div class="panel"><div class="ph"><h3>진단 5 · 같은 브랜드 통제쌍, 셀라딕스 131' +
    ib('한국 10종과 일본 5종에 동시에 들어 있는 유일한 브랜드다. 한국은 「트러블 세범 리밸런싱 131 앰플」, 일본은 「131ポアセラム」로 같은 라인이다. 리뷰 수는 한국 1,248건 · 일본 13,953건.') +
    '</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    '<table class="auto"><tr><th>컨셉</th><th style="text-align:right;width:66px">한국</th><th style="text-align:right;width:66px">일본 큐텐</th><th style="text-align:right;width:74px">일본 @cosme</th></tr>' +
    D.pair.map(function (r) {
      var big = r.kr > r.jp * 1.4 ? 'kr' : (r.jp > r.kr * 1.4 ? 'jp' : '');
      return '<tr><td><b>' + esc(r.lab) + '</b>' + (big ? '<span class="pill ' + big + '">' + (big === 'kr' ? '한국' : '일본') + '</span>' : '') + '</td>' +
        '<td class="n">' + pc(r.kr) + '</td><td class="n">' + pc(r.jp) + '</td><td class="n" style="color:var(--subtle)">' + pc(r.co) + '</td></tr>';
    }).join('') + '</table>' +
    '<p>같은 라인인데 한국은 피지·트러블을 말하고 일본은 재구매를 말한다. 한국 상품명은 <b>「트러블 세범 리밸런싱 131 앰플」</b>(피지 연화), 일본 상품명은 <b>「131ポアセラム」</b>(131 포어세럼)로 일본 쪽이 고민을 한 단어로 줄였다. 제품이 같으므로 이 차이는 제품 차이가 아니라 시장의 말하기 차이다.</p></div>');

  // ── 진단 6: 불만
  E.push('<div class="panel"><div class="ph"><h3>진단 6 · 불만이 무엇에 대한 불만인가' +
    ib('한국은 1~3점 리뷰, 일본은 큐텐 구조 필드에 イマイチ가 붙은 리뷰. 일본 평점은 리뷰 포인트 보상 때문에 5점에 몰려 쓸 수 없다. 배수는 각 시장 전체 대비. 일본 리뷰가 절반 길이라 시장 간 절대율은 비교하지 않는다.') +
    '</h3><div class="hint">불만 비율을 누르면 매치 리뷰 전문이 열린다</div></div>' +
    '<table class="auto"><tr><th>속성</th><th style="text-align:right;width:86px">한국 불만</th><th style="text-align:right;width:56px">배수</th>' +
    '<th style="text-align:right;width:86px">일본 불만</th><th style="text-align:right;width:56px">배수</th></tr>' +
    D.faults.map(function (f) { return f; }).sort(function (a, b) { return (b.kb + b.jb) - (a.kb + a.jb); }).slice(0, 9).map(function (f) {
      return '<tr><td><b>' + esc(f.lab) + '</b></td>' +
        '<td class="n"><a class="evfl" data-m="kr" data-lab="' + esc(f.lab) + '">' + pc(f.kb) + '</a></td><td class="n">' + f.kl.toFixed(1) + 'x</td>' +
        '<td class="n"><a class="evfl" data-m="jp" data-lab="' + esc(f.lab) + '">' + pc(f.jb) + '</a></td><td class="n"><b>' + f.jl.toFixed(1) + 'x</b></td></tr>';
    }).join('') + '</table>' +
    '<div class="evpane" id="evp-faults" style="display:none"></div>' +
    '<p>양국 1위가 같다 — 「효과를 모르겠다」. 후보 3의 출발점이다. 그 다음이 갈린다: 한국은 트러블과 밀림, 일본은 끈적임과 향이다. 세럼은 패드와 달리 즉각 감각이 없어서, 불만이 「나쁘다」가 아니라 「모르겠다」로 나온다.</p></div>');

  // ── 진단 7: 컨셉 이전
  var tl = function (title, list, note) {
    return '<div class="panel"><div class="ph"><h3>' + title + '</h3></div>' +
      '<table class="auto"><tr><th>컨셉</th><th style="text-align:right;width:52px">한국</th><th style="text-align:right;width:52px">일본</th><th style="text-align:right;width:60px">@cosme</th></tr>' +
      list.map(function (r) {
        return '<tr><td>' + esc(r.label) + '<span class="pill">' + r.name + '</span></td>' +
          '<td class="n">' + pc(r.k) + '</td><td class="n">' + pc(r.j) + '</td><td class="n" style="color:var(--subtle)">' + pc(r.co) + '</td></tr>';
      }).join('') + '</table>' + (note ? '<p>' + note + '</p>' : '') + '</div>';
  };
  E.push('<div class="two">' +
    tl('진단 7 · 한국에서 크고 일본에 발판이 없다', D.transfer.krOnly.slice(0, 8),
      '자극·트러블 서사와 가성비 서사가 대부분이다. 큐텐과 @cosme 둘 다 낮은 것만 진짜 부재로 읽는다 — @cosme에서만 높은 항목(무향료 · 저자극 인증)은 부재가 아니라 매체 차이다.') +
    tl('일본이 더 크게 말한다', D.transfer.jpMore.slice(0, 8),
      '전부 재구매·정착 계열이다. 일본 리뷰의 기본형이 「또 샀다」라서 그렇다. 후보 5가 여기서 나온다.') + '</div>');

  // ── 진단 8: 획득 언어
  E.push('<div class="panel"><div class="ph"><h3>진단 8 · 처음 사게는 해도, 다시 사게 하지는 못하는 말' +
    ib('계산법: 제품 · 리뷰 길이 · 채널이 같은 그룹 안에서 그 말이 든 리뷰와 아닌 리뷰의 재구매율 차이를 내고 가중평균했다(Mantel-Haenszel). 재구매라는 단어가 본문에 든 리뷰는 계산에서 뺐다(자기 자신을 세는 것을 막기 위해). 한국 컨셉 165개 중 n>=120인 ' + D.dist.n + '개가 대상이고, |z|>=3 인 것이 ' + D.dist.sig + '개(양수 ' + D.dist.sigPos + ' · 음수 ' + D.dist.sigNeg + ')다. 컨셉별 대표 인용은 한국 10종 컨셉 리포트(../serum/)에 있다.') +
    '</h3><div class="hint">읽는 법: 이 말을 쓴 고객은 같은 제품의 다른 고객보다 재구매가 그만큼 적다</div></div>' +
    '<table class="auto"><tr><th>말</th><th style="text-align:right;width:90px">재구매 차이</th>' +
    '<th style="text-align:right;width:70px">리뷰 수</th><th style="text-align:right;width:130px">몇 개 제품에서 같은 방향</th></tr>' +
    D.acquire.slice(0, 10).map(function (r) {
      return '<tr><td><b>' + esc(r.label) + '</b><span class="pill">' + r.name + '</span></td>' +
        '<td class="n neg">' + sg(r.lift) + '%p</td><td class="n">' + n(r.n) + '</td>' +
        '<td class="n">' + (r.nProd > 1 ? r.nProd + '종 중 ' + Math.round(r.nProd * r.agree / 100) + '종' : '1종') + '</td></tr>';
    }).join('') + '</table>' +
    '<p>둘로 나뉜다. 하나는 판단 유보(「아직 모르겠다」) — 후보 3이 겨냥하는 상태다. 다른 하나는 랭킹 1위와 임상 수치 — 브랜드가 상세페이지에서 가장 크게 쓰는 바로 그 말들이다. 사게는 해도 남게 하지 못한다.</p></div>');

  // ── 진단 9: 행동 동사 (패드판의 「기울기」 자리)
  E.push('<div class="panel"><div class="ph"><h3>진단 9 · 한국은 조작하고, 일본은 반복한다' +
    ib('패드 리포트에서는 이 자리에 컨셉의 시간 기울기를 실었다. 세럼 표본은 최근에 심하게 쏠려(한국 13,858건 중 2026년 10,621건) 「최근 12개월 대 그 이전」 비교가 성립하는 제품이 사실상 한 종뿐이라, 기울기 대신 행동 동사 비교를 넣었다. 코퍼스 전량 기준.') +
    '</h3><div class="hint">고객이 세럼을 가지고 실제로 하는 행동. 한국 = 올리브영 리뷰, 일본 = 큐텐 리뷰</div></div>' +
    '<table class="auto"><tr><th>행동</th><th style="text-align:right;width:80px">한국</th><th style="text-align:right;width:80px">일본</th>' +
    '<th style="text-align:right;width:60px">배수</th><th style="text-align:right;width:110px">한국 브랜드가 주장</th></tr>' +
    D.verbs.map(function (v) {
      var ratio = v.jp > 0 ? (v.kr / v.jp) : null;
      var side = ratio == null ? '' : (ratio >= 1.5 ? 'kr' : (ratio <= 0.67 ? 'jp' : ''));
      return '<tr><td><b>' + esc(v.lab) + '</b>' + (side ? '<span class="pill ' + side + '">' + (side === 'kr' ? '한국' : '일본') + '</span>' : '') + '</td>' +
        '<td class="n">' + p2(v.kr) + '</td><td class="n">' + p2(v.jp) + '</td>' +
        '<td class="n">' + (ratio == null ? '-' : (ratio >= 1 ? ratio.toFixed(1) + 'x' : '1/' + (1 / ratio).toFixed(1))) + '</td>' +
        '<td class="n" style="color:var(--subtle)">상세 ' + p2(v.det) + ' · 광고 ' + p2(v.ad) + '</td></tr>';
    }).join('') + '</table>' +
    '<p>한국 고객은 세럼을 <b>조작</b>한다 — 덧바르고, 섞고, 자기 루틴에 끼운다. 일본 고객은 세럼을 <b>반복</b>한다 — 같은 걸 다시 산다. 오른쪽 열이 한국 브랜드의 주장 비율인데, 조작 계열은 상세페이지에서 거의 0이고 정착 계열도 0이다. 브랜드가 파는 것과 고객이 하는 것이 겹치는 칸은 용량·가성비 하나뿐이다.</p></div>');

  // ── 발
  E.push('<div class="foot">' +
    '<b>대상</b> 한국 = 올리브영 에센스/세럼/앰플 판매랭킹 상위 ' + D.corpus.krProducts + '종, 브랜드 중복 제외 (' + D.corpus.krNames.join(' · ') + '). ' +
    '일본 = 큐텐 「美容液」 판매랭킹, 광고 슬롯 제외 후 브랜드 중복 제외 상위 ' + D.corpus.jpProducts + '종 (' + D.corpus.jpNames.join(' · ') + '). 브랜드 대표 리스팅은 그 브랜드 리스팅 중 후기 최다.<br>' +
    '<b>코퍼스</b> 리뷰 ' + n(D.corpus.krReviews) + ' + ' + n(D.corpus.jpReviews) + '건 · 일본 @cosme ' + n(D.corpus.jpCosme) + '건 · ' +
    '한국 상세페이지 이미지 ' + n(D.corpus.krDetail) + '장(OCR) · 한국 메타 광고 ' + n(D.corpus.krAds) + '건 · 한국 UGC ' + n(D.corpus.krUgc) + '건. 스냅샷 ' + D.collected + '. 인용문은 전부 원문 문자열 대조로 검증했다(생성 없음).<br>' +
    '<b>원자료</b> 카드의 수치, 격자의 칸, 불만 표의 비율은 눌러서 매치 리뷰 전문을 연다(처음 누를 때 그 묶음만 내려받는다). 일본어 리뷰는 <b>원문 그대로</b> 싣는다 — 무료 기계번역이 부정형을 뒤집는 오류(「べたつかず」를 「끈적끈적」으로)를 내서 붙이지 않았다. 카드의 인용문은 전부 사람이 옮겼다. 작성자 식별정보는 수집하지 않았다.<br>' +
    '<b>보정</b> 재구매 리프트는 제품 · 리뷰 길이 · 채널로 층화. TPO 격자는 제품 동일가중. 고민축은 오염 토큰을 양쪽에서 대칭으로 뺀 값.<br>' +
    '<b>단위</b> 시장 간 절대율은 비교하지 않는다. 한국 리뷰가 일본 큐텐 리뷰의 약 두 배 길이다(중앙 한국 ~50자 · 일본 32자). 비교는 같은 시장 안의 순위와 배수, 그리고 같은 제품의 통제쌍으로만 한다.<br>' +
    '<b>한계</b> 한국 리뷰는 전량이 아니라 <b>층화 표본</b>이다 (' + n(D.corpus.krReviews) + ' / ' + n(D.corpus.krSiteTotal) + '건 = ' + (D.corpus.krReviews / D.corpus.krSiteTotal * 100).toFixed(1) + '%). 올리브영이 로그인 세션당 조합별 500건에서 끊어서, 정렬 5축과 피부타입 6층으로 조합을 늘려 모았다. 비율 추정에는 충분하지만 표본이 최근으로 쏠려 있어 <b>시간 기울기는 산출하지 않았다</b>. 재구매 신호가 얕은 제품(메디힐 · 이니스프리 · 토리든)은 리프트 계산에서 사실상 빠진다.<br>' +
    '일본 공급 표본이 ' + D.corpus.jpProducts + '종이다. 「공급 없음」은 「일본에 없다」가 아니라 <b>「큐텐 판매랭킹 상위 ' + D.corpus.jpProducts + '종의 타이틀에 없다」</b>로만 쓸 수 있다. 일본 상세페이지와 일본 광고는 이번에 수집하지 않았다(한국은 둘 다 수집). 가격 · 원가 · 실제 전환은 이 데이터에 없다. 후보 5의 재구매 차이는 관찰 상관이지 실험이 아니다.<br>' +
    '<b>수집</b> 전부 공개 페이지에서 속도 제한을 지켜 수집.' +
    '</div>');

  document.getElementById('app').innerHTML = E.join('');
})();
