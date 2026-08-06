(function () {
  var D = window.D, E = [];
  var CN = ['각질·모공', '붉은기·진정', '수분·건조', '톤·결'];
  var MO = ['아침 세안 후', '밤 세안 후', '화장 전', '급할 때·밖에서', '계절·컨디션'];
  var n = function (v) { return (v == null ? '-' : v.toLocaleString()); };
  var pc = function (v) { return (v == null ? '&mdash;' : v.toFixed(1) + '%'); };
  var sg = function (v) { return (v >= 0 ? '+' : '') + v.toFixed(1); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var ib = function (t) { return '<i class="ib" title="' + esc(t) + '">i</i>'; };
  var MK = { both: '양국', kr: '한국', jp: '일본' };
  var sat = D.jpSatTot;
  var g = D.grid;
  var KN = { abib: '아비브', mediheal: '메디힐', numbuzin: '넘버즈인', cellfusion: '셀퓨전씨', torriden: '토리든',
    bringgreen: '브링그린', medicube: '메디큐브', dewytree: '듀이트리', biodance: '바이오던스', dermatory: '더마토리',
    skin1004: 'SKIN1004', skinfood: 'SKINFOOD', aprilskin: 'APRILSKIN', cellfusionc: 'CellFusionC' };

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
    if (r[3] && badge === 're') b = '<span class="bpill">재구매</span>';
    if (r[3] && badge === 'neg') b = '<span class="bpill npill">부정</span>';
    return '<div class="evr"><span class="pill">' + (KN[r[0]] || r[0]) + '</span><span class="evd mono">' + esc(r[1] || '') + '</span>' +
      b + '<span class="evt">' + esc(r[2]) + '</span></div>';
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
        if (t.dataset.sup) {  // 후보 1 공급 원자료: 상세 이미지 + 광고 전문
          var S = window.EV1S;
          pane.style.display = '';
          pane.innerHTML = '<div class="evhd"><b>공급 원자료 · 샤워/드라이 순간을 말하는 브랜드 자료 전부</b><a class="evclose">닫기</a></div>' +
            '<div class="evr"><span class="pill">아비브</span><span class="evt">상세페이지 472장 중 유일한 매치 (06.jpg, 「뜨거웠던 하루의 끝」 구획)</span></div>' +
            '<img class="evimg" src="' + S.img + '" loading="lazy">' +
            '<div class="evr" style="border-top:1px solid var(--line);margin-top:8px"><span class="evt"><b>메타 광고 매치 ' + S.adTotal + '건</b> (같은 문안 접어서 ' + S.ads.length + '종)</span></div>' +
            S.ads.map(function (a) { return '<div class="evr"><span class="pill">' + esc(a.pg || a.s) + '</span>' + (a.n > 1 ? '<span class="bpill">같은 문안 ' + a.n + '건</span>' : '') + '<span class="evt">' + esc(a.b) + '</span></div>'; }).join('');
          pane.scrollIntoView({ block: 'nearest' });
          return;
        }
        var arr = window[gn][k];
        var head = '';
        if (t.dataset.sum) {  // 후보 2: 제품별 원시 재구매율 머리표
          head = '<table class="auto sub"><tr><th>제품</th><th style="text-align:right">매치</th><th style="text-align:right">매치 중 재구매</th><th style="text-align:right">그 제품 전체 재구매</th></tr>' +
            window.EV2.krSum.map(function (r) { return '<tr><td>' + KN[r[0]] + '</td><td class="n">' + r[1].toLocaleString() + '</td><td class="n"><b>' + r[2].toFixed(1) + '%</b></td><td class="n">' + r[3].toFixed(1) + '%</td></tr>'; }).join('') +
            '</table><p style="margin:4px 0 10px">원시 비율이라 층화 보정값(+23.7pp)과는 다르다. 방향 확인용.</p>';
        }
        var note = /^(EV[1-5])$/.test(gn) && (k === 'jp' || k === 'co' || k.indexOf('co') === 0 || k.indexOf('jp') === 0) ? '일본어 원문 그대로' : '';
        var badge = (k === 'kr' || k === 'krThin' || k === 'krThick') ? 're' : '';
        paneOpen(pane, label + ' · 매치 리뷰 전문', arr, head, note, badge);
      });
      return;
    }
    var cell = t.closest && t.closest('.evcell');
    if (cell) {
      var key = cell.dataset.gc;
      var pane = document.getElementById('evp-grid');
      lazy('evgrid.js', function () {
        var kr = window.EVG.kr[key] || [], jp = window.EVG.jp[key] || [];
        paneOpen(pane, '칸 「' + key.replace('|', ' × ') + '」 · 한국 문장 ' + kr.length.toLocaleString() + ' + 일본 문장 ' + jp.length.toLocaleString(),
          kr.concat(jp), '', '일본 문장은 원문 그대로 · 부정 문장은 지우지 않고 실었다', 'neg');
      });
      return;
    }
    if (t.classList.contains('evfl')) {
      var m = t.dataset.m, lab = t.dataset.lab;
      var pane = document.getElementById('evp-faults');
      lazy('evfaults.js', function () {
        paneOpen(pane, lab + ' · ' + (m === 'kr' ? '한국 1~3점' : '일본 イマイチ') + ' 매치 전문', window.EVF[m][lab] || [], '', m === 'jp' ? '일본어 원문 그대로' : '');
      });
      return;
    }
  });

  // ── 머리
  E.push('<div class="top"><div>' +
    '<div class="kick">Concept &amp; TPO &middot; KR 10 + JP 5</div>' +
    '<h1>토너패드 제품 컨셉 후보 5</h1>' +
    '<div class="sub">한국 올리브영 상위 ' + D.corpus.krProducts + '종 · 일본 큐텐 판매랭킹 상위 ' + D.corpus.jpProducts + '종 (광고 제외) · 수요와 공급을 같은 자로 잰 결과 · 모든 수치는 눌러서 원자료를 연다</div>' +
    '</div><div class="topmeta">' +
    '<span>리뷰 <b class="mono">' + n(D.corpus.krReviews) + '</b> + <b class="mono">' + n(D.corpus.jpReviews) + '</b></span>' +
    '<span>@cosme <b class="mono">' + n(D.corpus.jpCosme) + '</b></span>' +
    '<span>상세 <b class="mono">' + n(D.corpus.krDetail) + '</b></span>' +
    '<span>광고 <b class="mono">' + n(D.corpus.krAds) + '</b></span>' +
    '<span>UGC <b class="mono">' + n(D.corpus.krUgc) + '</b></span>' +
    '<span>수집 <b class="mono">' + D.collected + '</b></span>' +
    '</div></div>');

  // ── 후보 색인 (다크)
  var oneNum = [
    '수요 8,581건 · 공급 상세 1/472장',
    '재구매 +23.7pp · 유일한 정착 언어',
    '큐텐 3,260건 · 주장 브랜드 0',
    'イマイチ 5,081건 · 타이틀 0/5',
    '한국 상세 주장 2/472장 · 일본 2위가 검증'
  ];
  E.push('<div class="panel dark"><div class="ph"><h3 style="color:#fff">후보 컨셉 5 · 순위</h3>' +
    '<div class="hint" style="color:#8f8f8f">기준: 고객 언어에 이미 있고(수요) 브랜드 주장에 없다(공급). 카드마다 근거 전체를 붙였다</div></div>' +
    '<ul class="cidx">' + D.cand.map(function (c) {
      return '<li><span class="ci-r mono">' + c.rank + '</span><span class="ci-m ' + c.market + '">' + MK[c.market] + '</span>' +
        '<span class="ci-n">' + esc(c.name) + '</span><span class="ci-k mono">' + esc(oneNum[c.rank - 1]) + '</span></li>';
    }).join('') + '</ul></div>');

  // ── 카드별 원자료 버튼 배선 (rank -> demand/supply 행 번호 -> 버튼들)
  var EVMAP = {
    1: { demand: { 0: [evBtn('6,319건 전부 보기', 'ev1.js', 'EV1', 'kr')], 1: [evBtn('382건 전부 보기', 'ev1.js', 'EV1', 'co')], 2: [evBtn('1,880건 전부 보기', 'ev1.js', 'EV1', 'jp')] },
         supply: { 0: [evBtn('그 1장 + 광고 11건 보기', 'ev1sup.js', 'EV1S', 'ads', ' data-sup="1"')], 1: [evBtn('그 1장 + 광고 11건 보기', 'ev1sup.js', 'EV1S', 'ads', ' data-sup="1"')] } },
    2: { demand: { 0: [evBtn('매치 379건 전부 보기', 'ev2.js', 'EV2', 'kr', ' data-sum="1"')], 1: [evBtn('매치 379건 전부 보기', 'ev2.js', 'EV2', 'kr', ' data-sum="1"')], 2: [evBtn('큐텐 701건', 'ev2.js', 'EV2', 'jp'), evBtn('@cosme 46건', 'ev2.js', 'EV2', 'co')] } },
    3: { demand: { 0: [evBtn('3,260건 전부 보기', 'ev3.js', 'EV3', 'jp')], 1: [evBtn('207건 전부 보기', 'ev3.js', 'EV3', 'co')], 2: [evBtn('14건 전부 보기', 'ev3.js', 'EV3', 'kr')] } },
    4: { demand: { 0: [evBtn('5,081건 전부 보기', 'ev4.js', 'EV4', 'jp')], 2: [evBtn('@cosme 각질 언급 164건', 'ev4.js', 'EV4', 'co')] } },
    5: { demand: { 0: [evBtn('@cosme 두께 380건', 'ev5.js', 'EV5', 'coThick'), evBtn('에센스 1,816건', 'ev5.js', 'EV5', 'coEss'), evBtn('한국 두께 3,775건', 'ev5.js', 'EV5', 'krThick')],
                   1: [evBtn('한국 얇음 9,373건 전부', 'ev5.js', 'EV5', 'krThin')], 2: [evBtn('일본 얇음 イマイチ 173건', 'ev5.js', 'EV5', 'jpThin')] } },
  };

  // ── 후보 카드 5장
  var evTable = function (title, rows, btnMap) {
    return '<div class="evb"><div class="evh">' + title + '</div><table class="ev">' + rows.map(function (r, i) {
      var btns = btnMap && btnMap[i] ? '<span class="evbtns">' + btnMap[i].join('') + '</span>' : '';
      return '<tr><td class="ek">' + esc(r[0]) + '</td><td class="evv mono">' + r[1] + '</td><td class="es">' + esc(r[2] || '') + btns + '</td></tr>';
    }).join('') + '</table></div>';
  };
  D.cand.forEach(function (c) {
    var m = EVMAP[c.rank] || {};
    var body = '';
    body += '<div class="evrow">' + evTable('수요 · 고객이 말한다', c.demand, m.demand) + evTable('공급 · 브랜드가 판다', c.supply, m.supply) + '</div>';
    body += '<div class="evpane" style="display:none"></div>';
    body += '<ul class="why">' + c.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>';

    if (c.rank === 2) {
      body += '<table class="auto sub"><tr><th>재구매자 쪽으로 기운 말 상위 5 (전체 149개 중 유의 양수는 10개)</th><th style="text-align:right;width:76px">리프트</th><th style="text-align:right;width:64px">n</th></tr>' +
        D.settle.slice(0, 5).map(function (r) {
          return '<tr><td>' + esc(r.label) + '<span class="pill">' + r.name + '</span></td><td class="n pos">' + sg(r.lift) + 'pp</td><td class="n">' + n(r.n) + '</td></tr>';
        }).join('') + '</table>';
    }
    if (c.rank === 4) {
      body += '<table class="auto sub"><tr><th>제품</th><th style="text-align:right">化粧ノリ 화장먹힘</th><th style="text-align:right">トラブルケア 트러블</th><th style="text-align:right">角質ケア 각질</th></tr>' +
        D.jpSat.map(function (r) {
          return '<tr><td><b>' + r.name + '</b></td><td class="n">' + pc(r['化粧ノリ']) + '</td><td class="n">' + pc(r['トラブルケア']) + '</td><td class="n"><b>' + pc(r['角質ケア']) + '</b></td></tr>';
        }).join('') +
        '<tr><td style="color:var(--subtle)">イマイチ(아쉬움) 건수</td><td class="n">' + n(sat['化粧ノリ'].bad) + '</td><td class="n">' + n(sat['トラブルケア'].bad) + '</td><td class="n"><b>' + n(sat['角質ケア'].bad) + '</b></td></tr></table>';
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

  // ── 진단: TPO 격자
  var mx = 0; CN.forEach(function (c) { MO.forEach(function (o) { mx = Math.max(mx, g.kr[c + '|' + o], g.jp[c + '|' + o]); }); });
  var rows = '<tr><th style="width:96px"></th>' + MO.map(function (o) { return '<th style="text-align:center">' + o + '</th>'; }).join('') + '</tr>';
  CN.forEach(function (c) {
    rows += '<tr><td class="lab">' + c + '</td>' + MO.map(function (o) {
      var a = g.kr[c + '|' + o], b = g.jp[c + '|' + o], hi = Math.max(a, b) >= mx * 0.45;
      return '<td><div class="cell evcell' + (hi ? ' hi' : '') + '" data-gc="' + c + '|' + o + '" title="누르면 이 칸의 문장 전체"><div class="duo"><span class="a">' + a.toFixed(1) + '</span><span class="b">' + b.toFixed(1) + '</span></div>' +
        '<div class="bars"><i class="a" style="width:' + Math.max(2, a / mx * 34) + 'px"></i><i class="b" style="width:' + Math.max(2, b / mx * 34) + 'px"></i></div></div></td>';
    }).join('') + '</tr>';
  });
  E.push('<div class="panel"><div class="ph"><h3>진단 1 · TPO 격자, 칸별 문장 점유' +
    ib('한국 리뷰 ' + n(D.corpus.krReviews) + '건에서 뽑은 문장 ' + n(g.krSent) + '개, 일본 ' + n(g.jpSent) + '개. 고민어와 순간어를 함께 담은 문장만 센다. 제품마다 리뷰 수가 달라 큰 제품이 시장을 대표하지 않도록 제품별 분포를 낸 뒤 동일가중 평균했다.') +
    '</h3><div class="lg"><span><i class="a"></i>한국 ' + D.corpus.krProducts + '종</span><span><i class="b"></i>일본 ' + D.corpus.jpProducts + '종</span></div></div>' +
    '<table class="cellgrid">' + rows + '</table>' +
    '<div class="evpane" id="evp-grid" style="display:none"></div>' +
    '<p>칸을 누르면 그 칸에 실린 문장 전체(한국 ' + n(g.krSent) + ' + 일본 ' + n(g.jpSent) + ')가 열린다. 후보 1은 밤(목욕 직후) 칸, 후보 3은 일본 최대 칸인 수분 × 아침(12.7%), 후보 4는 일본 각질·모공 축(28.1%)에 선다.</p></div>');

  // ── 진단: 축 요약
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
    ib('오염 토큰을 대칭으로 뺀 값이다. 한국 진정축의 35%가 열감 계열(쿨링 제품이 많아서), 일본 수분축의 13%가 에센스 양 어휘(ヒタヒタ 등)였다. 빼기 전 값은 한국 ' + g.krConcern.join('/') + ', 일본 ' + g.jpConcern.join('/') + ' 이고 격차 방향은 같다.') +
    '</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(CN, g.krConcernStrict, g.jpConcernStrict) +
    '<p>진정과 수분이 거의 뒤집혀 있다. 한국 진정 <b>' + g.krConcernStrict[1].toFixed(1) + '%</b> 대 일본 <b>' + g.jpConcernStrict[1].toFixed(1) + '%</b>, ' +
    '일본 수분 <b>' + g.jpConcernStrict[2].toFixed(1) + '%</b> 대 한국 <b>' + g.krConcernStrict[2].toFixed(1) + '%</b>. 후보 1·2가 한국에서 진정으로, 후보 3이 일본에서 수분으로 말해야 하는 이유. 문장 단위 원자료는 위 격자의 칸에서 연다.</p></div>' +
    '<div class="panel"><div class="ph"><h3>진단 3 · 순간축</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(MO, g.krMoment, g.jpMoment) +
    '<p>화장 전이 양국 유일한 공통 순간이다 (한국 ' + g.krMoment[2].toFixed(1) + '% · 일본 ' + g.jpMoment[2].toFixed(1) + '%). 하지만 일본 화장먹힘 만족도가 ' + sat['化粧ノリ'].pct.toFixed(1) + '%로 포화라 정면 공략은 기각했다(아래 기각 목록). 일본은 아침(후보 3), 한국은 계절로 갈린다.</p></div></div>');

  // ── 진단: 제품 성질
  E.push('<div class="panel"><div class="ph"><h3>진단 4 · 형태 공통 스펙 (어느 후보든 이 위에서 실행된다)</h3>' +
    '<div class="hint">각 항목의 수치는 그 어휘를 담은 리뷰 비율. 길이대를 시장별로 고정했다 (한국 35~75자 · 일본 21~45자)</div></div><ul class="rule">' +
    D.props.map(function (p, i) {
      var f = p.full, d2 = function (v) { return v.toFixed(2) + '%'; };
      return '<li><div class="rh"><span class="rt">' + (i + 1) + '. ' + p.label + '</span>' +
        '<span class="pill kr">한국 ' + (f ? d2(f.kr) : pc(p.kr)) + '</span><span class="pill jp">일본 ' + (f ? d2(f.jp) : pc(p.jp)) + '</span>' +
        '<span class="pill">@cosme ' + (f ? d2(f.co) : pc(p.co)) + '</span>' + (f ? '<span class="pill">코퍼스 전량</span>' : '') + '</div>' +
        '<div class="rb">' + esc(p.note) + '</div></li>';
    }).join('') + '</ul>' +
    (function () { var f = D.props[3].full; return '<div class="quote">양면 · 앞뒤 언급, 코퍼스 전량 기준 &nbsp; 한국 <b>' + f.kr.toFixed(2) + '%</b> (' + n(f.krN) + '/' + n(f.krT) + ') &nbsp; 일본 큐텐 <b>' + f.jp.toFixed(2) + '%</b> (' + n(f.jpN) + '/' + n(f.jpT) + ') &nbsp; @cosme <b>' + f.co.toFixed(2) + '%</b> (' + n(f.coN) + '/' + n(f.coT) + ')</div>'; })() + '</div>');

  // ── 진단: 통제쌍
  E.push('<div class="panel"><div class="ph"><h3>진단 5 · 같은 SKU 통제쌍, 셀퓨전씨 포스트알파 쿨링패드 70매' +
    ib('한국 13,291건(2022.06~2026.08) 대 일본 12,499건(2022.07~2026.08). 같은 물건이므로 차이는 제품 차이일 수 없다. 월 구성도 거의 같다(여름 54.2% 대 50.8%).') +
    '</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    '<table class="auto"><tr><th>컨셉</th><th style="text-align:right;width:66px">한국</th><th style="text-align:right;width:66px">일본 큐텐</th><th style="text-align:right;width:74px">일본 @cosme</th></tr>' +
    D.pair.map(function (r) {
      var big = r.kr > r.jp * 1.4 ? 'kr' : (r.jp > r.kr * 1.4 ? 'jp' : '');
      return '<tr><td><b>' + esc(r.lab) + '</b>' + (big ? '<span class="pill ' + big + '">' + (big === 'kr' ? '한국' : '일본') + '</span>' : '') + '</td>' +
        '<td class="n">' + pc(r.kr) + '</td><td class="n">' + pc(r.jp) + '</td><td class="n" style="color:var(--subtle)">' + pc(r.co) + '</td></tr>';
    }).join('') + '</table>' +
    '<p>같은 물건인데 한국은 차가운 패드로, 일본은 화장 잘 먹는 패드로 쓴다. 쿨링을 일본에 그대로 가져가면 1/2~1/3로 준다. 후보를 시장별로 가른 근거다. ' +
    '한국 상품명 <b>[진로 콜라보/아이스 쿨러 증정] 셀퓨전씨 포스트 알파 쿨링 패드 70매</b> · 일본 상품명 <b>毛穴ケア!ポストアルファクーリングパッド70枚 肌温度DOWN&amp;化粧ノリUP</b> (모공케어! 포스트알파 쿨링패드 70매 피부온도DOWN&amp;화장먹힘UP).</p></div>');

  // ── 진단: 불만
  E.push('<div class="panel"><div class="ph"><h3>진단 6 · 불만이 무엇에 대한 불만인가' +
    ib('한국은 1~3점 리뷰 8,486건, 일본은 큐텐 구조 필드에 イマイチ가 붙은 리뷰 7,011건. 일본 평점은 리뷰 포인트 보상 때문에 5점이 88%라 쓸 수 없다. 배수는 각 시장 전체 대비. 일본 리뷰가 절반 길이라 시장 간 절대율은 비교하지 않는다.') +
    '</h3><div class="hint">불만 비율을 누르면 매치 리뷰 전문이 열린다</div></div>' +
    '<table class="auto"><tr><th>속성</th><th style="text-align:right;width:86px">한국 불만</th><th style="text-align:right;width:56px">배수</th>' +
    '<th style="text-align:right;width:86px">일본 불만</th><th style="text-align:right;width:56px">배수</th></tr>' +
    D.faults.map(function (f, i) { return { f: f, i: i }; }).sort(function (a, b) { return b.f.kl + b.f.jl - a.f.kl - a.f.jl; }).slice(0, 9).map(function (x) {
      var f = x.f;
      return '<tr><td><b>' + esc(f.lab) + '</b></td>' +
        '<td class="n"><a class="evfl" data-m="kr" data-lab="' + esc(f.lab) + '">' + pc(f.kb) + '</a></td><td class="n">' + f.kl.toFixed(1) + 'x</td>' +
        '<td class="n"><a class="evfl" data-m="jp" data-lab="' + esc(f.lab) + '">' + pc(f.jb) + '</a></td><td class="n"><b>' + f.jl.toFixed(1) + 'x</b></td></tr>';
    }).join('') + '</table>' +
    '<div class="evpane" id="evp-faults" style="display:none"></div>' +
    '<p>한국 1위 「효과를 모르겠다」가 후보 2의 출발점이고, 일본에서 배수가 가장 높은 「각질이 안 없어진다」(8.6x)가 후보 4의 출발점이다.</p></div>');

  // ── 진단: 컨셉 이전
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
      '거의 전부 쿨링 · 열감 계열이다. 큐텐과 @cosme 둘 다 낮은 것만 진짜 부재로 읽는다. 붉은기 진정은 큐텐 1.4%지만 @cosme 35.6%라 매체 차이지 부재가 아니다.') +
    tl('일본이 더 크게 말한다', D.transfer.jpMore.slice(0, 8),
      '@cosme는 장문이라 모든 항목이 높게 나온다. 컨셉끼리의 비교로만 읽는다.') + '</div>');

  // ── 진단: 획득 언어
  E.push('<div class="panel"><div class="ph"><h3>진단 8 · 첫 구매를 만들고 재구매는 안 만드는 말' +
    ib('제품 · 리뷰 길이 · 채널로 층화한 뒤 언급/미언급 재구매율 차이를 층 가중평균했다(Mantel-Haenszel 위험차). 재구매 어휘가 본문에 있는 리뷰는 통째로 제외해 플래그가 자기 자신을 읽는 누수를 막았다.') +
    '</h3><div class="hint">제품 일치 = 그 정규식이 잡히는 제품들에서 부호가 같은 비율. 컨셉별 대표 인용은 <a href="../kr/" style="text-decoration:underline">한국 10종 컨셉 리포트</a>에 전부 있다</div></div>' +
    '<table class="auto"><tr><th>컨셉</th><th style="text-align:right;width:70px">리프트</th><th style="text-align:right;width:56px">z</th>' +
    '<th style="text-align:right;width:60px">n</th><th style="text-align:right;width:90px">제품 일치</th></tr>' +
    D.acquire.slice(0, 10).map(function (r) {
      return '<tr><td><b>' + esc(r.label) + '</b><span class="pill">' + r.name + '</span></td>' +
        '<td class="n neg">' + sg(r.lift) + 'pp</td><td class="n">' + r.z.toFixed(1) + '</td><td class="n">' + n(r.n) + '</td>' +
        '<td class="n">' + (r.nProd > 1 ? r.nProd + '종 ' + r.agree + '%' : '단일제품') + '</td></tr>';
    }).join('') + '</table></div>');

  // ── 진단: 기울기
  var sl = function (title, list) {
    return '<div class="panel"><div class="ph"><h3>' + title + '</h3></div>' +
      '<table class="auto"><tr><th>컨셉</th><th style="text-align:right;width:110px">언급 점유</th><th style="text-align:right;width:56px">배수</th></tr>' +
      list.map(function (r) {
        return '<tr><td>' + esc(r.label) + '<span class="pill">' + r.name + '</span></td>' +
          '<td class="n" style="color:var(--subtle)">' + r.older.toFixed(1) + '% → <b style="color:var(--ink)">' + r.recent.toFixed(1) + '%</b></td>' +
          '<td class="n">' + r.slope.toFixed(2) + 'x</td></tr>';
      }).join('') + '</table></div>';
  };
  E.push('<div class="two">' + sl('진단 9 · 한국에서 뜨는 컨셉 (최근 12개월 대 그 이전, 길이 보정)', D.slope.up.slice(0, 7)) + sl('한국에서 지는 컨셉', D.slope.down.slice(0, 7)) + '</div>');

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
    '<li><div class="t"><s>화장 전을 정면으로 친다</s></div><div class="b">양국 유일한 공통 순간이지만 일본 화장먹힘 만족도가 ' + sat['化粧ノリ'].pct.toFixed(1) + '%로 포화다. 순간으로는 못 쓰고, 후보 1·3의 결과 화법(다음 날 화장이 잘 먹는다)으로만 쓴다.</div></li>' +
    '<li><div class="t"><s>쿨링을 일본에 가져간다</s></div><div class="b">같은 SKU 통제쌍에서 쿨링 언어가 한국 66.9% 대 일본 34.0%, 컨셉 전수에서도 일본이 1/3 수준이다 (진단 5 · 7). 쿨링은 한국 전용.</div></li>' +
    '</ul></div>');

  // ── 발
  E.push('<div class="foot">' +
    '<b>대상</b> 한국 = 올리브영 토너패드 상위 ' + D.corpus.krProducts + '종 (' + D.corpus.krNames.join(' · ') + '). ' +
    '일본 = 큐텐 「トナーパッド」 판매랭킹 상위 ' + D.corpus.jpProducts + '종, 광고 슬롯 제외 (' + D.corpus.jpNames.join(' · ') + ').<br>' +
    '<b>코퍼스</b> 리뷰 ' + n(D.corpus.krReviews) + ' + ' + n(D.corpus.jpReviews) + '건 · 일본 @cosme ' + n(D.corpus.jpCosme) + '건 · ' +
    '한국 상세페이지 이미지 ' + n(D.corpus.krDetail) + '장(OCR) · 한국 메타 광고 ' + n(D.corpus.krAds) + '건 · 한국 UGC ' + n(D.corpus.krUgc) + '건. 스냅샷 ' + D.collected + '. 인용문은 전부 원문 문자열 대조로 검증했다(생성 없음).<br>' +
    '<b>원자료</b> 카드의 수치, 격자의 칸, 불만 표의 비율은 눌러서 매치 리뷰 전문을 연다(처음 누를 때 그 묶음만 내려받는다). 일본어 리뷰는 번역 없이 원문 그대로다. 작성자 식별정보는 수집하지 않았다.<br>' +
    '<b>보정</b> 재구매 리프트는 제품 · 리뷰 길이 · 채널로 층화. 리뷰 길이가 짧을수록 재구매율이 높고(30~40자 18.1% 대 100~150자 13.6%), ' +
    '출시 직후 리뷰가 2~4배 길다(브링그린 192자 → 44자). 두 교란을 잡지 않으면 기울기와 리프트가 모두 뒤집힌다.<br>' +
    '<b>단위</b> 시장 간 절대율은 비교하지 않는다. 한국 리뷰 중앙 49자, 일본 큐텐 24자, @cosme는 장문이다. ' +
    '비교는 같은 시장 안의 순위와 배수로만 한다. TPO 격자는 제품 동일가중.<br>' +
    '<b>한계</b> 일본 공급 표본이 ' + D.corpus.jpProducts + '종이다. 「공급 없음」은 「일본에 없다」가 아니라 <b>「큐텐 판매랭킹 상위 ' + D.corpus.jpProducts + '종의 타이틀 · 광고에 없다」</b>로만 쓸 수 있다. 확정하려면 일본 리스팅 타이틀 센서스가 필요하다. ' +
    '일본 상세페이지는 OCR하지 않았다. 가격 · 원가 · 실제 전환은 이 데이터에 없다. 후보 2의 리프트는 관찰 상관이지 실험이 아니다.<br>' +
    '<b>수집</b> 전부 공개 페이지에서 속도 제한을 지켜 수집.' +
    '</div>');

  document.getElementById('app').innerHTML = E.join('');
})();
