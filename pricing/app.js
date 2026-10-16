// app.js · DOMO pricing monitor dashboard. The page runs boot(); check.mjs loads the math in Node.
// The suggestion logic is expected to change: these constants are the knobs.
const OURS = { pads: 70, ml: 200 }
const BAND = [0.10, 0.20] // suggested range = cheapest 10-20% of similar products
const SIZE_SPREAD = 0.2 // similar size = 70 ± 20% = 56-84 pads
const MIN_PEERS = 10
const MEGAWARI = 0.8 // Qoo10 メガ割 takes about 20% off
const PADS = [Math.round(OURS.pads * (1 - SIZE_SPREAD)), Math.round(OURS.pads * (1 + SIZE_SPREAD))]

const n = v => (v === '' || v == null ? null : Number(v))
const round10 = x => Math.round(x / 10) * 10

function parseTsv(text) {
  const [head, ...lines] = text.trim().split('\n')
  const cols = head.split('\t')
  return lines.filter(Boolean).map(line => {
    const v = line.split('\t')
    const row = {}
    cols.forEach((c, i) => { row[c] = v[i] ?? '' })
    return row
  })
}

// What the shopper pays. Amazon coupons need clipping, so they are shown but not subtracted.
function effective(r) {
  const price = n(r.price)
  if (price == null) return null
  return r.site === 'a' ? price - (n(r.points) || 0) + (n(r.shipping) || 0) : price + (n(r.shipping) || 0)
}

function quantile(sorted, q) { // linear interpolation, index = (n - 1) * q
  const i = (sorted.length - 1) * q
  const lo = Math.floor(i)
  return sorted[lo] + (i - lo) * ((sorted[lo + 1] ?? sorted[lo]) - sorted[lo])
}

// rows: one site, one day. products: Map asin -> {pads, ml}. unit: 'pad' or 'ml'.
function suggest(rows, products, unit = 'pad') {
  const per = []
  for (const r of rows) {
    const p = products.get(r.asin) || {}
    const pads = n(p.pads)
    const e = effective(r)
    if (r.status !== 'ok' || e == null || pads == null || pads < PADS[0] || pads > PADS[1]) continue
    if (unit === 'pad') per.push(e / pads)
    else if (n(p.ml)) per.push((e / n(p.ml)) * 100)
  }
  per.sort((a, b) => a - b)
  if (per.length < MIN_PEERS) return { n: per.length }
  const k = unit === 'pad' ? OURS.pads : OURS.ml / 100
  return { n: per.length, lo: round10(quantile(per, BAND[0]) * k), hi: round10(quantile(per, BAND[1]) * k), per }
}

const megawari = q => (q.lo == null ? null : { lo: round10(q.lo * MEGAWARI), hi: round10(q.hi * MEGAWARI) })
// Estimate: Amazon may hide our buy button when our Amazon price is above our Qoo10 Megawari price.
const buyButtonRisk = (a, q) => { const m = megawari(q); return !!(m && a.lo != null && a.lo > m.hi) }

function moves(prevRows, curRows) {
  const before = new Map(prevRows.map(r => [`${r.site}|${r.asin}`, effective(r)]))
  return curRows
    .map(r => ({ site: r.site, asin: r.asin, from: before.get(`${r.site}|${r.asin}`), to: effective(r) }))
    .filter(m => m.from != null && m.to != null && m.to !== m.from)
    .map(m => ({ ...m, pct: (m.to - m.from) / m.from }))
    .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))
}

// ---- page (browser only)
const SITES = [['q', 'Qoo10'], ['a', 'Amazon']]
const STATUS_KO = { ok: '정상', oos: '품절', opt_base: '옵션 상품(제외)', parse: '읽기 실패', blocked: '차단 감지', skipped: '건너뜀' }
const statusKo = s => STATUS_KO[s] || (s.startsWith('http_') ? `HTTP 오류 ${s.slice(5)}` : s)
const esc = s => String(s ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch])
const fmt = v => (v == null ? '' : `¥${Math.round(v).toLocaleString('ja-JP')}`)
const $ = id => document.getElementById(id)

async function boot() {
  const get = async f => {
    try { const res = await fetch(f); return res.ok ? parseTsv(await res.text()) : [] } catch { return [] }
  }
  const [list, history] = await Promise.all([get('products.tsv'), get('history.tsv')])
  const products = new Map(list.map(p => [p.asin, { ...p, ml: '' }]))
  // mL is read on Amazon pages; the same product's Qoo10 listing uses it too
  for (const r of history) if (r.site === 'a' && r.ml && products.has(r.asin)) products.get(r.asin).ml = r.ml
  render(products, history)
}

