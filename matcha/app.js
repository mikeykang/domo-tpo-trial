/* 컨셉 리포트 뷰 — 큐텐 재팬 말차 셸프.
   왼쪽 = 브랜드가 큐텐 상세페이지 + 메타 광고(JP)에서 내세우는 컨셉.
   오른쪽 = 고객이 큐텐 리뷰 + UGC에서 실제로 주장하는 컨셉.
   일본어 문장에는 한국어를 나란히 싣는다. */
(function(){
  var P=window.P, CON=window.CON, ADS=window.ADS, UGC=window.UGC, DETAIL=window.DETAIL;
  var W=document.getElementById('wrap');
  var byslug={}; P.forEach(function(p){byslug[p.slug]=p});
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var E=function(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e};
  var fmt=function(n){return (n||0).toLocaleString('ko-KR')};

  var T={rev:0,det:0,detN:0,promo:0,ads:0,ugc:0,site:0,nb:0,nu:0,adBrands:0};
  P.forEach(function(p){T.rev+=p.revN;T.det+=p.detailImgs;T.detN+=p.detailN;T.promo+=p.promoN;T.ads+=p.adN;T.ugc+=p.ugcN;T.site+=p.siteTotal;T.nb+=p.nBrand;T.nu+=p.nUser;if(p.adN)T.adBrands++});

  var SRC={detail:['상세','sd'],ad:['광고','sa'],both:['상세+광고','sb'],review:['리뷰','sr'],ugc:['UGC','su']};
  var badge=function(k){var x=SRC[k]||['','']; return '<span class="src '+x[1]+'">'+x[0]+'</span>'};
  var bar=function(v,cls){return '<span class="tk"><i class="'+cls+'" style="width:'+Math.max(v>0?4:0,Math.min(100,v/40*100))+'%"></i></span>'};

  /* ---------- top ---------- */
  W.appendChild(E('div','top',
    '<div><div class="kick">DOMO · CONCEPT MAP · QOO10 JP MATCHA</div>'+
    '<h1>브랜드가 내세우는 컨셉과 고객이 주장하는 컨셉</h1>'+
    '<div class="sub">큐텐 재팬 말차 화장품 10종. 왼쪽은 상세페이지 + 메타 광고(JP)에 실제로 적힌 문장, 오른쪽은 리뷰 + UGC에서 고객이 실제로 쓰는 말입니다. 일본어에는 한국어를 나란히 실었습니다.</div></div>'+
    '<div class="topmeta"><span>수집 <b class="mono">'+esc(window.COLLECTED)+'</b></span><span>작성 <b>Mikey</b></span></div>'));

  W.appendChild(E('div','row',
    '<div class="tile hero"><div class="k">브랜드 컨셉</div><div class="v">'+T.nb+'</div><div class="s">상세 '+fmt(T.detN)+'장 + 광고 '+fmt(T.ads)+'건에서 추출</div></div>'+
    '<div class="tile hero2"><div class="k">고객 컨셉</div><div class="v">'+T.nu+'</div><div class="s">리뷰 '+fmt(T.rev)+'건 + UGC '+fmt(T.ugc)+'건에서 추출</div></div>'+
    '<div class="tile"><div class="k">상세페이지</div><div class="v">'+fmt(T.detN)+'</div><div class="s">전체 '+fmt(T.det)+'장 중 텍스트 있는 장 · 매장 배너 '+T.promo+'장 제외</div></div>'+
    '<div class="tile"><div class="k">메타 광고 JP</div><div class="v">'+fmt(T.ads)+'</div><div class="s">10종 중 광고가 잡힌 건 '+T.adBrands+'종 · 브랜드 3곳</div></div>'+
    '<div class="tile"><div class="k">리뷰</div><div class="v">'+fmt(T.rev)+'</div><div class="s">사이트 '+fmt(T.site)+'건 중 '+Math.round(T.rev/T.site*100)+'%</div></div>'+
    '<div class="tile"><div class="k">UGC</div><div class="v">'+fmt(T.ugc)+'</div><div class="s">유튜브 · 틱톡</div></div>'));

  /* ---------- 요약 ---------- */
  var g=function(s,side,label){return (CON[s][side]||[]).filter(function(c){return c.label===label})[0]||{}};
  W.appendChild(E('div','panel sum', window.SUMMARY || ''));

  /* ---------- 제품 선택 ---------- */
  var pan=E('div','panel');
  pan.innerHTML='<div class="chips" id="chips"></div><div id="pbody"></div>';
  W.appendChild(pan);
  var chips=pan.querySelector('#chips'), pbody=pan.querySelector('#pbody');
  P.forEach(function(p,i){
    var b=E('button','chip'+(i===0?' on':''),esc(p.brandKo)+' <span style="opacity:.55">'+esc(p.chip)+'</span>');
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
      '<div class="cm"><div class="ch">'+badge(c.src)+'<b>'+esc(c.label)+'</b>'+
        (c.ja?'<span class="ja">'+esc(c.ja)+'</span>':'')+own+'</div>'+
      '<div class="cl"><span class="jl">'+esc(c.line)+'</span>'+esc(c.lineKo||'')+'</div>'+ echo +
      (c.q&&c.q.length?'<div class="cq">'+c.q.map(function(t){
        return '<div class="quote"><span class="jl">'+esc(t.ja)+'</span>'+esc(t.ko||'')+'</div>'}).join('')+'</div>':'')+
      '</div></div>';
  }

  function draw(s){
    var p=byslug[s], K=CON[s];
    var brand=K.brand.slice().sort(function(a,b){return Math.max(b.det,b.ad)-Math.max(a.det,a.ad)});
    var user =K.user.slice().sort(function(a,b){return Math.max(b.rev,b.ugc)-Math.max(a.rev,a.ugc)});
    var deaf=brand.filter(function(c){return Math.max(c.rev,c.ugc)<1}).length;
    var dImgs=p.detailN;

    pbody.innerHTML=
      '<div class="prod">'+
        '<img class="pimg" src="'+esc(p.img)+'" alt="">'+
        '<div><div class="pt">'+esc(p.name)+'</div>'+
        '<div class="jl" style="font-size:11.5px;margin-top:3px">'+esc(p.fullName)+'</div>'+
        '<div class="pa">'+esc(p.goodsNo)+' · '+esc(p.brand)+'</div>'+
        '<div class="plink"><a href="'+esc(p.url)+'" target="_blank">큐텐 상품페이지</a>'+
        '<a href="https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=JP&q='+encodeURIComponent(p.brand)+'&search_type=keyword_unordered" target="_blank">메타 광고 라이브러리 JP</a></div></div>'+
        '<div class="pf">'+
          '<div><div class="k">판매가</div><div class="v">'+esc(p.price)+'<small>엔'+(p.refPrice?' / 참고가 '+esc(p.refPrice):'')+'</small></div></div>'+
          '<div><div class="k">수집 리뷰</div><div class="v">'+fmt(p.revN)+'<small> / '+fmt(p.siteTotal)+' · '+p.cov+'%</small></div></div>'+
          '<div><div class="k">평균 별점</div><div class="v">'+p.avg+'</div></div>'+
          '<div><div class="k">5점 비중</div><div class="v">'+p.my5+'<small>%</small></div></div>'+
          '<div><div class="k">사진 리뷰</div><div class="v">'+p.photo+'<small>%</small></div></div>'+
          '<div><div class="k">상세 · 광고 · UGC</div><div class="v">'+dImgs+'<small> · '+p.adN+' · '+p.ugcN+'</small></div></div>'+
        '</div></div>'+

      '<div class="board">'+
        '<div class="col">'+
          '<div class="colh ch1"><h3>브랜드가 내세우는 컨셉 '+brand.length+'개</h3>'+
            '<span>상세페이지 '+dImgs+'장 + 메타 광고 '+p.adN+'건'+(deaf?' · 이 중 '+deaf+'개는 고객 언어에 1% 미만':'')+'</span></div>'+
          brand.map(function(c){return card(c,'brand')}).join('')+
        '</div>'+
        '<div class="col">'+
          '<div class="colh ch2"><h3>고객이 주장하는 컨셉 '+user.length+'개</h3>'+
            '<span>리뷰 '+fmt(p.revN)+'건 + UGC '+fmt(p.ugcN)+'건에서 반복되는 말</span></div>'+
          user.map(function(c){return card(c,'user')}).join('')+
        '</div>'+
      '</div>'+

      '<div class="cols2">'+
        '<div><div class="ph" style="margin-top:18px"><h3>상세페이지 '+p.detailImgs+'장</h3><div class="hint">앞쪽 '+p.promoN+'장은 제품이 아니라 메가와리 매장 배너입니다 · 클릭하면 원본</div></div>'+
          '<div class="gal">'+(DETAIL[s]||[]).map(function(f,i){return '<a href="#" data-img="'+esc(f)+'"><span class="no">'+(i+1)+'</span><img loading="lazy" src="'+esc(f)+'" alt=""></a>'}).join('')+'</div></div>'+
        '<div><div class="ph" style="margin-top:18px"><h3>메타 광고 '+p.adN+'건 <span class="mono" style="font-weight:400;color:var(--faint)">· 문안 '+p.adKinds+'종</span></h3><div class="hint">본문 클릭하면 펼쳐짐</div></div>'+
          (p.adN?('<div class="adL">'+(ADS[s]||[]).map(function(a){
            return '<div class="ad"><div class="adthumb">'+(a.img?'<img loading="lazy" src="'+esc(a.img)+'" alt="">':(a.v?'VIDEO':'—'))+'</div>'+
              '<div><div class="adpg">'+esc(a.pg||'')+(a.n>1?' <span class="w">같은 문안 '+a.n+'건</span>':'')+'</div>'+
              '<div class="adtx"><span class="jl">'+esc(a.b||'')+'</span>'+esc(a.bko||'')+'</div><div class="admeta">'+esc(a.st||'')+(a.cta?' · '+esc(a.cta):'')+'</div></div></div>';
          }).join('')+'</div>')
          :'<div class="empty">메타 광고 라이브러리 JP에 이 브랜드의 광고가 0건입니다. 이 제품의 브랜드 컨셉은 상세페이지에만 있습니다.</div>')+'</div>'+
      '</div>'+
      '<div class="ph" style="margin-top:18px"><h3>UGC '+p.ugcN+'건</h3><div class="hint">유튜브 · 틱톡 · 브랜드나 抹茶 + 화장품 어휘를 실제로 말하는 것만</div></div>'+
      (p.ugcN?('<div class="ug">'+(UGC[s]||[]).map(function(v){
        return '<a class="ugc" href="'+esc(v.url)+'" target="_blank">'+(v.img?'<img loading="lazy" src="'+esc(v.img)+'" alt="">':'<div class="noimg">'+esc(v.pf.toUpperCase())+'</div>')+
          '<div class="m"><div class="t"><span class="jl">'+esc(v.t||v.d.slice(0,70))+'</span>'+esc(v.tko||'')+'</div><div class="c"><span>'+esc(v.ch||'')+'</span><b>'+esc(v.vw||'')+'</b></div></div></a>';
      }).join('')+'</div>')
      :'<div class="empty">브랜드나 抹茶를 실제로 말하는 UGC가 0건입니다.</div>');
  }
  draw(P[0].slug);

  /* ---------- 크로스 판독 ---------- */
  var orphan=[], deafList=[];
  P.forEach(function(p){
    (CON[p.slug].user||[]).forEach(function(c){ if(Math.max(c.det,c.ad)<1.5 && Math.max(c.rev,c.ugc)>=0.5)
      orphan.push({b:p.brandKo,c:c}); });
    (CON[p.slug].brand||[]).forEach(function(c){ if(Math.max(c.rev,c.ugc)<0.6 && Math.max(c.det,c.ad)>=5)
      deafList.push({b:p.brandKo,c:c}); });
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
  W.appendChild(E('div','foot', window.FOOT || ''));

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
