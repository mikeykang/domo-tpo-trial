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
  var KN = { medicube:'메디큐브', torriden:'토리든', numbuzin:'넘버즈인', isoi:'아이소이', biodance:'바이오던스',
    jp_rejuran:'REJURAN', jp_skin1004:'SKIN1004', jp_sbe:'Sung Boon Editor', jp_celimax:'celimax', jp_numbuzin:'numbuzin(JP)' };
  var LF = function (l) { for (var i=0;i<D.lift.length;i++) if (D.lift[i].lab===l) return D.lift[i]; return {lift:0,z:0,n:0}; };
  var PB = function (l) { for (var i=0;i<D.probes.length;i++) if (D.probes[i].lab===l) return D.probes[i]; return {kr:0,jp:0,det:0,ad:0,krN:0,jpN:0}; };

  // ── 원자료 지연 로드 + 렌더 (/spec 과 같은 기계)
  var loaded = {};
  function lazy(f, cb) {
    if (loaded[f]) return cb();
    var s = document.createElement('script');
    s.src = f; s.onload = function () { loaded[f] = 1; cb(); };
    s.onerror = function () { alert('원자료 로드 실패: ' + f); };
    document.head.appendChild(s);
  }
  var CHUNK = 300;
  function rowLine(r, badge) {
    var b = '';
    if (badge === 'buy' && typeof r[3] === 'string') b = '<span class="bpill' + (r[3] === '세트' ? '' : ' npill') + '">' + esc(r[3]) + '</span>';
    else if (typeof r[3] === 'number' && r[3]) {
      if (badge === 're') b = '<span class="bpill">재구매</span>';
      if (badge === 'neg') b = '<span class="bpill npill">부정</span>';
    }
    return '<div class="evr"><span class="pill">' + esc(KN[r[0]] || r[0]) + '</span><span class="evd mono">' + esc(r[1] || '') + '</span>' +
      b + '<div class="evtw"><div class="evt">' + esc(r[2]) + '</div></div></div>';
  }
  function paneRender(pane) {
    var st = pane._st, q = st.q.trim();
    var arr = q ? st.arr.filter(function (r) { return r[2].indexOf(q) >= 0; }) : st.arr;
    pane.querySelector('.evlist').innerHTML = arr.slice(0, st.shown).map(function (r) { return rowLine(r, st.badge); }).join('') ||
      '<div class="evr" style="color:var(--faint)">매치 없음</div>';
    pane.querySelector('.evcnt').textContent = (q ? arr.length.toLocaleString() + ' / ' : '') + st.arr.length.toLocaleString() + '건';
    pane.querySelector('.evmore').style.display = arr.length > st.shown ? '' : 'none';
  }
  function paneOpen(pane, title, arr, note, badge) {
    pane.style.display = '';
    pane._st = { arr: arr || [], shown: CHUNK, q: '', badge: badge || '' };
    pane.innerHTML = '<div class="evhd"><b>' + title + '</b><span class="evcnt mono"></span>' +
      '<input class="evq" placeholder="본문 검색">' + (note ? '<span class="evnote">' + note + '</span>' : '') +
      '<a class="evclose">닫기</a></div><div class="evlist"></div><a class="evmore">더 보기 (' + CHUNK + '건씩)</a>';
    paneRender(pane); pane.scrollIntoView({ block: 'nearest' });
  }
  document.addEventListener('input', function (e) {
    if (!e.target.classList.contains('evq')) return;
    var p = e.target.closest('.evpane'); p._st.q = e.target.value; p._st.shown = CHUNK; paneRender(p);
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.classList.contains('evclose')) { t.closest('.evpane').style.display = 'none'; return; }
    if (t.classList.contains('evmore')) { var p = t.closest('.evpane'); p._st.shown += CHUNK; paneRender(p); return; }
    // 프로브 매치 (리뷰/상세/광고)
    if (t.classList.contains('evlink')) {
      var lab = t.dataset.lab, side = t.dataset.side, pane = t.closest('.panel').querySelector('.evpane');
      var file = (side === 'det' || side === 'ad') ? 'evsupply.js' : 'evprobe.js';
      lazy(file, function () {
        var arr = (side === 'det') ? window.EVS.det[lab] : (side === 'ad') ? window.EVS.ad[lab] :
                  (side === 'jp') ? window.EVP.jp[lab] : window.EVP.kr[lab];
        var nm = { kr: '한국 리뷰', jp: '일본 리뷰', det: '한국 상세페이지 OCR', ad: '한국 메타 광고' }[side];
        paneOpen(pane, '「' + lab + '」 · ' + nm + ' 매치 전문', arr,
          side === 'jp' ? '일본어 원문 그대로' : '', side === 'kr' ? 're' : '');
      });
      return;
    }
    // 격자 칸
    var cell = t.closest && t.closest('.evcell');
    if (cell) {
      var key = cell.dataset.gc, pg = document.getElementById('evp-grid');
      lazy('evgrid.js', function () {
        var kr = window.EVG.kr[key] || [], jp = window.EVG.jp[key] || [];
        paneOpen(pg, '칸 「' + key.replace('|', ' × ') + '」 · 한국 ' + kr.length.toLocaleString() + ' + 일본 ' + jp.length.toLocaleString(),
          kr.concat(jp), '일본 문장은 원문 그대로 · 부정 문장도 지우지 않았다', 'neg');
      });
      return;
    }
    // 불만
    if (t.classList.contains('evfl')) {
      var m = t.dataset.m, fl = t.dataset.lab, pf = document.getElementById('evp-faults');
      lazy('evfaults.js', function () {
        paneOpen(pf, fl + ' · ' + (m === 'kr' ? '한국 1~3점' : '일본 イマイチ') + ' 매치 전문', window.EVF[m][fl] || [],
          m === 'jp' ? '일본어 원문 그대로' : '');
      });
      return;
    }
    // 번들 실험
    if (t.classList.contains('evex')) {
      var k = t.dataset.k, px = document.getElementById('evp-exp');
      lazy('evexp.js', function () { paneOpen(px, '리쥬란 · ' + k + ' 구매자 리뷰 전문', window.EVX[k] || [], '일본어 원문 그대로', 'buy'); });
      return;
    }
    // 통제쌍
    if (t.classList.contains('evpr')) {
      var side2 = t.dataset.side, pp = document.getElementById('evp-pair');
      lazy('evpair.js', function () {
        paneOpen(pp, '넘버즈인 5번 · ' + (side2 === 'kr' ? '한국 기획(패드 6매)' : '일본 세트(필름패드 70매)') + ' 리뷰 전문',
          window.EVPR[side2] || [], side2 === 'jp' ? '일본어 원문 그대로' : '', side2 === 'kr' ? 're' : '');
      });
      return;
    }
  });
  var lk = function (lab, side, txt) { return '<a class="evlink" data-lab="' + esc(lab) + '" data-side="' + side + '">' + txt + '</a>'; };

  // ── 머리
  E.push('<div class="top"><div>' +
    '<div class="kick">Bundle &amp; TPO &middot; SERUM + PAD &middot; KR 5 + JP 5</div>' +
    '<h1>세럼과 패드를 같이 파는 제품, 컨셉 후보 5</h1>' +
    '<div class="sub">세럼과 토너패드가 <b>한 SKU로 함께 오는</b> 리스팅만 · 한국 올리브영 기획 ' + D.corpus.krProducts + '종 · 일본 큐텐 세트 ' + D.corpus.jpProducts + '종 · 수요와 공급을 같은 자로 잰 결과 · 모든 수치는 눌러서 원자료를 연다</div>' +
    '</div><div class="topmeta">' +
    '<span>리뷰 <b class="mono">' + n(D.corpus.krReviews) + '</b>' + ib('한국은 층화 표본이다. 올리브영 전체 ' + n(D.corpus.krSite) + '건 중 ' + (D.corpus.krReviews / D.corpus.krSite * 100).toFixed(1) + '%. 일본은 전량.') + ' + <b class="mono">' + n(D.corpus.jpReviews) + '</b></span>' +
    '<span>상세 <b class="mono">' + n(D.corpus.krDetail) + '</b></span>' +
    '<span>광고 <b class="mono">' + n(D.corpus.krAds) + '</b></span>' +
    '<span>수집 <b class="mono">' + D.collected + '</b></span>' +
    '</div></div>');

  // ── 대상
  E.push('<div class="panel"><div class="ph"><h3>대상 · 한 SKU로 세럼과 패드가 함께 오는 리스팅' +
    ib('브랜드 중복 제외, 리뷰 최다순. 선택형 리스팅은 리뷰의 옵션 필드로 실제 동시구매율을 확인한 뒤 채택했다. beplain(리뷰 5,586, 일본 1위)은 2개 선택 리스팅인데 패드 선택이 4%라 제외. One-day\'s you(93,185)는 선택 7종이 전부 패드라 제외. APRILSKIN 세럼팩패드는 번들이 아니라 패드 자체가 세럼인 융합 제품이라 제외.') +
    '</h3></div><table class="auto"><tr><th>한국 · 올리브영 기획</th><th>세럼</th><th>패드</th><th style="text-align:right">리뷰</th><th style="text-align:right">커버리지</th><th style="text-align:right">패드 언급</th></tr>' +
    D.prod.map(function (p) { return '<tr><td><b>' + esc(p.name) + '</b></td><td>' + esc(p.serum) + '</td><td>' + esc(p.pad) + '</td>' +
      '<td class="n">' + n(p.revs) + '</td><td class="n">' + pc(p.cov) + '</td><td class="n">' + p2(p.padTalk) + '</td></tr>'; }).join('') +
    '</table><table class="auto" style="margin-top:12px"><tr><th>일본 · 큐텐 세트</th><th>세럼</th><th>패드</th><th style="text-align:right">리뷰</th><th style="text-align:right"></th><th style="text-align:right">패드 언급</th></tr>' +
    D.jprod.map(function (p) { return '<tr><td><b>' + esc(p.name) + '</b></td><td>' + esc(p.serum) + '</td><td>' + esc(p.pad) + '</td>' +
      '<td class="n">' + n(p.revs) + '</td><td class="n">전량</td><td class="n">' + p2(p.padTalk) + '</td></tr>'; }).join('') +
    '</table><p>한국 기획은 패드가 <b>2~10매 소량</b>, 일본 세트는 대부분 <b>60~70매 본품</b>이다. 그 차이가 리뷰의 패드 언급률에 그대로 찍힌다 — 한국 ' + p2(PB('패드를 말한다').kr) + ' 대 일본 ' + p2(PB('패드를 말한다').jp) + '.</p></div>');

  // ── 후보 색인
  var oneNum = { compose:'구성 +11.4pp 대 증정 −2.7pp', notstick:'세트 7.3% 대 패드단품 8.0%',
    kera:'일본 최대 칸 20.3% 대 한국 0.9%', volume:'효과 모르겠다 −8.8pp · 용량 +10.5pp', cospa:'세트 리스팅 최저축이 コスパ' };
  E.push('<div class="panel dark"><div class="ph"><h3 style="color:#fff">후보 컨셉 5 · 순위</h3>' +
    '<div class="hint" style="color:#8f8f8f">기준: 고객 언어에 이미 있고(수요) 브랜드 주장에 없다(공급). 카드마다 근거 전체를 붙였다</div></div>' +
    '<ul class="cidx">' + D.cand.map(function (c) {
      return '<li><span class="ci-r mono">' + c.rank + '</span><span class="ci-m ' + c.market + '">' + MK[c.market] + '</span>' +
        '<span class="ci-n">' + esc(c.name) + '</span><span class="ci-k mono">' + esc(oneNum[c.id] || '') + '</span></li>'; }).join('') + '</ul></div>');

  // ── 후보 카드 (수요/공급 행에 원자료 버튼)
  var EVMAP = {
    compose: { demand: { 0:['세트·기획이라서 샀다','kr'], 1:['증정·사은품 취급','kr'], 2:['패드를 말한다','kr'] },
               supply: { 0:['세트·기획이라서 샀다','det'], 1:['세트·기획이라서 샀다','ad'] } },
    kera:    { demand: { 1:['모공·피지','jp'], 2:['패드를 말한다','jp'] }, supply: { 0:['모공·피지','det'], 1:['모공·피지','ad'] } },
    volume:  { demand: { 0:['효과를 모르겠다','kr'], 1:['효과를 모르겠다','kr'], 2:['용량이 넉넉','kr'] },
               supply: { 0:['효과를 모르겠다','det'], 1:['가성비·싸다','ad'] } },
    cospa:   { demand: { 2:['구성·가격','jp'] }, supply: {} },
  };
  var evTable = function (title, rows, map) {
    return '<div class="evb"><div class="evh">' + title + '</div><table class="ev">' + rows.map(function (r, i) {
      var m = map && map[i];
      var btn = m ? '<span class="evbtns">' + lk(m[0], m[1], '원자료') + '</span>' : '';
      return '<tr><td class="ek">' + esc(r[0]) + '</td><td class="evv mono">' + esc(r[1]) + '</td><td class="es">' + esc(r[2] || '') + btn + '</td></tr>';
    }).join('') + '</table></div>';
  };
  D.cand.forEach(function (c) {
    var m = EVMAP[c.id] || {};
    var body = '<div class="evrow">' + evTable('수요 · 고객이 말한다', c.demand, m.demand) + evTable('공급 · 브랜드가 판다', c.supply, m.supply) + '</div>';
    body += '<div class="evpane" style="display:none"></div>';
    body += '<ul class="why">' + c.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>';
    if (c.id === 'notstick') {
      body += '<table class="auto sub"><tr><th>리쥬란 한 리스팅 안의 구매 형태</th><th style="text-align:right">n</th><th style="text-align:right">평점</th><th style="text-align:right">리피트 언어</th><th style="text-align:right">둘 다 언급</th></tr>' +
        D.experiment.filter(function (e) { return e.k !== 'unknown'; }).map(function (e) {
          var nm = { set:'세트', padOnly:'패드 단품', ampOnly:'앰플 단품' }[e.k];
          return '<tr><td><b><a class="evex" data-k="' + nm + '">' + nm + '</a></b></td><td class="n">' + n(e.n) + '</td><td class="n">' + e.avg +
            '</td><td class="n' + (e.k === 'padOnly' ? ' pos' : '') + '">' + p2(e.rep) + '</td><td class="n">' + p2(e.both) + '</td></tr>'; }).join('') +
        '</table><div class="evpane" id="evp-exp" style="display:none"></div>';
    }
    if (c.id === 'cospa') {
      body += '<table class="auto sub"><tr><th>일본 5종의 큐텐 강제 3축 (낮은 순)</th><th>1</th><th>2</th><th>3</th></tr>' +
        D.jpAxes.map(function (j) { return '<tr><td><b>' + esc(j.name) + '</b></td>' + j.axes.map(function (a, i) {
          return '<td class="n"' + (i === 0 ? ' style="color:var(--bad)"' : '') + '>' + esc(a.k) + ' ' + a.pct + '%</td>'; }).join('') + '</tr>'; }).join('') +
        '</table><p style="margin-top:4px">세트로 등록된 리스팅(리쥬란·성분에디터)에는 <b>セット内容 · コスパ</b> 축이 붙고, 단품 세럼으로 등록된 리스팅에는 스페셜케어 축이 붙는다. 큐텐이 카테고리별로 다른 축을 강제한다.</p>';
    }
    body += c.quotes.map(function (q) { return '<div class="qt"><span class="pill">' + esc(q.name) + '</span> ' + esc(q.t) +
      (q.ko ? '<div class="qko">' + esc(q.ko) + '</div>' : '') + '</div>'; }).join('');
    body += '<div class="risk"><b>깨지는 조건</b> ' + esc(c.risk) + '</div>';
    E.push('<div class="panel cand"><div class="ch"><span class="cr mono">' + c.rank + '</span>' +
      '<div class="ct"><div class="cn">' + esc(c.name) + '</div>' + (c.jp ? '<div class="cj">' + esc(c.jp) + '</div>' : '') + '</div>' +
      '<div class="cp"><span class="pill ' + (c.market === 'jp' ? 'jp' : c.market === 'kr' ? 'kr' : '') + '">' + MK[c.market] + '</span>' +
      '<span class="pill">' + esc(c.cell) + '</span></div></div>' + body + '</div>');
  });

  // ── 진단 1: TPO 격자
  var mx = 0; CN.forEach(function (c) { MO.forEach(function (o) { mx = Math.max(mx, g.kr[c + '|' + o], g.jp[c + '|' + o]); }); });
  var rows = '<tr><th style="width:84px"></th>' + MO.map(function (o) { return '<th style="text-align:center">' + o + '</th>'; }).join('') + '</tr>';
  CN.forEach(function (c) {
    rows += '<tr><td class="lab">' + c + '</td>' + MO.map(function (o) {
      var a = g.kr[c + '|' + o], b = g.jp[c + '|' + o], hi = Math.max(a, b) >= mx * 0.45;
      return '<td><div class="cell evcell' + (hi ? ' hi' : '') + '" data-gc="' + c + '|' + o + '" title="누르면 이 칸의 문장 전체">' +
        '<div class="duo"><span class="a">' + a.toFixed(1) + '</span><span class="b">' + b.toFixed(1) + '</span></div>' +
        '<div class="bars"><i class="a" style="width:' + Math.max(2, a / mx * 28) + 'px"></i><i class="b" style="width:' + Math.max(2, b / mx * 28) + 'px"></i></div></div></td>';
    }).join('') + '</tr>';
  });
  E.push('<div class="panel"><div class="ph"><h3>진단 1 · TPO 격자, 칸별 문장 점유' +
    ib('한국 리뷰에서 뽑은 문장 ' + n(g.krSent) + '개, 일본 ' + n(g.jpSent) + '개. 고민어와 순간어를 함께 담은 문장만 센다. 제품 동일가중. 순간축 마지막 「패드와 함께」는 이 문서 전용 축 — 패드를 언급한 문장.') +
    '</h3><div class="lg"><span><i class="a"></i>한국 ' + D.corpus.krProducts + '종</span><span><i class="b"></i>일본 ' + D.corpus.jpProducts + '종</span></div></div>' +
    '<table class="cellgrid">' + rows + '</table><div class="evpane" id="evp-grid" style="display:none"></div>' +
    '<p>칸을 누르면 그 칸의 문장 전체가 열린다. 일본 최대 칸이 <b>각질·모공 × 패드와 함께 ' + g.jp['각질·모공|패드와 함께'].toFixed(1) + '%</b>인데 한국은 <b>' + g.kr['각질·모공|패드와 함께'].toFixed(1) + '%</b>다. 22배. 후보 3이 여기서 나온다.</p></div>');

  // ── 진단 2·3
  var cmp = function (labels, a, b) { var top = Math.max.apply(null, a.concat(b));
    return labels.map(function (l, i) { return '<div class="cmp"><div class="cl">' + l + '</div>' +
      '<div class="side"><span class="nm">' + a[i].toFixed(1) + '%</span><span class="tk"><i class="a" style="width:' + (a[i] / top * 100) + '%"></i></span></div>' +
      '<div class="side"><span class="nm">' + b[i].toFixed(1) + '%</span><span class="tk"><i class="b" style="width:' + (b[i] / top * 100) + '%"></i></span></div></div>'; }).join(''); };
  E.push('<div class="two">' +
    '<div class="panel"><div class="ph"><h3>진단 2 · 고민축</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(CN, g.krConcern, g.jpConcern) + '<p>한국은 수분·진정, 일본은 각질·모공으로 기운다. 같은 조합인데 한국 기획은 수분 세럼 중심, 일본 세트는 모공 세트 중심으로 팔린다.</p></div>' +
    '<div class="panel"><div class="ph"><h3>진단 3 · 순간축</h3><div class="lg"><span><i class="a"></i>한국</span><span><i class="b"></i>일본</span></div></div>' +
    cmp(MO, g.krMoment, g.jpMoment) + '<p>「패드와 함께」가 한국 ' + g.krMoment[6].toFixed(1) + '% 대 일본 ' + g.jpMoment[6].toFixed(1) + '%다. 일본 세트 리뷰의 3분의 1이 패드를 말한다.</p></div></div>');

  // ── 진단 4: 제품 성질
  E.push('<div class="panel"><div class="ph"><h3>진단 4 · 제품 성질 (어느 후보든 이 위에서 실행된다)</h3>' +
    '<div class="hint">그 어휘를 담은 리뷰 비율. 길이대를 시장별로 고정했다 (한국 35~75자 · 일본 21~45자)</div></div><ul class="rule">' +
    D.props.map(function (p, i) { return '<li><div class="rh"><span class="rt">' + (i + 1) + '. ' + esc(p.label) + '</span>' +
      '<span class="pill kr">한국 ' + pc(p.kr) + '</span><span class="pill jp">일본 ' + pc(p.jp) + '</span></div>' +
      '<div class="rb">' + esc(p.note) + '</div></li>'; }).join('') + '</ul></div>');

  // ── 진단 5: 통제쌍
  E.push('<div class="panel"><div class="ph"><h3>진단 5 · 같은 조합 통제쌍, 넘버즈인 5번 글루타치온C 세럼+패드' +
    ib('한국과 일본에 같은 조합이 그대로 있다. 한국은 「5번 흔적 앰플 30ml 기획 (+패드 6매)」, 일본은 「5番 美容液 30ml + フィルムパッド 70枚 2個セット」. 같은 브랜드·같은 라인·같은 두 물건이므로 차이는 제품 차이가 아니라 구성과 시장의 차이다. 리뷰 한국 ' + n(D.pairMeta.krN) + '건 · 일본 ' + n(D.pairMeta.jpN) + '건.') +
    '</h3><div class="lg"><span><i class="a"></i>한국 (패드 6매)</span><span><i class="b"></i>일본 (패드 70매)</span></div></div>' +
    '<table class="auto"><tr><th>프로브</th><th style="text-align:right;width:76px">한국</th><th style="text-align:right;width:76px">일본</th><th style="text-align:right;width:60px">배수</th></tr>' +
    D.pair.map(function (r) { var ratio = r.jp > 0 ? r.kr / r.jp : null;
      var side = ratio == null ? '' : (ratio >= 1.5 ? 'kr' : (ratio <= 0.67 ? 'jp' : ''));
      return '<tr><td><b>' + esc(r.lab) + '</b>' + (side ? '<span class="pill ' + side + '">' + (side === 'kr' ? '한국' : '일본') + '</span>' : '') + '</td>' +
        '<td class="n">' + pc(r.kr) + '</td><td class="n">' + pc(r.jp) + '</td>' +
        '<td class="n">' + (ratio == null ? '-' : (ratio >= 1 ? ratio.toFixed(1) + 'x' : '1/' + (1 / ratio).toFixed(1))) + '</td></tr>'; }).join('') +
    '</table><div class="evpane" id="evp-pair" style="display:none"></div>' +
    '<p>같은 두 물건인데 한국은 <b>잡티·흔적을 ' + pc(D.pair[3].kr) + '</b> 말하고 일본은 ' + pc(D.pair[3].jp) + '다. 한국 리뷰의 <b>' + pc(D.pair[4].kr) + '</b>가 「효과를 모르겠다」인데 일본은 ' + pc(D.pair[4].jp) + '다 — 일본 리뷰가 짧아서 판단 자체를 잘 안 쓴다. 반대로 「세트·구성이라서」는 일본이 ' + pc(D.pair[2].jp) + '로 한국(' + pc(D.pair[2].kr) + ')의 두 배다. 패드가 본품이면 세트가 사는 이유가 되고, 덤이면 안 된다. ' +
    '<a class="evpr" data-side="kr">한국 리뷰 전문</a> · <a class="evpr" data-side="jp">일본 리뷰 전문</a></p></div>');

  // ── 진단 6: 수요 대 공급
  E.push('<div class="panel"><div class="ph"><h3>진단 6 · 수요와 공급을 같은 자로' +
    ib('컨셉을 제품별로 새로 쓰지 않고 양국에 같은 뜻으로 존재하는 프로브 27개로만 쟀다. 이 문서의 단위는 「제품 컨셉」이 아니라 「두 물건을 한 SKU로 산 사람의 행동」이기 때문이다. 수요=리뷰, 공급=상세 OCR ' + n(D.corpus.krDetail) + '장 + 메타 광고 ' + n(D.corpus.krAds) + '건.') +
    '</h3><div class="hint">모든 비율을 눌러서 매치 원문을 연다</div></div>' +
    '<table class="auto"><tr><th>프로브</th><th style="text-align:right;width:62px">리뷰</th><th style="text-align:right;width:62px">상세</th><th style="text-align:right;width:62px">광고</th><th style="text-align:right;width:62px">일본</th></tr>' +
    D.probes.slice().sort(function (a, b) { return (b.kr - Math.max(b.det, b.ad)) - (a.kr - Math.max(a.det, a.ad)); }).slice(0, 12).map(function (p) {
      var gap = p.kr - Math.max(p.det, p.ad);
      return '<tr><td><b>' + esc(p.lab) + '</b>' + (gap >= 5 ? '<span class="pill kr">공급 없음</span>' : '') + '</td>' +
        '<td class="n">' + lk(p.lab, 'kr', p2(p.kr)) + '</td><td class="n" style="color:var(--subtle)">' + lk(p.lab, 'det', p2(p.det)) + '</td>' +
        '<td class="n" style="color:var(--subtle)">' + lk(p.lab, 'ad', p2(p.ad)) + '</td><td class="n">' + lk(p.lab, 'jp', p2(p.jp)) + '</td></tr>'; }).join('') +
    '</table><div class="evpane" style="display:none"></div>' +
    '<p>「효과를 모르겠다」가 리뷰 ' + p2(PB('효과를 모르겠다').kr) + '인데 상세 ' + p2(PB('효과를 모르겠다').det) + ' · 광고 ' + p2(PB('효과를 모르겠다').ad) + '다. 아무도 답하지 않는다. 반대로 「가성비」는 광고가 ' + p2(PB('가성비·싸다').ad) + '로 크게 파는데 리뷰는 ' + p2(PB('가성비·싸다').kr) + '다.</p></div>');

  // ── 진단 7: 프로브 이전
  var tl = function (title, list, note) {
    return '<div class="panel"><div class="ph"><h3>' + title + '</h3></div>' +
      '<table class="auto"><tr><th>프로브</th><th style="text-align:right;width:60px">한국</th><th style="text-align:right;width:60px">일본</th></tr>' +
      list.map(function (r) { return '<tr><td>' + esc(r.lab) + '</td><td class="n">' + p2(r.kr) + '</td><td class="n">' + p2(r.jp) + '</td></tr>'; }).join('') +
      '</table>' + (note ? '<p>' + note + '</p>' : '') + '</div>'; };
  E.push('<div class="two">' +
    tl('진단 7 · 한국에서 크고 일본에 발판이 없다', D.transfer.krOnly,
       '판단 유보와 잡티 서사가 한국 쪽에 몰린다. 일본 리뷰가 짧아 절대율이 낮게 나오는 점을 감안해도, 「효과를 모르겠다」의 격차는 매체 차이만으로 설명되지 않는다.') +
    tl('일본이 더 크게 말한다', D.transfer.jpMore,
       '패드와 모공이다. 패드가 본품인 세트에서는 패드가 리뷰의 주어가 된다. 후보 1·3이 여기서 나온다.') + '</div>');

  // ── 진단 8: 재구매 리프트
  E.push('<div class="panel"><div class="ph"><h3>진단 8 · 재구매를 올리는 말과 깎는 말' +
    ib('제품 · 리뷰 길이 · 채널이 같은 그룹 안에서 그 말이 든 리뷰와 아닌 리뷰의 재구매율 차이를 내고 가중평균했다(Mantel-Haenszel). 재구매 어휘가 본문에 든 리뷰는 계산에서 뺐다. 재구매 표본 3,301건.') +
    '</h3><div class="hint">읽는 법: 이 말을 쓴 고객은 같은 제품의 다른 고객보다 재구매가 그만큼 많다(적다)</div></div>' +
    '<table class="auto"><tr><th>말</th><th style="text-align:right;width:82px">재구매 차이</th><th style="text-align:right;width:54px">z</th><th style="text-align:right;width:64px">n</th><th style="text-align:right;width:106px">제품 일치</th></tr>' +
    D.lift.filter(function (r) { return r.n >= 150 && Math.abs(r.z) >= 2; }).map(function (r) {
      return '<tr><td><b>' + lk(r.lab, 'kr', esc(r.lab)) + '</b></td><td class="n ' + (r.lift >= 0 ? 'pos' : 'neg') + '">' + sg(r.lift) + 'pp</td>' +
        '<td class="n">' + r.z + '</td><td class="n">' + n(r.n) + '</td><td class="n">' + (r.nProd > 1 ? r.nProd + '종 중 ' + Math.round(r.nProd * r.agree / 100) + '종' : '1종') + '</td></tr>'; }).join('') +
    '</table><div class="evpane" style="display:none"></div>' +
    '<p>같은 패드가 두 이름으로 불린다. <b>「구성」이면 ' + sg(LF('세트·기획이라서 샀다').lift) + 'pp, 「증정·사은품」이면 ' + sg(LF('증정·사은품 취급').lift) + 'pp</b>다. 후보 1의 전부다. 가장 강한 음수는 「효과를 모르겠다」(z=' + LF('효과를 모르겠다').z + ')인데 상세·광고 어디에도 답이 없다 — 후보 4.</p></div>');

  // ── 진단 9: 번들 자연실험
  E.push('<div class="panel"><div class="ph"><h3>진단 9 · 묶어 팔면 더 정착하는가' +
    ib('리쥬란 한 리스팅 안에 세트·패드단품·앰플단품이 동시에 팔린다. 같은 브랜드·같은 페이지·같은 기간이라 제품과 시기는 통제된다. 다만 옵션 선택이 무작위 배정은 아니다(선택 편향).') +
    '</h3><div class="hint">구매 형태를 누르면 그 그룹의 리뷰 전문이 열린다</div></div>' +
    '<table class="auto"><tr><th>구매 형태</th><th style="text-align:right;width:64px">n</th><th style="text-align:right;width:64px">평점</th><th style="text-align:right;width:90px">리피트 언어</th><th style="text-align:right;width:84px">둘 다 언급</th><th style="text-align:right;width:90px">효과 모르겠다</th></tr>' +
    D.experiment.filter(function (e) { return e.k !== 'unknown'; }).map(function (e) {
      var nm = { set:'세트 (앰플+패드)', padOnly:'패드 단품', ampOnly:'앰플 단품' }[e.k];
      var key = { set:'세트', padOnly:'패드 단품', ampOnly:'앰플 단품' }[e.k];
      return '<tr><td><b><a class="evex" data-k="' + key + '">' + nm + '</a></b></td><td class="n">' + n(e.n) + '</td><td class="n">' + e.avg + '</td>' +
        '<td class="n' + (e.k === 'padOnly' ? ' pos' : '') + '">' + p2(e.rep) + '</td><td class="n">' + p2(e.both) + '</td><td class="n">' + p2(e.noeff) + '</td></tr>'; }).join('') +
    '</table><div class="evpane" id="evp-exp2" style="display:none"></div>' +
    '<p>세트 구매자가 더 만족하지도(4.75 대 4.68), 더 정착하지도(' + p2(D.experiment[0].rep) + ' 대 ' + p2(D.experiment[1].rep) + ') 않는다. 오히려 <b>패드만 산 사람의 리피트 언어가 가장 많다</b>. 세트는 첫 구매 장벽을 낮추는 장치지 정착 장치가 아니다 — 후보 2.</p></div>');

  // ── 발
  E.push('<div class="foot">' +
    '<b>대상</b> 세럼(앰플·에센스)과 토너패드가 <b>한 SKU로 함께 오는</b> 리스팅만. 같은 브랜드가 패드를 따로 판다는 사실은 기준이 아니다. ' +
    '한국 = 올리브영 기획 ' + D.corpus.krProducts + '종 (' + D.corpus.krNames.join(' · ') + '). 일본 = 큐텐 세트 ' + D.corpus.jpProducts + '종 (' + D.corpus.jpNames.join(' · ') + ').<br>' +
    '<b>코퍼스</b> 리뷰 ' + n(D.corpus.krReviews) + ' + ' + n(D.corpus.jpReviews) + '건 · 한국 상세페이지 ' + n(D.corpus.krDetail) + '장(OCR) · 한국 메타 광고 ' + n(D.corpus.krAds) + '건. 스냅샷 ' + D.collected + '. 인용문은 전부 원문 문자열 대조로 검증했다(생성 없음).<br>' +
    '<b>원자료</b> 표의 비율, 격자의 칸, 리프트의 말, 구매 형태를 눌러 매치 전문을 연다(처음 누를 때 그 묶음만 내려받는다). 일본어 리뷰는 <b>원문 그대로</b> 싣는다 — 무료 기계번역이 부정형을 뒤집는 오류(「べたつかず」를 「끈적끈적」으로)를 내서 붙이지 않았다. 카드 인용문은 사람이 옮겼다.<br>' +
    '<b>단위</b> 이 문서는 「제품 컨셉」이 아니라 <b>「두 물건을 한 SKU로 산 사람의 행동」</b>을 잰다. 그래서 컨셉을 제품별로 authoring 하지 않고 양국 공용 프로브 27개로만 쟀다. 시장 간 절대율은 비교하지 않고 같은 시장 안의 순위·배수, 같은 조합의 통제쌍, 같은 리스팅 안의 비교로만 읽는다.<br>' +
    '<b>한계</b> 한국 리뷰는 층화 표본이다 (' + n(D.corpus.krReviews) + ' / ' + n(D.corpus.krSite) + '건 = ' + (D.corpus.krReviews / D.corpus.krSite * 100).toFixed(1) + '%). 올리브영이 스트림당 500건에서 끊어서 피부타입 × 피부톤 42셀 · 정렬 5축 · 리뷰유형 4축으로 나눠 모았다. 메디큐브만 41.9%고 나머지 4종은 62.8~80.5%다. ' +
    '일본 상세페이지와 일본 광고는 수집하지 않았다(한국은 둘 다 수집). 재구매 리프트는 관찰 상관이지 실험이 아니다.<br>' +
    '<b>수집</b> 전부 공개 페이지에서 속도 제한을 지켜 수집. 작성자 식별정보는 수집하지 않았다.' +
    '</div>');

  document.getElementById('app').innerHTML = E.join('');
})();
