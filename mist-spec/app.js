(function () {
  var D = window.D, E = [];
  var CN = ['각질·모공', '붉은기·진정', '수분·건조', '톤·결'];
  var MO = ['아침 세안 후', '밤 세안 후', '화장 전', '화장 위·수정화장', '수시로·틈틈이', '급할 때·밖에서', '계절·컨디션'];
  var n = function (v) { return (v == null ? '-' : v.toLocaleString()); };
  var pc = function (v) { return (v == null ? '&mdash;' : v.toFixed(1) + '%'); };
  var p2 = function (v) { return (v == null ? '&mdash;' : v.toFixed(2) + '%'); };
  var sg = function (v) { return (v >= 0 ? '+' : '') + v.toFixed(1); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var ib = function (t) { return '<i class="ib" title="' + esc(t) + '">i</i>'; };
  var MK = { both: '양국', kr: '한국', jp: '일본' };
  var sat = D.jpSatTot;
  var g = D.grid;
  var KN = { anua: '아누아', bioheal: '바이오힐보', dalba: '달바', klairs: '디어클레어스', medicube: '메디큐브',
    cnp: '차앤박', dahlia: '디어달리아', aestura: '에스트라', avene: '아벤느', hanyul: '한율', miguhara: 'MIGUHARA' };

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
    var ko = (typeof r[4] === 'string' && r[4]) ? r[4] : (badge !== 'eval' && typeof r[3] === 'string' && /[가-힣]/.test(r[3]) ? r[3] : '');
    if (badge === 'eval') {
      if (typeof r[3] === 'string') b = r[3].split('|').map(function (x) {
        return '<span class="bpill' + (/아쉬움/.test(x) ? ' npill' : '') + '">' + x + '</span>'; }).join('');
    } else if (typeof r[3] === 'number' && r[3]) {
      if (badge === 're') b = '<span class="bpill">재구매</span>';
      if (badge === 'neg') b = '<span class="bpill npill">부정</span>';
    }
    return '<div class="evr"><span class="pill">' + (KN[r[0]] || r[0]) + '</span><span class="evd mono">' + esc(r[1] || '') + '</span>' +
      b + '<div class="evtw"><div class="evt">' + esc(r[2]) + '</div>' + (ko && ko !== r[2] ? '<div class="evt" style="color:var(--subtle);margin-top:2px">' + esc(ko) + '</div>' : '') + '</div></div>';
  }
  function paneRender(pane) {
    var st = pane._st, q = st.q.trim();
    var arr = q ? st.arr.filter(function (r) { return r[2].indexOf(q) >= 0 || (typeof r[3] === 'string' && r[3].indexOf(q) >= 0); }) : st.arr;
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
  var KO_NOTE = '각 패널의 일본어 행 앞 350건에 한국어 번역을 붙였다(기계번역 없음). 그 뒤는 원문 그대로';
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.classList.contains('evclose')) { t.closest('.evpane').style.display = 'none'; return; }
    if (t.classList.contains('evmore')) { var p = t.closest('.evpane'); p._st.shown += CHUNK; paneRender(p); return; }
    if (t.classList.contains('evlink')) {
      var f = t.dataset.f, gn = t.dataset.g, k = t.dataset.k, label = t.textContent;
      var pane = t.closest('.panel').querySelector('.evpane');
      lazy(f, function () {
        if (t.dataset.sup) {
          var S = window.EV3S;
          pane.style.display = '';
          pane.innerHTML = '<div class="evhd"><b>공급 원자료 · 수정화장·퍼프를 말하는 브랜드 광고 전부</b><a class="evclose">닫기</a></div>' +
            '<div class="evr"><span class="evt"><b>메타 광고 매치 ' + S.adTotal + '건</b> (같은 문안 접어서 ' + S.ads.length + '종)</span></div>' +
            S.ads.map(function (a) { return '<div class="evr"><span class="pill">' + esc(KN[a.s] || a.s) + '</span>' + (a.n > 1 ? '<span class="bpill">같은 문안 ' + a.n + '건</span>' : '') + '<span class="evt">' + esc(a.b) + '</span></div>'; }).join('');
          pane.scrollIntoView({ block: 'nearest' });
          return;
        }
        var arr = window[gn][k];
        var head = '';
        var note = (k === 'jp' || k === 'co' || k === 'jpBad') ? KO_NOTE : '';
        var badge = (k === 'kr') ? 're' : '';
        var title = label + ' · 매치 리뷰 전문';
        if (gn === 'EV4' && k === 'jpBad') {
          badge = 'eval';
          title = '噴射力(분사력) イマイチ(아쉬움) 체크 리뷰 전문';
          note = '본문 매치가 아니라 구조 필드 매치다. 이 목록 전원이 분사력 항목에 아쉬움을 체크했다. 행마다 그 고객의 3축 체크 결과를 붙였고, 분사를 글로도 쓴 리뷰를 앞에 정렬했다';
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
          kr.concat(jp), '', '격자 딥패널의 일본 문장은 원문 그대로 실었다 · 부정 문장은 지우지 않았다', 'neg');
      });
      return;
    }
    if (t.classList.contains('evfl')) {
      var m = t.dataset.m, lab = t.dataset.lab;
      var pane3 = document.getElementById('evp-faults');
      lazy('evfaults.js', function () {
        paneOpen(pane3, lab + ' · ' + (m === 'kr' ? '한국 1~3점' : '일본 イマイチ') + ' 매치 전문', window.EVF[m][lab] || [], '', m === 'jp' ? '일본어 원문 그대로 (불만 딥패널)' : '');
      });
      return;
    }
  });

  // ── 머리
  E.push('<div class="top"><div>' +
    '<div class="kick">Concept &amp; TPO &middot; MIST &middot; KR 10 + JP 5</div>' +
    '<h1>미스트 제품 컨셉 후보 5</h1>' +
    '<div class="sub">한국 올리브영 미스트 판매랭킹 상위 ' + D.corpus.krProducts + '종 · 일본 큐텐 「ミスト」 판매랭킹 상위 ' + D.corpus.jpProducts + '종 · 수요와 공급을 같은 자로 잰 결과 · 모든 수치는 눌러서 원자료를 연다</div>' +
    '</div><div class="topmeta">' +
    '<span>리뷰 <b class="mono">' + n(D.corpus.krReviews) + '</b>' + ib('한국은 층화 표본이다. 올리브영 전체 ' + n(D.corpus.krSiteTotal) + '건 중 ' + (D.corpus.krReviews / D.corpus.krSiteTotal * 100).toFixed(1) + '%. 일본 큐텐은 전량.') + ' + <b class="mono">' + n(D.corpus.jpReviews) + '</b></span>' +
    '<span>@cosme <b class="mono">' + n(D.corpus.jpCosme) + '</b></span>' +
    '<span>상세 <b class="mono">' + n(D.corpus.krDetail) + '</b></span>' +
    '<span>광고 <b class="mono">' + n(D.corpus.krAds) + '</b></span>' +
    '<span>UGC <b class="mono">' + n(D.corpus.krUgc) + '</b></span>' +
    '<span>수집 <b class="mono">' + D.collected + '</b></span>' +
    '</div></div>');

  // ── 후보 색인
  var oneNum = {
    replace: '리프트 상위 전부 이 계열 · 공급은 달바 1곳',
    habit: '한국 순간축 ' + g.krMoment[4].toFixed(1) + '% 대 일본 ' + g.jpMoment[4].toFixed(1) + '%',
    retouch: '일본 순간축 ' + g.jpMoment[3].toFixed(1) + '% · 타이틀에 건 곳 1/5',
    spray: '한국 고객 컨셉 1~3위 · 수치를 적은 상세 0장',
    scent: '일본 불만 1위 ' + D.faults.filter(function (f) { return /향이 싫다/.test(f.lab); })[0].jb.toFixed(1) + '% · 그중 달바 18.2%'
  };
  E.push('<div class="panel dark"><div class="ph"><h3 style="color:#fff">후보 컨셉 5 · 순위</h3>' +
    '<div class="hint" style="color:#8f8f8f">기준: 고객 언어에 이미 있고(수요) 브랜드 주장에 없다(공급). 카드마다 근거 전체를 붙였다</div></div>' +
    '<ul class="cidx">' + D.cand.map(function (c) {
      return '<li><span class="ci-r mono">' + c.rank + '</span><span class="ci-m ' + c.market + '">' + MK[c.market] + '</span>' +
        '<span class="ci-n">' + esc(c.name) + '</span><span class="ci-k mono">' + esc(oneNum[c.id]) + '</span></li>';
    }).join('') + '</ul></div>');

  // ── 카드별 원자료 버튼 배선
  var EVMAP = {
    replace: { demand: { 0: [evBtn('한국 매치 전부 보기', 'ev1.js', 'EV1', 'kr')],
                         2: [evBtn('일본 매치 전부 보기', 'ev1.js', 'EV1', 'jp'), evBtn('@cosme', 'ev1.js', 'EV1', 'co')] } },
    habit: { demand: { 1: [evBtn('한국 매치 전부 보기', 'ev2.js', 'EV2', 'kr')],
                       2: [evBtn('일본 매치 전부 보기', 'ev2.js', 'EV2', 'jp'), evBtn('@cosme', 'ev2.js', 'EV2', 'co')] } },
    retouch: { demand: { 1: [evBtn('일본 매치 전부 보기', 'ev3.js', 'EV3', 'jp'), evBtn('@cosme', 'ev3.js', 'EV3', 'co')] },
               supply: { 1: [evBtn('한국 매치 전부 보기', 'ev3.js', 'EV3', 'kr'), evBtn('브랜드 광고 원자료', 'ev3sup.js', 'EV3S', 'ads', ' data-sup="1"')] } },
    spray: { demand: { 0: [evBtn('한국 매치 전부 보기', 'ev4.js', 'EV4', 'kr')],
                       1: [evBtn('체크 리뷰 ' + n(sat['噴射力'].bad) + '건 전부 보기', 'ev4.js', 'EV4', 'jpBad')],
                       2: [evBtn('@cosme 매치', 'ev4.js', 'EV4', 'co'), evBtn('일본 큐텐 매치', 'ev4.js', 'EV4', 'jp')] } },
    scent: { demand: { 0: [evBtn('일본 매치 전부 보기', 'ev5.js', 'EV5', 'jp'), evBtn('@cosme', 'ev5.js', 'EV5', 'co')],
                       2: [evBtn('한국 매치 전부 보기', 'ev5.js', 'EV5', 'kr')] } },
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

    if (c.id === 'replace') {
      body += '<table class="auto sub"><tr><th>재구매를 확실히 올린 말 상위 (컨셉 ' + D.dist.n + '개 중 |z|≥3 양수 ' + D.dist.sigPos + '개)</th><th style="text-align:right;width:86px">재구매 차이</th><th style="text-align:right;width:64px">n</th></tr>' +
        D.settle.map(function (r) {
          return '<tr><td>' + esc(r.label) + '<span class="pill">' + r.name + '</span></td><td class="n pos">' + sg(r.lift) + 'pp</td><td class="n">' + n(r.n) + '</td></tr>';
        }).join('') + '</table>';
    }
    if (c.id === 'spray') {
      body += '<table class="auto sub"><tr><th>제품 (일본 큐텐 강제 3축 만족도)</th><th style="text-align:right">保湿力 보습력</th><th style="text-align:right">密着感 밀착감</th><th style="text-align:right">噴射力 분사력</th></tr>' +
        D.jpSat.map(function (r) {
          return '<tr><td><b>' + r.name + '</b> <span class="pill">' + n(r.n) + '건</span></td><td class="n">' + pc(r['保湿力']) + '</td><td class="n">' + pc(r['密着感']) + '</td><td class="n"><b>' + pc(r['噴射力']) + '</b></td></tr>';
        }).join('') +
        '<tr><td style="color:var(--subtle)">イマイチ(아쉬움) 건수</td><td class="n">' + n(sat['保湿力'].bad) + '</td><td class="n">' + n(sat['密着感'].bad) + '</td><td class="n"><b>' + n(sat['噴射力'].bad) + '</b></td></tr></table>';
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
    ib('한국 리뷰 ' + n(D.corpus.krReviews) + '건에서 뽑은 문장 ' + n(g.krSent) + '개, 일본 ' + n(D.corpus.jpReviews) + '건에서 ' + n(g.jpSent) + '개. 고민어와 순간어를 함께 담은 문장만 센다. 제품마다 리뷰 수가 달라 큰 제품이 시장을 대표하지 않도록 제품별 분포를 낸 뒤 동일가중 평균했다. 순간축의 「화장 위·수정화장」 「수시로·틈틈이」는 패드·세럼에는 없던 미스트 전용 축이다.') +
    '</h3><div class="lg"><span><i class="a"></i>한국 ' + D.corpus.krProducts + '종</span><span><i class="b"></i>일본 ' + D.corpus.jpProducts + '종</span></div></div>' +
    '<table class="cellgrid">' + rows + '</table>' +
    '<div class="evpane" id="evp-grid" style="display:none"></div>' +
    '<p>칸을 누르면 그 칸에 실린 문장 전체(한국 ' + n(g.krSent) + ' + 일본 ' + n(g.jpSent) + ')가 열린다. 후보 2는 수분 × 수시로 칸(한국 ' + g.kr['수분·건조|수시로·틈틈이'].toFixed(1) + '% 대 일본 ' + g.jp['수분·건조|수시로·틈틈이'].toFixed(1) + '%), 후보 3은 수분 × 화장 위 칸(일본 ' + g.jp['수분·건조|화장 위·수정화장'].toFixed(1) + '% 대 한국 ' + g.kr['수분·건조|화장 위·수정화장'].toFixed(1) + '%)에 선다. 후보 1·4·5는 칸이 아니라 축 전체에 걸린다.</p></div>');

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
    ib('오염 토큰을 대칭으로 뺀 값이다. 빼기 전 값은 한국 ' + g.krConcern.join('/') + ', 일본 ' + g.jpConcern.join('/') + ' 이고 격차 방향은 같다.') +
    '</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(CN, g.krConcernStrict, g.jpConcernStrict) +
    '<p>양국 모두 미스트는 수분·건조의 물건이다. 다만 한국은 붉은기·진정이 두 번째 축으로 살아 있고(한율 어린쑥 · 클레어스 카밍 · 아벤느 시술 후), 일본 큐텐에서는 진정조차 保湿의 하위 문장으로 나온다. 톤·결은 양국 모두 작다 — 미스트에 미백을 기대하는 고객은 거의 없다.</p></div>' +
    '<div class="panel"><div class="ph"><h3>진단 3 · 순간축</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(MO, g.krMoment, g.jpMoment) +
    '<p>같은 물건을 한국은 <b>빈도</b>로, 일본은 <b>의식</b>으로 쓴다. 한국은 수시로·틈틈이가 ' + g.krMoment[4].toFixed(1) + '%(일본 ' + g.jpMoment[4].toFixed(1) + '%)로 계절 다음 2위인데, 일본은 밤 세안 후(お風呂上がり) ' + g.jpMoment[1].toFixed(1) + '%와 화장 위·수정화장(メイク直し) ' + g.jpMoment[3].toFixed(1) + '%라는 두 개의 고정 의식으로 쏠린다. 후보 2(한국 전용)와 후보 3(일본 전용)이 이 대칭에서 나온다.</p></div></div>');

  // ── 진단 4: 제품 성질
  E.push('<div class="panel"><div class="ph"><h3>진단 4 · 제품 성질 (어느 후보든 이 위에서 실행된다)</h3>' +
    '<div class="hint">각 항목의 수치는 그 어휘를 담은 리뷰 비율. 길이대를 시장별로 고정했다 (한국 35~75자 · 일본 21~45자)</div></div><ul class="rule">' +
    D.props.map(function (p, i) {
      return '<li><div class="rh"><span class="rt">' + (i + 1) + '. ' + p.label + '</span>' +
        '<span class="pill kr">한국 ' + pc(p.kr) + '</span><span class="pill jp">일본 ' + pc(p.jp) + '</span>' +
        '<span class="pill">@cosme ' + pc(p.co) + '</span></div>' +
        '<div class="rb">' + esc(p.note) + '</div></li>';
    }).join('') + '</ul>' +
    (function () { var f = D.props[2].full; return '<div class="quote">단계 대체 언급, 코퍼스 전량 기준 &nbsp; 한국 <b>' + f.kr.toFixed(2) + '%</b> (' + n(f.krN) + '/' + n(f.krT) + ') &nbsp; 일본 큐텐 <b>' + f.jp.toFixed(2) + '%</b> (' + n(f.jpN) + '/' + n(f.jpT) + ') &nbsp; @cosme <b>' + f.co.toFixed(2) + '%</b> (' + n(f.coN) + '/' + n(f.coT) + ')</div>'; })() + '</div>');

  // ── 진단 5: 통제쌍 (미스트는 4쌍이다)
  E.push('<div class="panel"><div class="ph"><h3>진단 5 · 같은 브랜드 통제쌍이 넷 (세럼판은 하나였다)' +
    ib('한국 10종과 일본 5종에 동시에 있는 브랜드가 달바 · 에스트라 · 바이오힐보 · 차앤박 넷이다. 달바(퍼스트 스프레이 세럼 - 리뉴얼 관계) · 에스트라(아토베리어365 크림미스트 - 완전 동일 제품) · 바이오힐보(콜라겐 리모델링 세럼 겔 미스트 - 완전 동일 제품) · 차앤박(프로폴리스 미스트 - 주력 옵션 동일). 심층 표는 완전 동일 제품인 에스트라.') +
    '</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    '<table class="auto sub"><tr><th>브랜드 (리뷰 한국/일본)</th><th style="text-align:right">분사 KR/JP</th><th style="text-align:right">향 KR/JP</th><th style="text-align:right">재구매 KR/JP</th></tr>' +
    D.pair4.map(function (r) {
      return '<tr><td><b>' + r.kname + '</b> <span class="pill">' + n(r.krN) + ' / ' + n(r.jpN) + '</span></td>' +
        '<td class="n">' + pc(r.spray.kr) + ' / ' + pc(r.spray.jp) + '</td>' +
        '<td class="n">' + pc(r.scent.kr) + ' / ' + pc(r.scent.jp) + '</td>' +
        '<td class="n">' + pc(r.rep.kr) + ' / <b>' + pc(r.rep.jp) + '</b></td></tr>';
    }).join('') + '</table>' +
    '<table class="auto"><tr><th>에스트라 아토베리어365 크림미스트 (완전 동일 제품)</th><th style="text-align:right;width:66px">한국</th><th style="text-align:right;width:66px">일본 큐텐</th><th style="text-align:right;width:74px">일본 @cosme</th></tr>' +
    D.pair.map(function (r) {
      var big = r.kr > r.jp * 1.4 ? 'kr' : (r.jp > r.kr * 1.4 ? 'jp' : '');
      return '<tr><td><b>' + esc(r.lab) + '</b>' + (big ? '<span class="pill ' + big + '">' + (big === 'kr' ? '한국' : '일본') + '</span>' : '') + '</td>' +
        '<td class="n">' + pc(r.kr) + '</td><td class="n">' + pc(r.jp) + '</td><td class="n" style="color:var(--subtle)">' + pc(r.co) + '</td></tr>';
    }).join('') + '</table>' +
    '<p>완전히 같은 제품인데 <b>한국은 분사를 말하고</b>(' + pc(D.pair[0].kr) + ' 대 ' + pc(D.pair[0].jp) + ') <b>일본은 재구매를 말한다</b>(' + pc(D.pair[5].jp) + ' 대 ' + pc(D.pair[5].kr) + '). 4쌍 전부에서 같은 방향이다 — 제품이 같으므로 이 차이는 제품 차이가 아니라 시장의 말하기 차이다. 일본 @cosme 열은 큐텐과 다르게 분사·수정화장이 높다: 같은 일본 안에서도 쇼핑 리뷰(큐텐)와 취미 리뷰(@cosme)의 언어가 갈린다.</p></div>');

  // ── 진단 6: 불만
  E.push('<div class="panel"><div class="ph"><h3>진단 6 · 불만이 무엇에 대한 불만인가' +
    ib('한국은 1~3점 리뷰, 일본은 큐텐 구조 필드에 イマイチ가 붙은 리뷰. 일본 평점은 리뷰 포인트 보상 때문에 5점에 몰려 쓸 수 없다. 배수는 각 시장 전체 대비. 일본 리뷰가 짧아 시장 간 절대율은 비교하지 않는다.') +
    '</h3><div class="hint">불만 비율을 누르면 매치 리뷰 전문이 열린다</div></div>' +
    '<table class="auto"><tr><th>속성</th><th style="text-align:right;width:86px">한국 불만</th><th style="text-align:right;width:56px">배수</th>' +
    '<th style="text-align:right;width:86px">일본 불만</th><th style="text-align:right;width:56px">배수</th></tr>' +
    D.faults.map(function (f) { return f; }).sort(function (a, b) { return (b.kb + b.jb) - (a.kb + a.jb); }).slice(0, 10).map(function (f) {
      return '<tr><td><b>' + esc(f.lab) + '</b></td>' +
        '<td class="n"><a class="evfl" data-m="kr" data-lab="' + esc(f.lab) + '">' + pc(f.kb) + '</a></td><td class="n">' + f.kl.toFixed(1) + 'x</td>' +
        '<td class="n"><a class="evfl" data-m="jp" data-lab="' + esc(f.lab) + '">' + pc(f.jb) + '</a></td><td class="n"><b>' + f.jl.toFixed(1) + 'x</b></td></tr>';
    }).join('') + '</table>' +
    '<div class="evpane" id="evp-faults" style="display:none"></div>' +
    '<p>1위가 갈린다. 한국은 「효과를 모르겠다」(7.7%)와 「그냥 물 같다」(4.5%) — 미스트 회의론이고, 일본은 「향」(13.3%) — 감각 불만이다. 분사 불만은 양쪽 다 배수가 높다(한국 2.5배 · 일본 5.8배): 불만을 쓰러 온 사람일수록 분사 이야기를 한다. 후보 4·5가 여기서 나온다.</p></div>');

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
      '전부 안개분사와 저자극·테스트 계열이다. 단 @cosme 열이 높은 항목(분사)은 부재가 아니라 매체 차이다 — 일본에서 분사는 쇼핑 리뷰가 아니라 취미 리뷰의 언어다. 저자극·논코메도제닉은 @cosme에서도 낮다: 이쪽이 진짜 부재다.') +
    tl('일본이 더 크게 말한다', D.transfer.jpMore.slice(0, 8),
      '통수 세기(何本目)와 욕실 의식(お風呂上がり)이 위에 있다. 일본 리뷰의 기본형이 「또 샀다」라서다. 후보 1이 이 언어에 올라탄다.') + '</div>');

  // ── 진단 8: 획득 언어
  E.push('<div class="panel"><div class="ph"><h3>진단 8 · 처음 사게는 해도, 다시 사게 하지는 못하는 말' +
    ib('계산법: 제품 · 리뷰 길이 · 채널이 같은 그룹 안에서 그 말이 든 리뷰와 아닌 리뷰의 재구매율 차이를 내고 가중평균했다(Mantel-Haenszel). 재구매라는 단어가 본문에 든 리뷰는 계산에서 뺐다. 한국 컨셉 200개 중 n>=120인 ' + D.dist.n + '개가 대상이고, |z|>=3 인 것이 ' + D.dist.sig + '개(양수 ' + D.dist.sigPos + ' · 음수 ' + D.dist.sigNeg + ')다. 컨셉별 대표 인용은 한국 10종 컨셉 리포트(../mist/)에 있다.') +
    '</h3><div class="hint">읽는 법: 이 말을 쓴 고객은 같은 제품의 다른 고객보다 재구매가 그만큼 적다</div></div>' +
    '<table class="auto"><tr><th>말</th><th style="text-align:right;width:90px">재구매 차이</th>' +
    '<th style="text-align:right;width:70px">리뷰 수</th><th style="text-align:right;width:130px">몇 개 제품에서 같은 방향</th></tr>' +
    D.acquire.slice(0, 10).map(function (r) {
      return '<tr><td><b>' + esc(r.label) + '</b><span class="pill">' + r.name + '</span></td>' +
        '<td class="n neg">' + sg(r.lift) + '%p</td><td class="n">' + n(r.n) + '</td>' +
        '<td class="n">' + (r.nProd > 1 ? r.nProd + '종 중 ' + Math.round(r.nProd * r.agree / 100) + '종' : '1종') + '</td></tr>';
    }).join('') + '</table>' +
    '<p>네 갈래다: 형제 SKU 임상 수치와 판매 속도 자랑(브랜드가 상세에서 가장 크게 쓰는 말), 향 반대표, 분사 배신(「안개분사가 아니다」), 그리고 바이럴·굿즈 구매(「곰돌이 공병 때문에 샀다」). 넷 다 사게는 하고 남기지는 못한다.</p></div>');

  // ── 진단 9: 행동 동사
  E.push('<div class="panel"><div class="ph"><h3>진단 9 · 한국은 빈도로 쓰고, 일본은 의식으로 쓴다' +
    ib('코퍼스 전량 기준. 시간 기울기는 따로 진단 10에 실었다.') +
    '</h3><div class="hint">고객이 미스트를 가지고 실제로 하는 행동. 한국 = 올리브영 리뷰, 일본 = 큐텐 리뷰</div></div>' +
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
    '<p>한국 고객은 미스트를 <b>빈도</b>로 쓴다 — 수시로 뿌리고, 자리마다 배치하고, 분사를 판정한다. 일본 고객은 미스트를 <b>반복 의식</b>으로 쓴다 — 목욕 후에 뿌리고, 수정화장에 쓰고, 같은 걸 다시 산다. 오른쪽 열이 한국 브랜드의 주장 비율인데, 배치·빈도 계열은 상세페이지에서 TIP 한 줄이고 정착 계열은 사실상 0이다.</p></div>');

  // ── 진단 10: 시간 기울기
  E.push('<div class="panel"><div class="ph"><h3>진단 10 · 한국에서 뜨는 컨셉 (최근 12개월 대 그 이전, 길이 보정)' +
    ib('길이를 안 잡으면 모든 컨셉의 언급률이 시간이 갈수록 기계적으로 떨어진다 → ' + D.slope.band + '만 놓고 잰다. 기준선 ' + D.slope.cut + '. 최근·이전 양쪽에 150건 이상, 매치 25건 이상인 컨셉만 남겼다. 표본 창이 짧은 신제품(클레어스 · 디어달리아 · 바이오힐보 · 아누아 · 메디큐브)은 계산에서 빠진다.') +
    '</h3><div class="hint">측정 가능 컨셉 ' + D.slope.n + '개 · 제품 ' + D.slope.prods.join(' · ') + '</div></div>' +
    '<div class="two" style="gap:0 18px">' +
    ['뜨는 컨셉', '지는 컨셉'].map(function (title, side) {
      var list = side === 0 ? D.slope.rows.slice(0, 8) : D.slope.rows.slice(-8).reverse();
      return '<div><table class="auto"><tr><th>' + title + '</th><th style="text-align:right;width:56px">배수</th>' +
        '<th style="text-align:right;width:96px">이전 → 최근</th><th style="text-align:right;width:74px">재구매</th></tr>' +
        list.map(function (r) {
          return '<tr><td>' + esc(r.label.length > 44 ? r.label.slice(0, 44) + '…' : r.label) + '<span class="pill">' + r.name + '</span>' +
            '<span class="pill">' + (r.side === 'brand' ? '브랜드' : '고객') + '</span></td>' +
            '<td class="n"><b>' + r.slope.toFixed(2) + 'x</b></td>' +
            '<td class="n">' + r.older.toFixed(1) + ' → ' + r.recent.toFixed(1) + '%</td>' +
            '<td class="n ' + (r.lift >= 0 ? 'pos' : 'neg') + '">' + sg(r.lift) + 'pp</td></tr>';
        }).join('') + '</table></div>';
    }).join('') + '</div>' +
    '<p>뜨는 쪽 1위가 <b>달바 「집·회사·가방·차에 한 통씩」 2.04배</b>(1.8% → 3.8%)다. 후보 2가 겨냥하는 배치 습관이 지금 자라는 중이라는 뜻이다. 아벤느의 <b>「그냥 물 논쟁」 1.85배</b>도 같이 큰다 — 미스트 회의론과 배치 습관이 동시에 커지는 시장이다. 지는 쪽은 전부 브랜드 카피다: 차앤박 「Solution 01 영양보습」 0.53배 · 아벤느 「10초에 1개씩 판매」 0.58배 · 차앤박 「스페셜 처방」 0.63배. 브랜드가 상세에 크게 쓴 말일수록 리뷰에서 빠르게 사라진다.</p></div>');

  // ── 발
  E.push('<div class="foot">' +
    '<b>대상</b> 한국 = 올리브영 미스트/오일 카테고리 판매랭킹 상위 ' + D.corpus.krProducts + '종, 브랜드 중복 제외 · 오일 제외 (' + D.corpus.krNames.join(' · ') + '). ' +
    '일본 = 큐텐 「ミスト」 판매랭킹(광고행 0건 확인) 브랜드 중복 제외 상위 ' + D.corpus.jpProducts + '종 (' + D.corpus.jpNames.join(' · ') + ') — 5종 전부 한국 브랜드다. 브랜드 대표 리스팅은 그 브랜드 미스트 리스팅 중 후기 최다(이종 묶음 세트 제외).<br>' +
    '<b>코퍼스</b> 리뷰 ' + n(D.corpus.krReviews) + ' + ' + n(D.corpus.jpReviews) + '건 · 일본 @cosme ' + n(D.corpus.jpCosme) + '건 · ' +
    '한국 상세페이지 이미지 ' + n(D.corpus.krDetail) + '장(OCR) · 한국 메타 광고 ' + n(D.corpus.krAds) + '건 · 한국 UGC ' + n(D.corpus.krUgc) + '건. 스냅샷 ' + D.collected + '. 인용문은 전부 원문 문자열 대조로 검증했다(생성 없음).<br>' +
    '<b>@cosme 범위</b> 달바(9,671) · 에스트라(570) · 차앤박 프로P(1,860) · MIGUHARA(9) 전량이다. <b>바이오힐보 콜라겐 세럼겔미스트는 @cosme에 제품 페이지가 아직 없다</b>(2026-08-12 확인) — 그래서 @cosme 열은 4종 기준이다.<br>' +
    '<b>일본어 원문</b> 후보 카드의 인용문은 전부 한국어 번역을 붙였고(사람이 옮김, 기계번역 없음), 근거 패널의 일본어 행은 패널마다 앞 350건에 번역을 붙였다(번역은 사람이 옮겼고 ko_map 에 누적된다). 격자·불만 딥패널의 나머지는 원문 그대로다. 작성자 식별정보는 수집하지 않았다.<br>' +
    '<b>보정</b> 재구매 리프트는 제품 · 리뷰 길이 · 채널로 층화. TPO 격자는 제품 동일가중. 고민축은 오염 토큰을 양쪽에서 대칭으로 뺀 값.<br>' +
    '<b>단위</b> 시장 간 절대율은 비교하지 않는다. 한국 리뷰가 일본 큐텐 리뷰보다 길다. 비교는 같은 시장 안의 순위와 배수, 그리고 같은 제품의 통제쌍(4쌍)으로 한다.<br>' +
    '<b>한계</b> 한국 리뷰는 전량이 아니라 <b>비로그인 층화 표본</b>이다 (' + n(D.corpus.krReviews) + ' / ' + n(D.corpus.krSiteTotal) + '건 = ' + (D.corpus.krReviews / D.corpus.krSiteTotal * 100).toFixed(1) + '%; 정렬 5축 × 리뷰유형 4축, 조합당 500건 상한). 대형 리스팅(달바 · 아벤느)일수록 표본 비율이 낮고 최근으로 쏠려 있다. 시간 기울기(진단 10)는 창이 충분한 5종에서만 냈고 나머지 5종은 계산에서 빠진다. 일본 큐텐은 전량이지만 리뷰의 76%가 달바 한 제품이다 — 시장 합계가 아니라 제품별 분해로 읽어야 하는 이유고, 격자는 제품 동일가중으로 이를 보정했다. MIGUHARA는 후기 22건(랭킹은 최근 판매속도 가중이라 신제품이 위로 온다)이라 비율 계산에서 사실상 빠진다. 일본 상세페이지와 일본 광고는 수집하지 않았다(한국은 둘 다). 가격 · 원가 · 실제 전환은 이 데이터에 없다. 재구매 차이는 관찰 상관이지 실험이 아니다.<br>' +
    '<b>수집</b> 전부 공개 페이지에서 속도 제한을 지켜 수집.' +
    '</div>');

  document.getElementById('app').innerHTML = E.join('');
})();