function render(products, history) {
  const runs = { q: new Map(), a: new Map() } // site -> date -> rows
  for (const r of history) {
    const m = runs[r.site]
    if (!m) continue
    if (!m.has(r.date)) m.set(r.date, [])
    m.get(r.date).push(r)
  }
  const dates = s => [...runs[s].keys()].sort()
  const day = (s, i) => dates(s).at(i) // -1 latest run, -2 the one before
  const rowsOn = (s, d) => runs[s].get(d) || []
  const today = { q: rowsOn('q', day('q', -1)), a: rowsOn('a', day('a', -1)) }
  const sug = { q: suggest(today.q, products), a: suggest(today.a, products) }
  const label = asin => { const p = products.get(asin) || {}; return `${esc(p.brand)} ${esc(p.name_ko)}` }

  $('updated').textContent = history.length
    ? `마지막 수집 · Qoo10 ${day('q', -1) || '없음'} · Amazon ${day('a', -1) || '없음'}`
    : '아직 수집된 데이터가 없습니다. /prices를 실행하면 채워집니다.'

  $('range-cards').innerHTML = SITES.map(([s, name]) => {
    const g = sug[s]
    const v = suggest(today[s], products, 'ml')
    const main = g.lo == null
      ? `<div class="big muted">데이터 부족</div><p>가격을 읽은 비슷한 크기 제품이 ${g.n}개뿐입니다. 최소 ${MIN_PEERS}개가 필요합니다.</p>`
      : `<div class="big">${fmt(g.lo)} – ${fmt(g.hi)}</div><p>비슷한 크기(${PADS[0]}~${PADS[1]}매) 제품 ${g.n}개 중 매당 실구매가가 가장 저렴한 10~20% 구간 × ${OURS.pads}매</p>`
    const vol = v.lo == null
      ? `<p class="sub">용량 기준 참고: 데이터 부족 (mL 표기 제품 ${v.n}개)</p>`
      : `<p class="sub">용량 기준 참고: ${fmt(v.lo)} – ${fmt(v.hi)} (100mL당 가격 × ${OURS.ml}mL, ${v.n}개)</p>`
    let extra = ''
    if (s === 'q' && g.lo != null) {
      const m = megawari(g)
      extra = `<p class="sub">메가와리(メガ割, 큐텐 대형 할인 행사) 20% 할인 시 예상가 ${fmt(m.lo)} – ${fmt(m.hi)}</p>`
    }
    if (s === 'a' && buyButtonRisk(g, sug.q)) {
      extra = '<p class="warn">주의(추정): 아마존 추천 가격대가 큐텐 메가와리 예상가보다 높습니다. 아마존이 추천 판매 버튼(おすすめ出品)을 숨길 수 있습니다.</p>'
    }
    return `<div class="card"><span class="tag ${s}">${name}</span>${main}${vol}${extra}</div>`
  }).join('')

  $('trend-body').innerHTML = SITES.map(([s, name]) => {
    const pts = dates(s).slice(-30).map(d => ({ d, g: suggest(rowsOn(s, d), products) })).filter(p => p.g.lo != null)
    if (!pts.length) return `<p class="sub"><span class="tag ${s}">${name}</span> 아직 계산된 추천 가격대가 없습니다.</p>`
    const min = Math.min(...pts.map(p => p.g.lo))
    const span = Math.max(Math.max(...pts.map(p => p.g.hi)) - min, 1)
    return `<h3><span class="tag ${s}">${name}</span></h3><div class="trend">${pts.map(p => `<div class="trow">
      <span class="mono">${p.d.slice(5)}</span>
      <span class="track"><span class="bar" style="left:${((p.g.lo - min) / span) * 100}%;width:${Math.max(((p.g.hi - p.g.lo) / span) * 100, 1)}%"></span></span>
      <span class="mono">${fmt(p.g.lo)} – ${fmt(p.g.hi)}</span></div>`).join('')}</div>`
  }).join('')

  $('market-body').innerHTML = SITES.map(([s, name]) => {
    const g = sug[s]
    if (!g.per) return `<p class="sub"><span class="tag ${s}">${name}</span> 데이터 부족</p>`
    const [L, R] = [24, 616]
    const min = g.per[0]
    const max = g.per[g.per.length - 1]
    const x = v => L + ((v - min) / Math.max(max - min, 1e-9)) * (R - L)
    const b0 = x(quantile(g.per, BAND[0]))
    const b1 = x(quantile(g.per, BAND[1]))
    return `<h3><span class="tag ${s}">${name}</span> <span class="sub">비슷한 크기 제품 ${g.n}개의 매당 실구매가</span></h3>
      <div class="chart"><svg viewBox="0 0 640 96" role="img" aria-label="${name} 비슷한 크기 제품 ${g.n}개의 매당 가격 분포와 추천 구간">
      <rect class="band" x="${b0.toFixed(1)}" y="14" width="${Math.max(b1 - b0, 2).toFixed(1)}" height="44" rx="4"/>
      <text class="lbl" x="${((b0 + b1) / 2).toFixed(1)}" y="10">추천 구간</text>
      <line class="axis" x1="${L}" y1="36" x2="${R}" y2="36"/>
      ${g.per.map(v => `<circle class="dot" cx="${x(v).toFixed(1)}" cy="36" r="5"/>`).join('')}
      <text x="${L}" y="84">${fmt(min)}/매</text><text class="end" x="${R}" y="84">${fmt(max)}/매</text>
      </svg></div>`
  }).join('')

  $('moves-body').innerHTML = SITES.map(([s, name]) => {
    const prev = day(s, -2)
    if (!prev) return `<p class="sub"><span class="tag ${s}">${name}</span> 비교할 이전 수집이 아직 없습니다.</p>`
    const list = moves(rowsOn(s, prev), today[s]).slice(0, 10)
    if (!list.length) return `<p class="sub"><span class="tag ${s}">${name}</span> ${prev} 대비 바뀐 가격이 없습니다.</p>`
    return `<h3><span class="tag ${s}">${name}</span> <span class="sub">${prev} 대비</span></h3><ul class="moves">${list.map(m => `<li>
      <span>${label(m.asin)}</span><span class="mono">${fmt(m.from)} → ${fmt(m.to)}</span>
      <span class="mono ${m.pct < 0 ? 'down' : 'up'}">${m.pct > 0 ? '+' : ''}${(m.pct * 100).toFixed(1)}%</span></li>`).join('')}</ul>`
  }).join('')

  const latest = s => new Map(today[s].map(r => [r.asin, r]))
  const lq = latest('q')
  const la = latest('a')
  const perPad = (r, p) => { const e = r ? effective(r) : null; return e != null && n(p.pads) ? e / n(p.pads) : null }
  const chip = r => (r && r.status !== 'ok' ? ` <span class="chip">${esc(statusKo(r.status))}</span>` : '')
  $('table-body').innerHTML = `<table><thead><tr><th>브랜드</th><th>제품</th><th>매수</th><th>mL</th><th>Qoo10 실구매가</th>
    <th>Qoo10 매당</th><th>Amazon 실구매가</th><th>Amazon 매당</th><th>차이</th></tr></thead><tbody>${[...products.values()].map(p => {
    const q = lq.get(p.asin)
    const a = la.get(p.asin)
    const eq = q ? effective(q) : null
    const ea = a ? effective(a) : null
    const gap = eq != null && ea != null ? ((ea - eq) / eq) * 100 : null
    const prime = a && a.prime_only === '1' ? ' <span class="chip">프라임 한정</span>' : ''
    const hay = `${p.brand} ${p.brand_en} ${p.name_ko} ${p.name_jp}`.toLowerCase()
    return `<tr data-asin="${esc(p.asin)}" data-hay="${esc(hay)}" tabindex="0">
      <td>${esc(p.brand)}</td><td>${esc(p.name_ko)}</td><td class="n">${esc(p.pads)}</td><td class="n">${esc(p.ml)}</td>
      <td class="n">${fmt(eq)}${chip(q)}</td><td class="n">${fmt(perPad(q, p))}</td>
      <td class="n">${fmt(ea)}${prime}${chip(a)}</td><td class="n">${fmt(perPad(a, p))}</td>
      <td class="n">${gap == null ? '' : `${gap > 0 ? '+' : ''}${gap.toFixed(0)}%`}</td></tr>`
  }).join('')}</tbody></table>`

  $('filter').oninput = e => {
    const want = e.target.value.trim().toLowerCase()
    for (const tr of $('table-body').querySelectorAll('tr.hist')) tr.remove()
    for (const tr of $('table-body').querySelectorAll('tr[data-hay]')) tr.hidden = !!want && !tr.dataset.hay.includes(want)
  }
  $('table-body').onclick = e => {
    const tr = e.target.closest('tr[data-asin]')
    if (!tr) return
    const open = tr.nextElementSibling
    if (open && open.classList.contains('hist')) { open.remove(); return }
    const ds = [...new Set([...dates('q'), ...dates('a')])].sort().slice(-30).reverse()
    const cell = (s, d) => {
      const r = rowsOn(s, d).find(x => x.asin === tr.dataset.asin)
      return !r ? '' : r.price ? fmt(effective(r)) : statusKo(r.status)
    }
    tr.insertAdjacentHTML('afterend', `<tr class="hist"><td colspan="9">${ds.length ? `<table class="mini"><thead><tr><th>날짜</th>
      <th>Qoo10</th><th>Amazon</th></tr></thead><tbody>${ds.map(d => `<tr><td class="mono">${d}</td><td class="n">${esc(cell('q', d))}</td>
      <td class="n">${esc(cell('a', d))}</td></tr>`).join('')}</tbody></table>` : '아직 기록이 없습니다.'}</td></tr>`)
  }
  $('table-body').onkeydown = e => { if (e.key === 'Enter' && e.target.matches('tr[data-asin]')) e.target.click() }

  $('status-body').innerHTML = SITES.map(([s, name]) => {
    const d = day(s, -1)
    if (!d) return ''
    const counts = {}
    for (const r of today[s]) counts[r.status] = (counts[r.status] || 0) + 1
    return `<p><span class="tag ${s}">${name}</span> ${d} · ${Object.entries(counts).map(([k, v]) => `${esc(statusKo(k))} ${v}`).join(' · ')}</p>`
  }).join('')
}

if (typeof window === 'object') boot()
else module.exports = { OURS, BAND, PADS, parseTsv, effective, quantile, suggest, megawari, buyButtonRisk, moves }
