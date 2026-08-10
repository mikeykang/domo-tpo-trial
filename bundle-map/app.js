/* 컨셉 리포트 뷰 — 세럼 + 패드를 한 SKU로 함께 파는 5종.
   왼쪽 = 브랜드가 상세페이지 + Meta 광고에서 내세우는 컨셉.
   오른쪽 = 고객이 리뷰 + UGC에서 실제로 주장하는 컨셉.
   동봉판에서만 추가로 재는 축: 「패드」를 누가 말하는가 — 브랜드의 상세 대 고객의 리뷰. */
(function(){
  var P=window.P, CON=window.CON, ADS=window.ADS, UGC=window.UGC, DETAIL=window.DETAIL;
  var W=document.getElementById('wrap');
  var byslug={}; P.forEach(function(p){byslug[p.slug]=p});
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var E=function(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e};
  var fmt=function(n){return (n||0).toLocaleString('ko-KR')};

  var T={rev:0,det:0,ads:0,ugc:0,site:0,nb:0,nu:0};
  P.forEach(function(p){T.rev+=p.revN;T.det+=p.detailImgs;T.ads+=p.adN;T.ugc+=p.ugcN;T.site+=p.siteTotal;T.nb+=p.nBrand;T.nu+=p.nUser});

  var SRC={detail:['상세','sd'],ad:['광고','sa'],both:['상세+광고','sb'],review:['리뷰','sr'],ugc:['UGC','su']};
  var badge=function(k){var x=SRC[k]||['','']; return '<span class="src '+x[1]+'">'+x[0]+'</span>'};
  var bar=function(v,cls){return '<span class="tk"><i class="'+cls+'" style="width:'+Math.max(v>0?4:0,Math.min(100,v/40*100))+'%"></i></span>'};

  /* ---------- top ---------- */
  W.appendChild(E('div','top',
    '<div><div class="kick">DOMO · CONCEPT MAP · KR SERUM + PAD BUNDLE</div>'+
    '<h1>브랜드가 내세우는 컨셉과 고객이 주장하는 컨셉 · 세럼과 패드를 함께 파는 5종</h1>'+
    '<div class="sub">올리브영에서 세럼 본품과 토너패드가 <b>한 SKU로 함께 오는</b> 기획 상품만 골랐습니다. 왼쪽은 상세페이지 + Meta 광고에 실제로 적힌 문장, 오른쪽은 리뷰 + UGC에서 고객이 실제로 쓰는 말입니다.</div></div>'+
    '<div class="topmeta"><span>수집 <b class="mono">'+esc(window.COLLECTED)+'</b></span><span>작성 <b>Mikey</b></span></div>'));

  W.appendChild(E('div','row',
    '<div class="tile hero"><div class="k">브랜드 컨셉</div><div class="v">'+T.nb+'</div><div class="s">상세 '+fmt(T.det)+'장 + 광고 '+fmt(T.ads)+'건에서 추출</div></div>'+
    '<div class="tile hero2"><div class="k">고객 컨셉</div><div class="v">'+T.nu+'</div><div class="s">리뷰 '+fmt(T.rev)+'건 + UGC '+fmt(T.ugc)+'건에서 추출</div></div>'+
    '<div class="tile"><div class="k">상세페이지</div><div class="v">'+fmt(T.det)+'</div><div class="s">이미지 전량 · 한국어 OCR</div></div>'+
    '<div class="tile"><div class="k">Meta 광고</div><div class="v">'+fmt(T.ads)+'</div><div class="s">브랜드별 라이브러리 전량</div></div>'+
    '<div class="tile"><div class="k">리뷰</div><div class="v">'+fmt(T.rev)+'</div><div class="s">사이트 '+fmt(T.site)+'건 중 '+Math.round(T.rev/T.site*100)+'%</div></div>'+
    '<div class="tile"><div class="k">UGC</div><div class="v">'+fmt(T.ugc)+'</div><div class="s">유튜브 검색 상위</div></div>'));

  /* ---------- 패드 언급 축 (이 문서에만 있는 지표) ---------- */
  var padRows=P.slice().sort(function(a,b){return b.padRev-a.padRev});
  var padMax=Math.max.apply(null,P.map(function(p){return Math.max(p.padDet,p.padRev)}));
  W.appendChild(E('div','panel',
    '<div class="ph"><h3>묶어 판 물건을 누가 말하는가 · 「패드」 언급률</h3>'+
    '<div class="hint">왼쪽은 브랜드의 상세 이미지 중 패드를 언급한 비율, 오른쪽은 리뷰 중 패드를 언급한 비율. 문서 단위가 다르므로(상세 한 장 대 리뷰 한 건) 두 값을 빼지 말고, 각 채널 안에서 제품끼리 비교하세요.</div></div>'+
    '<table class="duo"><tbody>'+
    padRows.map(function(p){
      var l=Math.round(p.padDet/padMax*100), r=Math.round(p.padRev/padMax*100);
      return '<tr><td class="vl">'+p.padDet+'%</td><td class="bl"><i style="width:'+l+'%"></i></td>'+
        '<td class="lab">'+esc(p.brand)+'<div style="font-size:10px;color:var(--subtle);font-weight:400">'+esc(p.pad)+'</div></td>'+
        '<td class="br"><i style="width:'+r+'%"></i></td><td class="vr">'+p.padRev+'%</td></tr>';
    }).join('')+
    '</tbody></table>'+
    '<div class="legend" style="margin-top:12px"><span><i class="sw" style="background:var(--claim)"></i>브랜드 · 상세 이미지</span>'+
    '<span><i class="sw" style="background:var(--want)"></i>고객 · 리뷰</span></div>'));

  /* ---------- 요약 ---------- */
  var g=function(s,side,sub){return (CON[s][side]||[]).filter(function(c){return c.label.indexOf(sub)>=0})[0]||{}};
  var pp=function(s){return byslug[s]};
  W.appendChild(E('div','panel sum',
    '<p class="d1">브랜드는 세럼을 팔고, 패드는 가격표에만 있습니다. 다섯 개 모두 「세럼 + 패드」를 한 상자에 담아 파는데, 왜 같이 담았는지를 상세페이지에서 설명하는 곳은 한 곳뿐입니다.</p><ul>'+
    '<li><b>아이소이는 리스팅 제목에 「+응급진정패드 4매」라고 써놓고 상세 24장에서 패드를 한 번도 말하지 않습니다</b> (상세 '+pp('isoi').padDet+'%). 그런데 고객 리뷰의 '+pp('isoi').padRev+'%가 패드를 말합니다. 브랜드가 비워둔 자리를 고객이 혼자 채운 셈입니다. 메디큐브도 같습니다 (상세 '+pp('medicube').padDet+'% — 그마저 OCR 오독, 리뷰 '+pp('medicube').padRev+'%).</li>'+
    '<li><b>패드를 컨셉으로 엮은 유일한 브랜드는 넘버즈인입니다.</b> "패드 단독 사용 대비 앰플+패드 병행 시 168% 시너지"를 상세 '+g('numbuzin','brand','168').det+'%로 걸었고, 리뷰의 패드 언급률도 '+pp('numbuzin').padRev+'%로 5종 중 가장 높습니다. 묶은 이유를 설명하면 고객도 묶어서 말합니다.</li>'+
    '<li><b>임상 수치와 특허는 한 번도 되돌아오지 않습니다.</b> 메디큐브 "인체적용시험 수치(853.7→744.9)" 상세 '+g('medicube','brand','인체적용시험').det+'% → 리뷰 '+g('medicube','brand','인체적용시험').rev+'% · UGC '+g('medicube','brand','인체적용시험').ugc+'%. 아이소이 "저자극 검증 완료" 상세 '+g('isoi','brand','저자극 검증').det+'% → 리뷰 '+g('isoi','brand','저자극 검증').rev+'%. 토리든 "특허 T-TECA 리포좀 공법" 상세 '+g('torriden','brand','T-TECA').det+'% → 리뷰 '+g('torriden','brand','T-TECA').rev+'%.</li>'+
    '<li><b>세럼은 판단이 유보됩니다.</b> "아직 효과는 모르겠다"가 넘버즈인 리뷰 '+g('numbuzin','user','모르겠다').rev+'% · 메디큐브 '+g('medicube','user','모르겠다').rev+'%인데 상세·광고에는 0%입니다. 패드와 달리 세럼은 바른 자리에서 결과가 안 보여, 유보 자체가 하나의 큰 컨셉이 됩니다.</li>'+
    '<li><b>브랜드가 안 건 결함을 고객이 겁니다.</b> 메디큐브 리뷰의 '+g('medicube','user','냄새').rev+'%가 "냄새·향이 특이하다"고 말합니다. 상세 '+g('medicube','user','냄새').det+'% · 광고 '+g('medicube','user','냄새').ad+'%. 연어 PDRN을 파는 브랜드가 원료취를 한 번도 다루지 않습니다.</li>'+
    '<li><b>물성은 유일하게 정확히 겹칩니다.</b> 바이오던스 "3D 젤리 텍스처" 상세 '+g('biodance','brand','3D 고밀도').det+'% ↔ 고객 "젤리라 일반 미스트와 다르다" 리뷰 '+g('biodance','user','젤리 제형').rev+'%. 뿌리는 순간 확인되는 주장이라 브랜드 말과 고객 말이 같아집니다.</li>'+
    '<li><b>브랜드 조어가 고객 어휘가 된 사례는 둘입니다.</b> 아이소이의 "응급"(상세 '+g('isoi','brand','응급진정세럼').det+'% → 리뷰 '+g('isoi','brand','응급진정세럼').rev+'%, 고객은 "뒤집어졌을 때" '+g('isoi','user','응급템').rev+'%)과 넘버즈인의 번호(고객이 제품을 아예 "5번"으로 부름 · UGC '+g('numbuzin','user','번호로 부른다').ugc+'%).</li>'+
    '<li><b>토리든은 피지를 팔고 고객은 진정을 삽니다.</b> 상세 최대 축은 "트러블 원인은 과잉 피지"('+g('torriden','brand','과잉 피지').det+'%)인데 고객 최대 축은 "진정이 확실하다"('+g('torriden','user','진정이 확실').rev+'%)입니다. 원인 서사보다 즉시 느껴지는 결과가 이깁니다.</li>'+
    '</ul>'));

  /* ---------- 제품 선택 ---------- */
  var pan=E('div','panel');
  pan.innerHTML='<div class="chips" id="chips"></div><div id="pbody"></div>';
  W.appendChild(pan);
  var chips=pan.querySelector('#chips'), pbody=pan.querySelector('#pbody');
  P.forEach(function(p,i){
    var b=E('button','chip'+(i===0?' on':''),esc(p.brand));
    b.onclick=function(){ [].forEach.call(chips.children,function(c){c.className='chip'}); b.className='chip on'; draw(p.slug); window.scrollTo({top:pan.offsetTop-12,behavior:'smooth'}); };
    chips.appendChild(b);
  });

  function card(c, side){
    var mainB = side==='brand' ? Math.max(c.rev,c.ugc) : Math.max(c.det,c.ad);
    var echo  = side==='brand'
      ? '<div class="echo"><span class="el">고객이 되뇌는 정도</span>'+
        '<span class="eb">리뷰 '+bar(c.rev,'w')+'<b>'+c.rev+'%</b></span>'+
        '<span class="eb">UGC '+bar(c.ugc,'w')+'<b>'+c.ugc+'%</b></span></div>'
      : '<div class="echo"><span class="el">브랜드가 말하는 정도</span>'+
        '<span class="eb">상세 '+bar(c.det,'c')+'<b>'+c.det+'%</b></span>'+
        '<span class="eb">광고 '+bar(c.ad,'c')+'<b>'+c.ad+'%</b></span></div>';
    var own = side==='brand'
      ? '<span class="own">상세 '+c.det+'% · 광고 '+c.ad+'%</span>'
      : '<span class="own">리뷰 '+c.rev+'% · UGC '+c.ugc+'%</span>';
    var mute = (side==='brand' && mainB<1) ? ' dead' : '';
    return '<div class="cc'+mute+(side==='user'?' u':'')+'">'+
      (side==='brand' ? (c.img?'<a class="ct" href="#" data-img="'+esc(c.img)+'"><img loading="lazy" src="'+esc(c.img)+'" alt=""></a>':'<span class="ct nt"></span>') : '')+
      '<div class="cm"><div class="ch">'+badge(c.src)+'<b>'+esc(c.label)+'</b>'+own+'</div>'+
      '<div class="cl">'+esc(c.line)+'</div>'+ echo +
      (c.q&&c.q.length?'<div class="cq">'+c.q.slice(0,2).map(function(t){return '<div class="quote">'+esc(t)+'</div>'}).join('')+'</div>':'')+
      '</div></div>';
  }

  function draw(s){
    var p=byslug[s], K=CON[s];
    var brand=K.brand.slice().sort(function(a,b){return Math.max(b.det,b.ad)-Math.max(a.det,a.ad)});
    var user =K.user.slice().sort(function(a,b){return Math.max(b.rev,b.ugc)-Math.max(a.rev,a.ugc)});
    var deaf=brand.filter(function(c){return Math.max(c.rev,c.ugc)<1}).length;

    pbody.innerHTML=
      '<div class="prod">'+
        '<img class="pimg" src="'+esc(p.img)+'" alt="">'+
        '<div><div class="pt">'+esc(p.fullName)+'</div>'+
        '<div class="pa">'+esc(p.goodsNo)+' · '+esc(p.brand)+' · 세럼 '+esc(p.serum)+' + '+esc(p.pad)+'</div>'+
        '<div class="plink"><a href="'+esc(p.url)+'" target="_blank">올리브영 상품페이지</a>'+
        '<a href="https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=KR&q='+encodeURIComponent(p.brand)+'&search_type=keyword_unordered" target="_blank">메타 광고 라이브러리</a></div></div>'+
        '<div class="pf">'+
          '<div><div class="k">판매가</div><div class="v">'+esc(p.price)+'<small>원</small></div></div>'+
          '<div><div class="k">수집 리뷰</div><div class="v">'+fmt(p.revN)+'<small> / '+fmt(p.siteTotal)+' · '+p.cov+'%</small></div></div>'+
          '<div><div class="k">평균 별점</div><div class="v">'+p.avg+'</div></div>'+
          '<div><div class="k">5점 비중</div><div class="v">'+p.my5+'<small>%</small></div></div>'+
          '<div><div class="k">재구매 표시</div><div class="v">'+p.repurchase+'<small>%</small></div></div>'+
          '<div><div class="k">패드 언급 · 상세 / 리뷰</div><div class="v">'+p.padDet+'<small>% / </small>'+p.padRev+'<small>%</small></div></div>'+
          '<div><div class="k">상세 · 광고 · UGC</div><div class="v">'+p.detailImgs+'<small> · '+p.adN+' · '+p.ugcN+'</small></div></div>'+
        '</div></div>'+

      '<div class="board">'+
        '<div class="col">'+
          '<div class="colh ch1"><h3>브랜드가 내세우는 컨셉 '+brand.length+'개</h3>'+
            '<span>상세페이지 '+p.detailImgs+'장 + Meta 광고 '+p.adN+'건'+(deaf?' · 이 중 '+deaf+'개는 고객 언어에 1% 미만':'')+'</span></div>'+
          brand.map(function(c){return card(c,'brand')}).join('')+
        '</div>'+
        '<div class="col">'+
          '<div class="colh ch2"><h3>고객이 주장하는 컨셉 '+user.length+'개</h3>'+
            '<span>리뷰 '+fmt(p.revN)+'건 + UGC '+fmt(p.ugcN)+'건에서 반복되는 말</span></div>'+
          user.map(function(c){return card(c,'user')}).join('')+
        '</div>'+
      '</div>'+

      '<div class="cols2">'+
        '<div><div class="ph" style="margin-top:18px"><h3>상세페이지 '+p.detailImgs+'장</h3><div class="hint">클릭하면 원본</div></div>'+
          '<div class="gal">'+(DETAIL[s]||[]).map(function(f,i){return '<a href="#" data-img="'+esc(f)+'"><span class="no">'+(i+1)+'</span><img loading="lazy" src="'+esc(f)+'" alt=""></a>'}).join('')+'</div></div>'+
        '<div><div class="ph" style="margin-top:18px"><h3>Meta 광고 '+p.adN+'건 <span class="mono" style="font-weight:400;color:var(--faint)">· 문안 '+p.adKinds+'종</span></h3><div class="hint">본문 클릭하면 펼쳐짐</div></div>'+
          '<div class="adL">'+(ADS[s]||[]).slice(0,100).map(function(a){
            return '<div class="ad"><div class="adthumb">'+(a.img?'<img loading="lazy" src="'+esc(a.img)+'" alt="">':(a.v?'VIDEO':'—'))+'</div>'+
              '<div><div class="adpg">'+esc(a.pg||'')+(a.n>1?' <span class="w">같은 문안 '+a.n+'건</span>':'')+'</div>'+
              '<div class="adtx">'+esc(a.b||'')+'</div><div class="admeta">'+esc(a.st||'')+(a.cta?' · '+esc(a.cta):'')+'</div></div></div>';
          }).join('')+'</div></div>'+
      '</div>'+
      '<div class="ph" style="margin-top:18px"><h3>UGC '+p.ugcN+'건</h3><div class="hint">유튜브 검색 상위 · 브랜드 + 제품명 3개 질의</div></div>'+
      '<div class="ug">'+(UGC[s]||[]).slice(0,90).map(function(v){
        return '<a class="ugc" href="'+esc(v.url)+'" target="_blank">'+(v.img?'<img loading="lazy" src="'+esc(v.img)+'" alt="">':'<div class="noimg">'+esc(v.pf.toUpperCase())+'</div>')+
          '<div class="m"><div class="t">'+esc(v.t||v.d.slice(0,70))+'</div><div class="c"><span>'+esc(v.ch||'')+'</span><b>'+esc(v.vw||'')+'</b></div></div></a>';
      }).join('')+'</div>';
  }
  draw(P[0].slug);

  /* ---------- 크로스 판독 ---------- */
  var orphan=[], deafList=[], padGap=[];
  P.forEach(function(p){
    (CON[p.slug].user||[]).forEach(function(c){ if(Math.max(c.det,c.ad)<1.5 && Math.max(c.rev,c.ugc)>=0.5)
      orphan.push({b:p.brand,c:c}); });
    (CON[p.slug].brand||[]).forEach(function(c){ if(Math.max(c.rev,c.ugc)<0.6 && Math.max(c.det,c.ad)>=5)
      deafList.push({b:p.brand,c:c}); });
    padGap.push(p);
  });
  orphan.sort(function(a,b){return Math.max(b.c.rev,b.c.ugc)-Math.max(a.c.rev,a.c.ugc)});
  deafList.sort(function(a,b){return Math.max(b.c.det,b.c.ad)-Math.max(a.c.det,a.c.ad)});
  padGap.sort(function(a,b){return a.padDet-b.padDet || b.padRev-a.padRev});

  W.appendChild(E('div','panel',
    '<div class="ph"><h3>5개 제품을 겹쳐 보면</h3><div class="hint">브랜드가 안 건 자리를 고객이 채우고, 브랜드가 크게 건 자리가 비어 있습니다. 세 번째 칸은 이 문서의 주제인 패드입니다.</div></div>'+
    '<div class="three">'+
    '<div class="box"><div class="bt"><i class="dotc" style="background:var(--want)"></i>브랜드가 안 걸었는데 고객이 만든 컨셉</div>'+
      '<div class="bs">상세·광고에서 1.5% 미만인데 리뷰·UGC에 반복되는 말</div><ul>'+
      orphan.slice(0,12).map(function(o){return '<li><b>'+esc(o.b)+'</b> '+esc(o.c.label)+' <span class="mono" style="color:var(--want)">리뷰 '+o.c.rev+'% · UGC '+o.c.ugc+'%</span></li>'}).join('')+
      '</ul></div>'+
    '<div class="box"><div class="bt"><i class="dotc" style="background:var(--claim)"></i>브랜드가 크게 걸었는데 고객 언어에 없는 컨셉</div>'+
      '<div class="bs">상세·광고 5% 이상인데 리뷰·UGC 0.6% 미만</div><ul>'+
      deafList.slice(0,12).map(function(o){return '<li><b>'+esc(o.b)+'</b> '+esc(o.c.label)+' <span class="mono" style="color:var(--claim)">상세 '+o.c.det+'% · 광고 '+o.c.ad+'%</span></li>'}).join('')+
      '</ul></div>'+
    '<div class="box"><div class="bt"><i class="dotc" style="background:#0f0f0f"></i>같이 판 패드를 누가 말하나</div>'+
      '<div class="bs">브랜드가 상세에서 패드를 적게 말한 순서. 두 값은 문서 단위가 달라 빼지 않습니다.</div><ul>'+
      padGap.map(function(p){
        return '<li><b>'+esc(p.brand)+'</b> '+esc(p.pad)+'<br><span class="mono" style="color:'+(p.padDet?'var(--claim)':'var(--faint)')+'">상세 '+(p.padDet?p.padDet+'%':'언급 없음')+'</span> <span class="mono" style="color:var(--want)">· 리뷰 '+p.padRev+'%</span></li>'}).join('')+
      '</ul></div></div>'));

  /* ---------- foot ---------- */
  W.appendChild(E('div','foot',
    '<b>고른 기준</b> · 올리브영에서 세럼/앰플 본품과 토너패드가 <b>한 SKU로 함께 오는</b> 기획 상품만. 같은 브랜드가 패드를 따로 판다는 사실은 기준이 아닙니다. 브랜드 중복을 빼고 리뷰 최다순으로 5종. '+
    '패드 수량은 제품마다 다릅니다(겔패드 4매 ~ 패드 10매) — 본품 곁들이 소량 기획이라 「패드를 얼마나 주느냐」가 아니라 「패드를 말하느냐」로 읽어야 합니다.<br>'+
    '<b>컨셉을 뽑은 방법</b> · 상세페이지 이미지 '+fmt(T.det)+'장을 macOS Vision 한국어 OCR로 텍스트화하고, Meta 광고 '+fmt(T.ads)+'건의 문안을 함께 읽어 브랜드가 실제로 내건 문장을 '+T.nb+'개 추렸습니다. '+
    '고객 컨셉 '+T.nu+'개는 리뷰 '+fmt(T.rev)+'건과 UGC '+fmt(T.ugc)+'건에서 그 제품에만 유난히 자주 나오는 표현을 뽑아(다른 4개 제품 평균 대비 2.2배 이상) 실제 문장을 확인하고 정리했습니다.<br>'+
    '<b>퍼센트가 뜻하는 것</b> · 상세 % = 그 문구가 나오는 상세 이미지의 비율, 광고 % = 그 컨셉을 말하는 광고 문안의 비율, 리뷰 % = 그 컨셉을 말한 리뷰의 비율, UGC % = 그 컨셉을 말한 UGC의 비율. '+
    '채널마다 문서 단위가 다르므로(상세 한 장은 여러 주장을 싣고 리뷰 한 건은 한두 가지만 말합니다) 채널 간 절대 비교가 아니라 같은 채널 안에서의 크기와 0 여부로 읽습니다.<br>'+
    '<b>광고는 SKU가 아니라 브랜드 단위입니다</b> · Meta 광고 라이브러리는 브랜드 이름으로만 검색되므로, 광고 '+fmt(T.ads)+'건에는 이 SKU가 아닌 다른 제품 광고가 섞여 있습니다. 메디큐브 광고의 "디바이스", 바이오던스 광고의 "겔 마스크"가 그 흔적입니다. 광고 %는 <b>브랜드가 지금 무엇을 밀고 있는지</b>로 읽고, 이 SKU의 주장으로 읽지 않습니다.<br>'+
    '<b>표본</b> · 리뷰는 올리브영 리뷰 API를 정렬 · 리뷰유형 · 피부타입 · 피부톤 다섯 축으로 층화해 받았습니다. 스트림 하나당 서버 상한이 있어 100%는 도달할 수 없습니다(수집률 '+Math.round(T.rev/T.site*100)+'%). '+
    'UGC는 유튜브 검색 상위이며 협찬·체험단 콘텐츠가 섞여 있습니다 — 성분명·특허처럼 리뷰와 UGC가 크게 갈리는 축은 고객 언어가 아니라 브랜드 언어가 흘러든 것으로 읽어야 합니다.<br>'+
    '<b>OCR</b> · 디자인 글씨체에서 오독이 나므로 개별 문장이 아니라 비율로만 읽습니다(메디큐브 패드 '+byslug.medicube.padDet+'%는 시험보고서 이미지의 오독 1건입니다). 인용한 상세 문구는 원본 이미지를 확인해 손으로 옮겼습니다. 인용한 리뷰는 저장된 원문 그대로이며 작성자 식별정보는 수집하지 않았습니다.'));

  /* ---------- lightbox ---------- */
  var lb=document.getElementById('lb'), lbc=document.getElementById('lbc');
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-img]');
    if(a){e.preventDefault(); lbc.innerHTML='<img src="'+a.getAttribute('data-img')+'">'; lb.className='lb on'; return}
    var ad=e.target.closest('.adtx'); if(ad){ad.parentNode.parentNode.classList.toggle('open')}
  });
  document.getElementById('lbx').onclick=function(){lb.className='lb'};
  lb.onclick=function(e){if(e.target===lb)lb.className='lb'};
  document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.className='lb'});
})();
