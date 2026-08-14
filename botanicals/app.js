/* 쿨링·진정 식물 원료 전수 조사 — 렌더러. 데이터는 data.js(window.ING). */
(function () {
  var D = window.ING, R = D.rows;
  var $ = function (h) { var d = document.createElement('div'); d.innerHTML = h; return d; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

  // ── 기전 문자열 → 클래스
  var MC = [
    ['TRPM8', /TRPM8/i], ['TRPV1 길항·탈감작', /TRPV1/i], ['TRPA1', /TRPA1/i], ['기타 TRP', /TRPV3|TRPV4|TRPM|TRP채널|TRP 채널/i],
    ['NF-κB 억제', /NF-?κB|NF-?kB|NFkB/i], ['COX·프로스타글란딘', /COX|프로스타글란딘|PGE/i], ['LOX·류코트리엔', /LOX|류코트리엔|리폭시/i],
    ['PDE 억제', /PDE/i], ['칸나비노이드(CB)', /CB1|CB2|칸나비노이드|카나비노이드/i], ['항히스타민·비만세포', /히스타민|비만세포|mast|MRGPRX2|탈과립/i],
    ['MAPK·사이토카인', /MAPK|JNK|ERK|사이토카인|TNF|IL-?[0-9]/i], ['장벽·보습', /장벽|세라마이드|필라그린|보습|수분/i],
    ['수렴(탄닌)', /수렴|탄닌|타닌/i], ['점액·다당 피막', /점액|다당|뮤실|겔|피막/i], ['항산화', /항산화|ROS|Nrf2|활성산소/i],
    ['물리적 냉각', /증발|물리적|수분 냉각|냉습포/i],
  ];
  function mclass(r) {
    var out = [], seen = {};
    (r.mechanism || []).forEach(function (m) {
      var hit = null;
      for (var i = 0; i < MC.length; i++) if (MC[i][1].test(m)) { hit = MC[i][0]; break; }
      hit = hit || '기타 항염';
      if (!seen[hit]) { seen[hit] = 1; out.push(hit); }
    });
    return out.length ? out : ['기타 항염'];
  }
  var SAFE = /감작|알레르|광독성|광과민|알칼로이드|독성|자극 가능|규제|금지|온성|임부|주의/;
  R.forEach(function (r) { r._mc = mclass(r); r._warn = SAFE.test(r.note || ''); });

  var EVN = { clinical: '임상', animal: '동물', invitro: 'in vitro', traditional: '전통' };
  var EVC = { clinical: 'ev3', animal: 'ev2', invitro: 'ev1', traditional: 'ev0' };
  var CON = { common: '통용', rare: '희소', none: '미적용', unknown: '?' };
  var AXN = { cooling: '쿨링', soothing: '진정', both: '겸용' };
  var FRN = { trpm8: '약리·냉감', tcm: '중의 청열약', ayurveda: '아유르베다', cosing: '화장품 현역', ethno_am_af: '아메리카·아프리카', ethno_asia_eu: '아시아·유럽 민간', marine_novel: '해조·신소재', foodflavor: '식품·향료', mech_soothing: '기전 역추적' };

  function refLink(x) {
    if (!x) return '';
    var id = String(x.id || ''), href = null, m;
    if ((m = id.match(/PMID[:\s]*(\d+)/i))) href = 'https://pubmed.ncbi.nlm.nih.gov/' + m[1] + '/';
    else if ((m = id.match(/(10\.\d{4,}[^\s"']+)/))) href = 'https://doi.org/' + m[1];
    var label = esc((x.src || '') + (x.year ? ' ' + x.year : ''));
    return href ? '<a href="' + href + '" target="_blank" rel="noopener" title="' + esc(x.title || '') + '">' + label + '</a>'
                : '<span title="' + esc(x.title || '') + '">' + label + '</span>';
  }
  function chipAx(a) { return '<span class="chip ' + (a === 'cooling' ? 'cool' : a === 'both' ? 'both' : 'soothe') + '">' + AXN[a] + '</span>'; }
  function chipEv(e) { return '<span class="chip ' + EVC[e] + '">' + (EVN[e] || e) + '</span>'; }
  function chipCo(c) { return c === 'none' ? '<span class="chip none">미적용</span>' : '<span style="color:var(--subtle);font-size:11px">' + (CON[c] || c) + '</span>'; }
  function nm(r) { return r.ko || r.en || r.latin; }

  var app = document.getElementById('app');
  function cnt(f) { var m = {}; R.forEach(function (r) { var v = f(r); m[v] = (m[v] || 0) + 1; }); return m; }
  var ax = cnt(function (r) { return r.axis; }), ev = cnt(function (r) { return r.evidence; }), co = cnt(function (r) { return r.cosmetic; });
  var nref = R.filter(function (r) { return r.refs && r.refs.length; }).length;

  // ── 상단
  app.appendChild($(
    '<div class="top"><div>' +
    '<div class="kick">Botanical census · cooling &amp; soothing</div>' +
    '<h1>쿨링·진정 식물 원료 전수 조사</h1>' +
    '<div class="sub">피부에 쿨링(냉감) 또는 진정(항염·항자극) 효능이 논문이나 성문화된 전통의학에 기록된 식물을, 닫힌 조사 프레임 9개로 훑어 한 표에 모았다. 화장품에 아직 안 쓰인 재료가 목적이라 사용 이력은 조건이 아니다.</div>' +
    '</div><div class="topmeta">' +
    '<span><b class="mono">' + R.length + '</b>종</span>' +
    '<span>논문 보유 <b class="mono">' + nref + '</b></span>' +
    '<span>임상 근거 <b class="mono">' + (ev.clinical || 0) + '</b></span>' +
    '<span>화장품 미적용 <b class="mono">' + (co.none || 0) + '</b></span>' +
    '<span>' + D.built + '</span></div></div>').firstChild);

  // ── 기준·방법
  var frames = Object.keys(D.frames).map(function (k) { return (FRN[k] || k) + ' <b class="mono">' + D.frames[k] + '</b>'; }).join(' · ');
  app.appendChild($(
    '<div class="panel"><div class="ph"><h3>행의 기준과 조사 방법</h3><div class="hint">전수의 정의: 열거 가능한 프레임 9개 안에서의 전수. 프레임 밖(모든 항염 논문의 모든 식물)은 무한하다.</div></div>' +
    '<p><b>행 = 식물 종 1개.</b> 피부 쿨링 또는 진정 효능이 (1) 학술 문헌 또는 (2) 성문화된 전통 체계(중의 공정서·아유르베다 고전·기록된 민간요법)에 있는 것. 조류·균류는 광의로 포함하고 note에 표기.</p>' +
    '<p><b>프레임 9</b> (원시 ' + D.raw + '행 → 학명 병합 ' + R.length + '종): ' + frames + '</p>' +
    '<p><b>근거 등급</b>은 그 종의 가장 강한 근거 하나: 임상(사람) &gt; 동물 &gt; in vitro &gt; 전통 기록. <b>사용 현황</b>: 통용(대중 제품 다수) · 희소(니치 소수) · 미적용(INCI 등재 없음 또는 상용 전례 없음).</p>' +
    '<p><b>검증</b>: 학명은 GBIF, 인용은 EuropePMC·PubMed로 실재·제목·초록을 대조했다. ' + D.verify.line + '</p></div>').firstChild);

  // ── 지형
  function bar(m, order, colors) {
    var t = 0; order.forEach(function (k) { t += m[k] || 0; });
    var seg = order.map(function (k, i) { return '<div style="width:' + (100 * (m[k] || 0) / t) + '%;background:' + colors[i] + '"></div>'; }).join('');
    return '<div class="bar">' + seg + '</div>';
  }
  var mcCnt = {};
  R.forEach(function (r) { r._mc.forEach(function (c) { mcCnt[c] = (mcCnt[c] || 0) + 1; }); });
  var mcTop = Object.keys(mcCnt).sort(function (a, b) { return mcCnt[b] - mcCnt[a]; });
  app.appendChild($(
    '<div class="panel"><div class="ph"><h3>지형</h3><div class="hint">기전은 자유 서술을 키워드로 묶은 것이라 한 종이 여러 클래스에 든다.</div></div>' +
    '<div class="two"><div>' +
    '<p style="margin-top:0"><b>축</b> · 쿨링 ' + (ax.cooling || 0) + ' / 겸용 ' + (ax.both || 0) + ' / 진정 ' + (ax.soothing || 0) + '</p>' +
    bar(ax, ['cooling', 'both', 'soothing'], ['#0e7490', '#7aa7b6', '#c2410c']) +
    '<div class="legend"><span><i style="background:#0e7490"></i>쿨링</span><span><i style="background:#7aa7b6"></i>겸용</span><span><i style="background:#c2410c"></i>진정</span></div>' +
    '</div><div>' +
    '<p style="margin-top:0"><b>근거</b> · 임상 ' + (ev.clinical || 0) + ' / 동물 ' + (ev.animal || 0) + ' / in vitro ' + (ev.invitro || 0) + ' / 전통 ' + (ev.traditional || 0) + '</p>' +
    bar(ev, ['clinical', 'animal', 'invitro', 'traditional'], ['#16a34a', '#8a8a8a', '#c9c9c9', '#d9b45c']) +
    '<div class="legend"><span><i style="background:#16a34a"></i>임상</span><span><i style="background:#8a8a8a"></i>동물</span><span><i style="background:#c9c9c9"></i>in vitro</span><span><i style="background:#d9b45c"></i>전통</span></div>' +
    '</div></div>' +
    '<div class="mechs">' + mcTop.map(function (c) { return '<div class="mech"><span>' + esc(c) + '</span><b class="mono">' + mcCnt[c] + '</b></div>'; }).join('') + '</div></div>').firstChild);

  // ── 쿨링 전 목록
  var cools = R.filter(function (r) { return r.axis === 'cooling' || r.axis === 'both'; })
    .sort(function (a, b) {
      var am = a._mc.indexOf('TRPM8') >= 0 ? 0 : 1, bm = b._mc.indexOf('TRPM8') >= 0 ? 0 : 1;
      return am - bm || (b.refs || []).length - (a.refs || []).length;
    });
  app.appendChild($(
    '<div class="panel"><div class="ph"><h3>쿨링 축 전체 ' + cools.length + '종</h3>' +
    '<div class="hint">쿨링 수요는 한국 쪽이다(인접 미스트 조사 기준 리뷰 언급 한국 3.7% 대 일본 0.3%). TRPM8(냉감 수용체) 작동이 앞, 나머지 냉감·겸용이 뒤.</div></div>' +
    '<div class="tscroll"><table><thead><tr><th>이름</th><th>축</th><th>냉감·기전</th><th>활성 성분</th><th>근거</th><th>사용</th></tr></thead><tbody>' +
    cools.map(function (r) {
      return '<tr><td><b>' + esc(nm(r)) + '</b><div class="lat">' + esc(r.latin) + '</div></td>' +
        '<td>' + chipAx(r.axis) + '</td>' +
        '<td class="mechcell">' + esc(r._mc.slice(0, 3).join(' · ')) + '</td>' +
        '<td class="acts">' + esc((r.actives || []).slice(0, 3).join(', ')) + '</td>' +
        '<td>' + chipEv(r.evidence) + '</td><td>' + chipCo(r.cosmetic) + '</td></tr>';
    }).join('') + '</tbody></table></div></div>').firstChild);

  // ── 화이트스페이스
  var evRank = { clinical: 3, animal: 2, invitro: 1, traditional: 0 };
  var ws = R.filter(function (r) { return r.cosmetic === 'none'; })
    .sort(function (a, b) { return evRank[b.evidence] - evRank[a.evidence] || (b.refs || []).length - (a.refs || []).length; });
  app.appendChild($(
    '<div class="panel"><div class="ph"><h3>화장품 미적용 ' + ws.length + '종 (화이트스페이스)</h3>' +
    '<div class="hint">INCI 등재나 상용 전례를 못 찾은 종. 근거가 강한 순. 이 ' + ws.length + '종은 인용을 전수 검증했다.</div></div>' +
    '<div class="cards">' + ws.map(function (r) {
      var ref = (r.refs || [])[0];
      return '<div class="cardw"><h4>' + esc(nm(r)) + ' ' + chipAx(r.axis) + ' ' + chipEv(r.evidence) + (r._warn ? ' <span class="warn">⚠</span>' : '') + '</h4>' +
        '<div class="lat">' + esc(r.latin) + (r.family ? ' · ' + esc(r.family) : '') + '</div>' +
        '<div class="row"><b>성분</b> ' + esc((r.actives || []).slice(0, 3).join(', ') || '-') + '</div>' +
        '<div class="row"><b>기전</b> ' + esc((r.mechanism || []).slice(0, 2).join(' · ') || '-') + '</div>' +
        (r.note ? '<div class="row"><b>비고</b> ' + esc(r.note) + '</div>' : '') +
        (ref ? '<div class="ref">' + refLink(ref) + ' · ' + esc(ref.title || '') + '</div>' : '<div class="ref">전통 기록만 (논문 미확인)</div>') +
        '</div>';
    }).join('') + '</div></div>').firstChild);

  // ── 마스터 테이블
  var state = { ax: 'all', ev: 'all', co: 'all', fr: 'all', q: '' };
  function fbtns(key, defs) {
    return '<div class="grp" data-k="' + key + '">' + defs.map(function (d) {
      return '<button data-v="' + d[0] + '" class="' + (state[key] === d[0] ? 'on' : '') + '">' + d[1] + '</button>';
    }).join('') + '</div>';
  }
  var panel = $('<div class="panel"><div class="ph"><h3>마스터 테이블 · 전 ' + R.length + '종</h3><div class="hint">행을 누르면 기전 전체·논문 전체·비고가 펼쳐진다. 다중 프레임 히트가 많은 종부터.</div></div>' +
    '<div class="fbar">' +
    fbtns('ax', [['all', '전체'], ['cooling', '쿨링'], ['both', '겸용'], ['soothing', '진정']]) +
    fbtns('ev', [['all', '근거 전체'], ['clinical', '임상'], ['animal', '동물'], ['invitro', 'in vitro'], ['traditional', '전통']]) +
    fbtns('co', [['all', '사용 전체'], ['common', '통용'], ['rare', '희소'], ['none', '미적용']]) +
    '<input id="q" placeholder="이름·학명·성분·기전 검색">' +
    '<span class="fcount" id="fc"></span></div>' +
    '<div class="tscroll"><table><thead><tr><th>이름</th><th>축</th><th>기전</th><th>활성 성분</th><th>근거</th><th>논문</th><th>사용</th><th>프레임</th></tr></thead><tbody id="tb"></tbody></table></div></div>').firstChild;
  app.appendChild(panel);

  var tb = panel.querySelector('#tb'), fc = panel.querySelector('#fc');
  function pass(r) {
    if (state.ax !== 'all' && r.axis !== state.ax) return false;
    if (state.ev !== 'all' && r.evidence !== state.ev) return false;
    if (state.co !== 'all' && r.cosmetic !== state.co) return false;
    if (state.q) {
      var h = (nm(r) + ' ' + r.latin + ' ' + (r.en || '') + ' ' + (r.actives || []).join(' ') + ' ' + (r.mechanism || []).join(' ') + ' ' + r._mc.join(' ')).toLowerCase();
      if (h.indexOf(state.q) < 0) return false;
    }
    return true;
  }
  function render() {
    var rows = R.filter(pass);
    fc.textContent = rows.length + '종';
    tb.innerHTML = rows.map(function (r, i) {
      return '<tr class="r" data-i="' + R.indexOf(r) + '"><td><b>' + esc(nm(r)) + '</b>' + (r._warn ? ' <span class="warn">⚠</span>' : '') + '<div class="lat">' + esc(r.latin) + '</div></td>' +
        '<td>' + chipAx(r.axis) + '</td>' +
        '<td class="mechcell">' + esc(r._mc.slice(0, 2).join(' · ')) + '</td>' +
        '<td class="acts">' + esc((r.actives || []).slice(0, 2).join(', ')) + '</td>' +
        '<td>' + chipEv(r.evidence) + '</td>' +
        '<td class="mono" style="font-size:11px;color:var(--subtle)">' + ((r.refs || []).length || '') + '</td>' +
        '<td>' + chipCo(r.cosmetic) + '</td>' +
        '<td style="font-size:10.5px;color:var(--subtle)">' + r.frames.map(function (f) { return FRN[f] || f; }).join(', ') + '</td></tr>';
    }).join('');
  }
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('.grp button');
    if (b) {
      var k = b.parentNode.getAttribute('data-k');
      state[k] = b.getAttribute('data-v');
      b.parentNode.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      render(); return;
    }
    var tr = e.target.closest('tr.r');
    if (tr) {
      var nx = tr.nextElementSibling;
      if (nx && nx.classList.contains('detail')) { nx.remove(); return; }
      var r = R[+tr.getAttribute('data-i')];
      var d = document.createElement('tr'); d.className = 'detail';
      d.innerHTML = '<td colspan="8">' +
        '<div class="drow"><b>' + esc(nm(r)) + '</b> <span class="lat">' + esc(r.latin) + '</span>' + (r.en ? ' · ' + esc(r.en) : '') + (r.part ? ' · 부위: ' + esc(r.part) : '') + (r.origin ? ' · ' + esc(r.origin) : '') + '</div>' +
        '<div class="drow"><b>기전</b> ' + esc((r.mechanism || []).join(' · ') || '-') + '</div>' +
        '<div class="drow"><b>성분</b> ' + esc((r.actives || []).join(', ') || '-') + (r.inci ? ' · <b>INCI</b> ' + esc(r.inci) : '') + '</div>' +
        (r.note ? '<div class="drow"><b>비고</b> ' + esc(r.note) + '</div>' : '') +
        ((r.refs || []).length ? '<div class="drow"><b>논문</b> ' + r.refs.map(function (x) { return refLink(x) + ' <span style="color:var(--subtle)">' + esc(x.title || '') + '</span>'; }).join('<br>') + '</div>' : '') +
        '</td>';
      tr.after(d);
    }
  });
  panel.querySelector('#q').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });
  render();

  // ── 각주
  app.appendChild($(
    '<div class="foot">' +
    '<b>한계.</b> 전수는 프레임 9개 안에서의 전수다. 프레임이 못 덮는 곳(예: 특정 지역의 미기록 구전 요법, 최신 학위논문)은 누락될 수 있다. 근거 등급은 찾은 문헌 기준이라 실제보다 낮게 매겨진 종이 있을 수 있고, in vitro 항염이 바른 제형에서의 체감 진정으로 이어진다는 보장은 없다. ⚠ 표시는 비고에 감작·광독성·알칼로이드·규제 등 주의 단어가 있는 종.<br>' +
    '<b>검증.</b> ' + D.verify.foot + '<br>' +
    '<b>맥락.</b> 토너패드 원료 선정용 후보 풀이다. 축 둘은 인접 조사에서 확인된 사실에 기댄다: 「진정」은 K뷰티가 일본에 들여온 카테고리 기본어고(토너패드 재료 조사: 鎮静은 일본 브랜드 페이지 0~4%, 한국 브랜드 페이지 최대 41%), 쿨링 언급은 한국 리뷰 3.7% 대 일본 0.3%로 한국 쪽 수요다(미스트 조사). 비고의 제형 코멘트는 패드(침적액·원단·leave-on) 기준으로 적었다.' +
    '</div>').firstChild);
})();
