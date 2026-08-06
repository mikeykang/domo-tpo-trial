/* 컨셉 리포트 뷰.
   왼쪽 = 브랜드가 상세페이지 + Meta 광고에서 내세우는 컨셉.
   오른쪽 = 고객이 리뷰 + UGC에서 실제로 주장하는 컨셉.
   컨셉은 카테고리가 아니라 그 채널에 실제로 있는 문장이다. */
(function(){
  var P=window.P, CON=window.CON, ADS=window.ADS, UGC=window.UGC, DETAIL=window.DETAIL;
  var W=document.getElementById('wrap');
  var byslug={}; P.forEach(function(p){byslug[p.slug]=p});
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var E=function(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e};
  var fmt=function(n){return (n||0).toLocaleString('ko-KR')};
  var r1=function(n){return Math.round(n*10)/10};

  var T={rev:0,det:0,ads:0,ugc:0,site:0,nb:0,nu:0};
  P.forEach(function(p){T.rev+=p.revN;T.det+=p.detailImgs;T.ads+=p.adN;T.ugc+=p.ugcN;T.site+=p.siteTotal;T.nb+=p.nBrand;T.nu+=p.nUser});

  var SRC={detail:['상세','sd'],ad:['광고','sa'],both:['상세+광고','sb'],review:['리뷰','sr'],ugc:['UGC','su']};
  var badge=function(k){var x=SRC[k]||['','']; return '<span class="src '+x[1]+'">'+x[0]+'</span>'};
  var bar=function(v,cls){return '<span class="tk"><i class="'+cls+'" style="width:'+Math.max(v>0?4:0,Math.min(100,v/40*100))+'%"></i></span>'};

  /* ---------- top ---------- */
  W.appendChild(E('div','top',
    '<div><div class="kick">DOMO · CONCEPT MAP · KR TONER PAD</div>'+
    '<h1>브랜드가 내세우는 컨셉과 고객이 주장하는 컨셉</h1>'+
    '<div class="sub">올리브영 토너패드 상위 10개. 왼쪽은 상세페이지 + Meta 광고에 실제로 적힌 문장, 오른쪽은 리뷰 + UGC에서 고객이 실제로 쓰는 말입니다.</div></div>'+
    '<div class="topmeta"><span>수집 <b class="mono">'+esc(window.COLLECTED)+'</b></span><span>작성 <b>Mikey</b></span></div>'));

  W.appendChild(E('div','row',
    '<div class="tile hero"><div class="k">브랜드 컨셉</div><div class="v">'+T.nb+'</div><div class="s">상세 '+fmt(T.det)+'장 + 광고 '+fmt(T.ads)+'건에서 추출</div></div>'+
    '<div class="tile hero2"><div class="k">고객 컨셉</div><div class="v">'+T.nu+'</div><div class="s">리뷰 '+fmt(T.rev)+'건 + UGC '+fmt(T.ugc)+'건에서 추출</div></div>'+
    '<div class="tile"><div class="k">상세페이지</div><div class="v">'+fmt(T.det)+'</div><div class="s">이미지 전량 · 한국어 OCR</div></div>'+
    '<div class="tile"><div class="k">Meta 광고</div><div class="v">'+fmt(T.ads)+'</div><div class="s">브랜드별 라이브러리 전량</div></div>'+
    '<div class="tile"><div class="k">리뷰</div><div class="v">'+fmt(T.rev)+'</div><div class="s">사이트 '+fmt(T.site)+'건 중 '+Math.round(T.rev/T.site*100)+'%</div></div>'+
    '<div class="tile"><div class="k">UGC</div><div class="v">'+fmt(T.ugc)+'</div><div class="s">유튜브 · 네이버 · 틱톡 · 인스타</div></div>'));

  /* ---------- 요약 ---------- */
  var g=function(s,side,label){return (CON[s][side]||[]).filter(function(c){return c.label===label})[0]||{}};
  W.appendChild(E('div','panel sum',
    '<p class="d1">브랜드는 성분 이름과 임상 숫자로 컨셉을 짓고, 고객은 눈에 보이는 증거와 자기가 만든 사용법으로 컨셉을 짓습니다.</p><ul>'+
    '<li><b>고객이 스스로 만든 말이 브랜드 문구를 이깁니다.</b> 넘버즈인의 <b>"밀가루 끊은 피부"</b>는 상세페이지 57장과 광고 52건 어디에도 없는데 리뷰에 '+g('numbuzin','user','밀가루 끊은 피부').rev+'% 나옵니다. 사는 이유이자 배신감의 언어이기도 합니다 — "이거 쓰면 밀가루 끊은 피부 된다메요; 그냥 토너팩인디".</li>'+
    '<li><b>더마토리는 성분을 팔고 고객은 색깔을 삽니다.</b> 상세는 "색소 없이 숯 5% 함유"라 쓰는데, 리뷰 '+g('dermatory','user','검정색이라 뭐가 닦였는지 눈에 보인다').rev+'%는 <b>"검정색이라 뭐가 닦였는지 보인다"</b>고 씁니다. 성분이 아니라 눈으로 확인되는 증거가 컨셉입니다.</li>'+
    '<li><b>메디큐브는 임상 11건으로 증명하고 고객은 중단 실험으로 증명합니다.</b> "안 쓰면 티가 난다"가 리뷰 '+g('medicube','user','안 쓰면 티가 난다').rev+'%. "쓸 때는 효과가 있나 싶은데 막상 안쓰면 티가 뭔가 나요 진짜 마법임".</li>'+
    '<li><b>모델은 상세페이지에 없고 리뷰에 있습니다.</b> 브링그린 백현은 상세 '+g('bringgreen','user','백현이 보고 샀다').det+'% · 리뷰 '+g('bringgreen','user','백현이 보고 샀다').rev+'%, 셀퓨전씨 핑구 마그넷은 상세 '+g('cellfusion','user','핑구 마그넷이 귀엽다').det+'% · 리뷰 '+g('cellfusion','user','핑구 마그넷이 귀엽다').rev+'%. 상세페이지는 진로 콜라보를 파는데 고객은 핑구를 말합니다.</li>'+
    '<li><b>같은 물건을 다른 이름으로 부릅니다.</b> 브링그린은 "와플시트", 고객은 "구멍이 송송"(리뷰 '+g('bringgreen','user','구멍이 송송 / 벌집').rev+'%)과 "벌집". 반대로 바이오던스 "겔패드"와 넘버즈인 "1번·3번"은 브랜드 조어가 그대로 고객 어휘가 됐습니다.</li>'+
    '<li><b>브랜드가 자랑하는 물성이 고객에게는 결함이 되기도 합니다.</b> 바이오던스는 겔링 코팅을 자극 84.1% 감소로 파는데, 리뷰는 "너무 미끌거려서 닦토로는 힘듬". 토리든의 20배 흡수력은 "얇아서 착 붙어요"와 "에센스가 1/3도 없어요"로 갈립니다.</li>'+
    '<li><b>가격은 상세페이지에 없고 리뷰에 있습니다.</b> 브링그린 리뷰 '+g('bringgreen','user','가성비 · 저렴해서').rev+'%가 가성비를 말하는데 상세 28장에는 가격 언급이 '+g('bringgreen','user','가성비 · 저렴해서').det+'%입니다.</li>'+
    '<li><b>근거는 크리에이터만 나릅니다.</b> 메디힐 독일 더마테스트는 리뷰 '+g('mediheal','user','독일 더마테스트 (UGC만)').rev+'% 대 UGC '+g('mediheal','user','독일 더마테스트 (UGC만)').ugc+'%. 더마토리 UGC의 '+g('dermatory','user','파우더룸 천사박스 (UGC)').ugc+'%는 "파우더룸 천사박스" — 체험단 경로가 그대로 드러납니다.</li>'+
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
    var mainA = side==='brand' ? Math.max(c.det,c.ad) : Math.max(c.rev,c.ugc);
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
        '<div class="pa">'+esc(p.goodsNo)+' · '+esc(p.brand)+'</div>'+
        '<div class="plink"><a href="'+esc(p.url)+'" target="_blank">올리브영 상품페이지</a>'+
        '<a href="https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=KR&q='+encodeURIComponent(p.brand)+'&search_type=keyword_unordered" target="_blank">메타 광고 라이브러리</a></div></div>'+
        '<div class="pf">'+
          '<div><div class="k">판매가</div><div class="v">'+esc(p.price)+'<small>원</small></div></div>'+
          '<div><div class="k">수집 리뷰</div><div class="v">'+fmt(p.revN)+'<small> / '+fmt(p.siteTotal)+' · '+p.cov+'%</small></div></div>'+
          '<div><div class="k">평균 별점</div><div class="v">'+p.avg+'</div></div>'+
          '<div><div class="k">5점 비중</div><div class="v">'+p.my5+'<small>% / 사이트 '+(p.site5==null?'?':p.site5)+'%</small></div></div>'+
          '<div><div class="k">재구매 표시</div><div class="v">'+p.repurchase+'<small>%</small></div></div>'+
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
      '<div class="ph" style="margin-top:18px"><h3>UGC '+p.ugcN+'건</h3><div class="hint">유튜브 · 네이버 · 틱톡 · 인스타</div></div>'+
      '<div class="ug">'+(UGC[s]||[]).slice(0,90).map(function(v){
        return '<a class="ugc" href="'+esc(v.url)+'" target="_blank">'+(v.img?'<img loading="lazy" src="'+esc(v.img)+'" alt="">':'<div class="noimg">'+esc(v.pf.toUpperCase())+'</div>')+
          '<div class="m"><div class="t">'+esc(v.t||v.d.slice(0,70))+'</div><div class="c"><span>'+esc(v.ch||'')+'</span><b>'+esc(v.vw||'')+'</b></div></div></a>';
      }).join('')+'</div>';
  }
  draw(P[0].slug);

  /* ---------- 크로스 판독 ---------- */
  var orphan=[], deafList=[];
  P.forEach(function(p){
    (CON[p.slug].user||[]).forEach(function(c){ if(Math.max(c.det,c.ad)<1.5 && Math.max(c.rev,c.ugc)>=0.5)
      orphan.push({b:p.brand,c:c}); });
    (CON[p.slug].brand||[]).forEach(function(c){ if(Math.max(c.rev,c.ugc)<0.6 && Math.max(c.det,c.ad)>=5)
      deafList.push({b:p.brand,c:c}); });
  });
  orphan.sort(function(a,b){return Math.max(b.c.rev,b.c.ugc)-Math.max(a.c.rev,a.c.ugc)});
  deafList.sort(function(a,b){return Math.max(b.c.det,b.c.ad)-Math.max(a.c.det,a.c.ad)});

  W.appendChild(E('div','panel',
    '<div class="ph"><h3>10개 제품을 겹쳐 보면</h3><div class="hint">브랜드가 안 건 자리를 고객이 채우고, 브랜드가 크게 건 자리가 비어 있습니다.</div></div>'+
    '<div class="three" style="grid-template-columns:1fr 1fr">'+
    '<div class="box"><div class="bt"><i class="dotc" style="background:var(--want)"></i>브랜드가 안 걸었는데 고객이 만든 컨셉</div>'+
      '<div class="bs">상세·광고에서 1.5% 미만인데 리뷰·UGC에 반복되는 말</div><ul>'+
      orphan.slice(0,12).map(function(o){return '<li><b>'+esc(o.b)+'</b> '+esc(o.c.label)+' <span class="mono" style="color:var(--want)">리뷰 '+o.c.rev+'% · UGC '+o.c.ugc+'%</span></li>'}).join('')+
      '</ul></div>'+
    '<div class="box"><div class="bt"><i class="dotc" style="background:var(--claim)"></i>브랜드가 크게 걸었는데 고객 언어에 없는 컨셉</div>'+
      '<div class="bs">상세·광고 5% 이상인데 리뷰·UGC 0.6% 미만</div><ul>'+
      deafList.slice(0,12).map(function(o){return '<li><b>'+esc(o.b)+'</b> '+esc(o.c.label)+' <span class="mono" style="color:var(--claim)">상세 '+o.c.det+'% · 광고 '+o.c.ad+'%</span></li>'}).join('')+
      '</ul></div></div>'));

  /* ---------- foot ---------- */
  W.appendChild(E('div','foot',
    '<b>컨셉을 뽑은 방법</b> · 상세페이지 이미지 '+fmt(T.det)+'장을 macOS Vision 한국어 OCR로 텍스트화하고, Meta 광고 '+fmt(T.ads)+'건의 문안을 함께 읽어 브랜드가 실제로 내건 문장을 '+T.nb+'개 추렸습니다. '+
    '고객 컨셉 '+T.nu+'개는 리뷰 '+fmt(T.rev)+'건과 UGC '+fmt(T.ugc)+'건에서 그 제품에만 유난히 자주 나오는 표현을 뽑아(다른 9개 제품 평균 대비 3배 이상) 실제 문장을 확인하고 정리했습니다.<br>'+
    '<b>퍼센트가 뜻하는 것</b> · 상세 % = 그 문구가 나오는 상세 이미지의 비율, 광고 % = 그 컨셉을 말하는 광고 문안의 비율, 리뷰 % = 그 컨셉을 말한 리뷰의 비율, UGC % = 그 컨셉을 말한 UGC의 비율. '+
    '채널마다 문서 단위가 다르므로(상세 한 장은 여러 주장을 싣고 리뷰 한 건은 한두 가지만 말합니다) 채널 간 절대 비교가 아니라 같은 채널 안에서의 크기와 0 여부로 읽습니다.<br>'+
    '<b>표본</b> · 리뷰는 올리브영 리뷰 API를 정렬 · 리뷰유형 · 피부타입 · 피부톤 · 옵션 다섯 축으로 층화해 받았습니다. 스트림 하나당 5,000건이 서버 상한이라 100%는 도달할 수 없어, 수집분의 5점 비중을 사이트 공개 분포와 나란히 실었습니다.<br>'+
    '<b>UGC 주의</b> · UGC에는 협찬·체험단 콘텐츠가 섞여 있습니다. 더마토리 UGC의 "파우더룸 천사박스", 듀이트리의 "협찬" 표기가 그 흔적입니다. 성분명·임상처럼 리뷰와 UGC가 크게 갈리는 축은 고객 언어가 아니라 브랜드 언어가 흘러든 것으로 읽어야 합니다.<br>'+
    '<b>OCR</b> · 디자인 글씨체에서 오독이 나므로 개별 문장이 아니라 비율로만 읽습니다. 인용한 상세 문구는 원본 이미지를 확인해 손으로 옮겼습니다.'));

  /* ---------- tooltip / lightbox ---------- */
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
