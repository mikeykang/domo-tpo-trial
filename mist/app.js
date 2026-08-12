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
    '<div><div class="kick">DOMO · CONCEPT MAP · KR MIST</div>'+
    '<h1>브랜드가 내세우는 컨셉과 고객이 주장하는 컨셉</h1>'+
    '<div class="sub">올리브영 미스트 판매랭킹 상위 10개 브랜드. 왼쪽은 상세페이지 + Meta 광고에 실제로 적힌 문장, 오른쪽은 리뷰 + UGC에서 고객이 실제로 쓰는 말입니다.</div></div>'+
    '<div class="topmeta"><span>수집 <b class="mono">'+esc(window.COLLECTED)+'</b></span><span>작성 <b>Mikey</b></span></div>'));

  W.appendChild(E('div','row',
    '<div class="tile hero"><div class="k">브랜드 컨셉</div><div class="v">'+T.nb+'</div><div class="s">상세 '+fmt(T.det)+'장 + 광고 '+fmt(T.ads)+'건에서 추출</div></div>'+
    '<div class="tile hero2"><div class="k">고객 컨셉</div><div class="v">'+T.nu+'</div><div class="s">리뷰 '+fmt(T.rev)+'건 + UGC '+fmt(T.ugc)+'건에서 추출</div></div>'+
    '<div class="tile"><div class="k">상세페이지</div><div class="v">'+fmt(T.det)+'</div><div class="s">이미지 전량 · 한국어 OCR</div></div>'+
    '<div class="tile"><div class="k">Meta 광고</div><div class="v">'+fmt(T.ads)+'</div><div class="s">브랜드별 라이브러리 전량</div></div>'+
    '<div class="tile"><div class="k">리뷰</div><div class="v">'+fmt(T.rev)+'</div><div class="s">사이트 '+fmt(T.site)+'건 중 '+Math.round(T.rev/T.site*100)+'%</div></div>'+
    '<div class="tile"><div class="k">UGC</div><div class="v">'+fmt(T.ugc)+'</div><div class="s">유튜브 · 네이버 · 틱톡 · 인스타</div></div>'));

  /* ---------- 요약 ---------- */
  var g=function(s,side,sub){return (CON[s][side]||[]).filter(function(c){return c.label.indexOf(sub)>=0})[0]||{}};
  W.appendChild(E('div','panel sum',
    '<p class="d1">브랜드는 성분 이름과 임상 숫자로 컨셉을 짓고, 고객은 분사 입자와 자기 배치 습관으로 컨셉을 짓습니다. 미스트 10종을 상세·광고(브랜드) 대 리뷰·UGC(고객) 네 채널에 나란히 대고 잰 결과입니다.</p><ul>'+
    '<li><b>고객 컨셉 1~3위가 전부 분사입니다.</b> 바이오힐보 리뷰의 '+g('bioheal','user','겔인데 뿌려질까').rev+'%가 <b>"겔인데 뿌려질까"라는 의심에서 출발해 분사력으로 합격을 매기고</b>, 아벤느 리뷰의 '+g('avene','user','입자 고움').rev+'%가 안개 입자를 제품력의 본체로 말하며, 에스트라 리뷰의 '+g('aestura','user','안개분사냐').rev+'%가 "안개분사냐 아니냐"를 두고 극찬과 실망으로 갈립니다. 성분보다 노즐이 먼저 평가받는 카테고리입니다.</li>'+
    '<li><b>브랜드 수치는 리뷰에 도착하지 않습니다.</b> 달바 상세의 '+g('dalba','brand','467배').det+'%가 "모공보다 467배 작은 나노 펩타이드"를 걸지만 리뷰에서는 '+g('dalba','brand','467배').rev+'%, "수분량 356.83% 개선"(상세 '+g('dalba','brand','356.83').det+'%)도 리뷰 '+g('dalba','brand','356.83').rev+'%입니다. 한율 "쑥시카 4배 진정"(상세 '+g('hanyul','brand','쑥시카').det+'%)도 리뷰 '+g('hanyul','brand','쑥시카').rev+'%. 임상 수치는 상세페이지 안에서만 삽니다.</li>'+
    '<li><b>고객은 미스트를 위치로 삽니다.</b> 아누아 리뷰의 '+g('anua','user','작아서 산다').rev+'%가 30ml 미니를 기내·파우치용으로, 디어달리아 리뷰의 '+g('dahlia','user','사무실 책상').rev+'%가 사무실 책상 위 고정 배치로, 에스트라 리뷰의 '+g('aestura','user','겨울템').rev+'%가 겨울템 격리로 말합니다. 클레어스는 헬스장 락커·냉장고('+g('klairs','user','열 많은 사람').rev+'%)까지 갑니다. 어디에 두는 물건인지가 곧 컨셉입니다.</li>'+
    '<li><b>향은 브랜드가 안 만든 축인데 고객이 만듭니다.</b> 디어달리아 리뷰의 '+g('dahlia','user','꽃향기').rev+'%가 브랜드가 한마디도 안 한 꽃향기를 최애 포인트이자 감점 사유로 씁니다. 차앤박에서는 향이 유일한 반대표('+g('cnp','user','에프킬라').rev+'%)이고, 한율은 쑥향의 정체를 놓고 싸웁니다('+g('hanyul','user','향의 정체').rev+'%).</li>'+
    '<li><b>퍼프 사용법은 고객이 만들고 브랜드가 뒤늦게 배웁니다.</b> 아벤느 리뷰의 '+g('avene','user','퍼프·쿠션에').rev+'%가 퍼프에 뿌려 화잘먹을 만드는데 아벤느 상세에는 화장 얘기가 한 줄도 없습니다. 아누아('+g('anua','user','퍼프에 먹인다').rev+'%)·디어달리아('+g('dahlia','user','퍼프에 직접').rev+'%)도 같은 사용법을 스스로 만들었습니다. 메디큐브만 이것을 "청담샵 꿀팁"으로 공식화했습니다(상세 '+g('medicube','brand','퍼프에 미스트를 먹여').det+'%).</li>'+
    '<li><b>정착의 언어는 단계 대체입니다.</b> 에스트라 고객은 이걸 <b>"뿌리는 크림"이라 부르며 토너·스킨 단계를 통째로 대체</b>('+g('aestura','user','뿌리는 크림').rev+'%)하고, 아누아 고객은 미스트를 토너·퍼스트에센스 칸으로 승격('+g('anua','user','승격').rev+'%)시키고, 메디큐브·디어달리아 고객은 "이거 하나로 기초 끝"('+g('medicube','user','스킨 대신').rev+'%·'+g('dahlia','user','기초를 끝낸다').rev+'%)을 선언합니다. 루틴의 한 칸을 차지했다는 말이 재구매 리프트 상위를 전부 채웁니다.</li>'+
    '<li><b>정가 구매는 없습니다.</b> 차앤박 리뷰의 '+g('cnp','user','정가로').rev+'%(UGC '+g('cnp','user','정가로').ugc+'%)가 세일 알림을 구매 시점으로 말하고, 달바 고객은 1+1 더블기획이 만든 배치 습관(집·회사·차)을 씁니다('+g('dalba','user','한 통씩').rev+'%). 미스트는 소모품 리듬으로 팔립니다.</li>'+
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
