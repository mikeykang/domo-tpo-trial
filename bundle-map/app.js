/* 동봉만 보는 컨셉맵 — 세럼과 패드를 한 SKU로 함께 파는 5종.
   세럼 자체의 컨셉은 /serum/ 이 같은 방법으로 이미 다룬다. 여기서는 한 상자에 패드가 같이 들어오면 무엇이 달라지는지만 잰다.
   왼쪽 = 브랜드가 동봉을 파는 여섯 가지 방법(카드 문장은 요약이 아니라 매치된 상세 OCR 원문).
   오른쪽 = 고객이 동봉을 말하는 열 가지 방법(분모는 전체 리뷰가 아니라 패드를 언급한 리뷰). */
(function(){
  var P=window.P, CON=window.CON, ADS=window.ADS, UGC=window.UGC, DETAIL=window.DETAIL, PADBLK=window.PADBLK, LIFT=window.LIFT;
  var W=document.getElementById('wrap');
  var byslug={}; P.forEach(function(p){byslug[p.slug]=p});
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  var E=function(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e};
  var fmt=function(n){return (n||0).toLocaleString('ko-KR')};
  var sg=function(n,d){d=d==null?1:d;var v=Math.round(n*Math.pow(10,d))/Math.pow(10,d);return (v>0?'+':'')+v};

  var T={rev:0,det:0,ads:0,ugc:0,site:0,nb:0,nu:0,pad:0,padblk:0};
  P.forEach(function(p){T.rev+=p.revN;T.det+=p.detailImgs;T.ads+=p.adN;T.ugc+=p.ugcN;T.site+=p.siteTotal;
    T.nb+=p.nBrand;T.nu+=p.nUser;T.pad+=p.padN;T.padblk+=p.padBlk});

  var SRC={detail:['상세','sd'],ad:['광고','sa'],both:['상세+광고','sb'],review:['리뷰','sr'],ugc:['UGC','su'],none:['없음','sn']};
  var badge=function(k){var x=SRC[k]||['','']; return '<span class="src '+x[1]+'">'+x[0]+'</span>'};
  var bar=function(v,cls){return '<span class="tk"><i class="'+cls+'" style="width:'+Math.max(v>0?4:0,Math.min(100,v/40*100))+'%"></i></span>'};

  /* ---------- top ---------- */
  W.appendChild(E('div','top',
    '<div><div class="kick">DOMO · CONCEPT MAP · SERUM + PAD BUNDLE</div>'+
    '<h1>세럼에 패드가 같이 들어오면 무엇이 달라지는가</h1>'+
    '<div class="sub">올리브영에서 세럼 본품과 토너패드가 <b>한 SKU로 함께 오는</b> 기획 5종. 세럼 자체의 컨셉은 <a href="../serum/" style="text-decoration:underline">세럼 컨셉맵</a>이 같은 방법으로 다루므로, 이 문서는 <b>동봉에만</b> 자를 댑니다. 왼쪽은 브랜드가 동봉을 파는 방법, 오른쪽은 고객이 동봉을 말하는 방법입니다.</div></div>'+
    '<div class="topmeta"><span>수집 <b class="mono">'+esc(window.COLLECTED)+'</b></span><span>작성 <b>Mikey</b></span></div>'));

  W.appendChild(E('div','row',
    '<div class="tile hero"><div class="k">브랜드 동봉 축</div><div class="v">'+T.nb+'</div><div class="s">제품마다 같은 6축 · 상세 '+fmt(T.det)+'장 + 광고 '+fmt(T.ads)+'건에 대고 측정</div></div>'+
    '<div class="tile hero2"><div class="k">고객 동봉 축</div><div class="v">'+T.nu+'</div><div class="s">제품마다 같은 10축 · 패드를 말한 리뷰에 대고 측정</div></div>'+
    '<div class="tile"><div class="k">패드를 말한 리뷰</div><div class="v">'+fmt(T.pad)+'</div><div class="s">전체 '+fmt(T.rev)+'건의 '+Math.round(T.pad/T.rev*1000)/10+'% · 이게 오른쪽 분모</div></div>'+
    '<div class="tile"><div class="k">패드를 말한 상세</div><div class="v">'+T.padblk+'</div><div class="s">상세 '+fmt(T.det)+'장 중 '+T.padblk+'장뿐 · 아이소이는 0</div></div>'+
    '<div class="tile"><div class="k">리뷰</div><div class="v">'+fmt(T.rev)+'</div><div class="s">사이트 '+fmt(T.site)+'건 중 '+Math.round(T.rev/T.site*100)+'%</div></div>'+
    '<div class="tile"><div class="k">UGC</div><div class="v">'+fmt(T.ugc)+'</div><div class="s">유튜브 검색 상위</div></div>'));

  /* ---------- 패드 언급률 ---------- */
  var padRows=P.slice().sort(function(a,b){return b.padRev-a.padRev});
  var padMax=Math.max.apply(null,P.map(function(p){return Math.max(p.padDet,p.padRev)}));
  W.appendChild(E('div','panel',
    '<div class="ph"><h3>묶어 판 물건을 누가 말하는가 · 「패드」 언급률</h3>'+
    '<div class="hint">왼쪽은 브랜드의 상세 이미지 중 패드를 언급한 비율, 오른쪽은 리뷰 중 패드를 언급한 비율. 문서 단위가 다르므로(상세 한 장 대 리뷰 한 건) 두 값을 빼지 말고, 각 채널 안에서 제품끼리 비교하세요.</div></div>'+
    '<table class="duo"><tbody>'+
    padRows.map(function(p){
      return '<tr><td class="vl">'+p.padDet+'%</td><td class="bl"><i style="width:'+Math.round(p.padDet/padMax*100)+'%"></i></td>'+
        '<td class="lab">'+esc(p.brand)+'<div style="font-size:10px;color:var(--subtle);font-weight:400">'+esc(p.pad)+'</div></td>'+
        '<td class="br"><i style="width:'+Math.round(p.padRev/padMax*100)+'%"></i></td><td class="vr">'+p.padRev+'%</td></tr>';
    }).join('')+
    '</tbody></table>'+
    '<div class="legend" style="margin-top:12px"><span><i class="sw" style="background:var(--claim)"></i>브랜드 · 상세 이미지</span>'+
    '<span><i class="sw" style="background:var(--want)"></i>고객 · 리뷰</span></div>'));

  /* ---------- 상세페이지가 패드를 말한 전부 ---------- */
  var blkHtml='';
  P.forEach(function(p){
    var b=PADBLK[p.slug]||[];
    blkHtml+='<div class="pb"><div class="pbh">'+esc(p.brand)+' <span class="mono">상세 '+p.detailN+'블록 중 '+b.length+'건</span></div>'+
      (b.length? b.map(function(x){return '<div class="pbi"><a href="#" data-img="'+esc(x.img)+'"><img loading="lazy" src="'+esc(x.img)+'" alt=""></a>'+
        '<div><div class="pbn mono">'+x.no+'번째 이미지</div><div class="pbt">'+esc(x.t.slice(0,300))+'</div></div></div>'}).join('')
        : '<div class="pbz">없음. 리스팅 제목은 「'+esc(p.pad)+'」라고 말하는데, 상세 '+p.detailN+'블록 어디에도 패드가 나오지 않습니다.</div>')+
      '</div>';
  });
  W.appendChild(E('div','panel',
    '<div class="ph"><h3>브랜드가 상세페이지에서 패드를 말한 전부 · '+T.padblk+'건</h3>'+
    '<div class="hint">고르지 않았습니다. 상세 '+fmt(T.det)+'장을 OCR해 「패드」가 들어간 블록을 전부 실었습니다. 이미지를 클릭하면 원본이 열립니다.</div></div>'+
    '<div class="pbwrap">'+blkHtml+'</div>'));

  /* ---------- 요약 ---------- */
  var g=function(s,side,sub){return (CON[s][side]||[]).filter(function(c){return c.label.indexOf(sub)>=0})[0]||{}};
  var q4=LIFT.map(function(l){return sg(l.starA-l.starB,2)}).join(' / ');
  var r4=LIFT.map(function(l){return sg(l.reA-l.reB,1)}).join(' / ');
  W.appendChild(E('div','panel sum',
    '<p class="d1">동봉은 만족을 올리지만 정착은 만들지 않습니다. 그리고 다섯 중 셋은 왜 같이 담았는지를 상세페이지에서 한 번도 설명하지 않습니다.</p><ul>'+
    '<li><b>같은 SKU 안에서 패드를 말한 사람의 별점이 일관되게 높습니다.</b> 리뷰 길이 4분위 전부에서 '+q4+'점. 그런데 같은 층화에서 재구매율 차이는 '+r4+'pp로 0 언저리입니다. 좋다고 말하게 만들지만 다시 사게 만들지는 않습니다.</li>'+
    '<li><b>아이소이는 제목에 「+응급진정패드 4매」라 써놓고 상세 '+byslug.isoi.detailN+'블록에서 패드를 한 번도 말하지 않습니다.</b> 여섯 축이 전부 0입니다. 메디큐브도 사실상 0(단 1건은 시험보고서 이미지 OCR 오독). 그래도 고객은 각각 리뷰의 '+byslug.isoi.padRev+ '% · '+byslug.medicube.padRev+'%가 패드를 말합니다.</li>'+
    '<li><b>「함께 쓰세요」가 패드를 가리키는 경우는 드뭅니다.</b> 병행을 권하는 상세 블록은 다섯 제품에 '+P.reduce(function(a,p){return a+g(p.slug,'brand','왜 같이').nAll},0)+'개인데, 그중 패드를 언급한 건 '+P.reduce(function(a,p){return a+g(p.slug,'brand','왜 같이').nPad},0)+'개뿐입니다(넘버즈인 '+g('numbuzin','brand','왜 같이').nPad+' · 바이오던스 '+g('biodance','brand','왜 같이').nPad+'). 나머지는 크림, 응급스팟, 2-way 분사 이야기입니다. 토리든과 아이소이는 병행을 파는데 그 상대가 같은 상자에 든 패드가 아닙니다.</li>'+
    '<li><b>설명하면 고객도 그렇게 말합니다.</b> 넘버즈인 패드 리뷰의 '+g('numbuzin','user','같이 쓴다').rev+'%가 "같이 쓴다"고 합니다(5종 최고). 상세에서 병행을 안 판 메디큐브는 '+g('medicube','user','같이 쓴다').rev+'%, 토리든은 '+g('torriden','user','같이 쓴다').rev+'%입니다.</li>'+
    '<li><b>패드가 유입 경로인 경우가 실제로 있습니다.</b> "패드를 써보고 본품을 샀다"가 아이소이 '+g('isoi','user','먼저였다').rev+'%('+g('isoi','user','먼저였다').n+'건) · 넘버즈인 '+g('numbuzin','user','먼저였다').rev+'%('+g('numbuzin','user','먼저였다').n+'건). 동봉의 방향이 본품→패드가 아니라 패드→본품일 수 있다는 뜻입니다.</li>'+
    '<li><b>브랜드가 「증정」이라 부르면 고객은 값으로 답합니다.</b> "구성이 알차다·가성비"가 토리든 패드 리뷰의 '+g('torriden','user','알차다').rev+'% · 메디큐브 '+g('medicube','user','알차다').rev+'%. 반대로 상세에서 시너지를 판 넘버즈인은 '+g('numbuzin','user','알차다').rev+'%로 가장 낮습니다. 같은 물건인데 부르는 이름이 돌아오는 말을 바꿉니다.</li>'+
    '<li><b>소량 동봉의 실제 용도는 휴대입니다.</b> "여행·외출에 챙긴다"가 바이오던스 '+g('biodance','user','여행').rev+'% · 아이소이 '+g('isoi','user','여행').rev+'%. 본품 유리병을 두고 패드만 들고 나갑니다. 상세페이지에서 이걸 적은 곳은 바이오던스("여행용 겔 패드 10매") 하나입니다.</li>'+
    '<li><b>패드를 더 달라는 말은 거의 없습니다.</b> "패드가 적다·맛보기다"는 5종 합쳐 '+P.reduce(function(a,p){return a+g(p.slug,'user','적다').n},0)+'건입니다. 수량은 쟁점이 아닙니다.</li>'+
    '<li><b>측정의 한계.</b> 「패드」라는 말이 늘 상자 안의 그 패드는 아닙니다. 동봉 단서가 확실한 비율은 바이오던스 '+byslug.biodance.giftShare+'% · 토리든 '+byslug.torriden.giftShare+'% · 아이소이 '+byslug.isoi.giftShare+'% · 메디큐브 '+byslug.medicube.giftShare+'% · 넘버즈인 '+byslug.numbuzin.giftShare+'%. 넘버즈인은 별매 5번 토너패드 이야기가 패드 리뷰의 '+g('numbuzin','user','다른 패드').rev+'%를 차지합니다.</li>'+
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

  function card(c, side, p){
    var echo  = side==='brand'
      ? '<div class="echo"><span class="el">패드 리뷰가 되뇌는 정도</span>'+
        '<span class="eb">리뷰 '+bar(c.rev,'w')+'<b>'+c.rev+'%</b></span>'+
        '<span class="eb">광고 '+bar(c.ad,'c')+'<b>'+c.ad+'%</b></span></div>'
      : '<div class="echo"><span class="el">브랜드가 말하는 정도</span>'+
        '<span class="eb">상세 '+bar(c.det,'c')+'<b>'+c.det+'%</b></span>'+
        '<span class="eb">광고 '+bar(c.ad,'c')+'<b>'+c.ad+'%</b></span></div>';
    var own = side==='brand'
      ? '<span class="own">패드 '+c.nPad+'건 · '+c.detPad+'%'+(c.nAll>c.nPad?'<small> (패드 아닌 매치 '+(c.nAll-c.nPad)+')</small>':'')+'</span>'
      : '<span class="own">'+c.n+'건 · '+c.rev+'%<small> (전체 '+c.revAll+'%)</small></span>';
    var mute = (side==='brand' && c.nPad===0) || (side==='user' && c.n===0) ? ' dead' : '';
    return '<div class="cc'+mute+(side==='user'?' u':'')+'">'+
      (side==='brand' ? (c.img?'<a class="ct" href="#" data-img="'+esc(c.img)+'"><img loading="lazy" src="'+esc(c.img)+'" alt=""></a>':'<span class="ct nt"></span>') : '')+
      '<div class="cm"><div class="ch">'+badge(c.src)+'<b>'+esc(c.label)+'</b>'+own+'</div>'+
      '<div class="cl'+(side==='brand'&&c.det?' ocr':'')+'">'+esc(c.line)+'</div>'+ echo +
      (c.q&&c.q.length?'<div class="cq">'+c.q.map(function(t){return '<div class="quote">'+esc(t)+'</div>'}).join('')+'</div>':'')+
      '</div></div>';
  }

  function draw(s){
    var p=byslug[s], K=CON[s];
    var brand=K.brand.slice().sort(function(a,b){return b.detPad-a.detPad||b.det-a.det});
    var user =K.user.slice().sort(function(a,b){return b.rev-a.rev});
    var mum=brand.filter(function(c){return c.nPad===0}).length;

    pbody.innerHTML=
      '<div class="prod">'+
        '<img class="pimg" src="'+esc(p.img)+'" alt="">'+
        '<div><div class="pt">'+esc(p.fullName)+'</div>'+
        '<div class="pa">'+esc(p.goodsNo)+' · '+esc(p.brand)+' · '+esc(p.serum)+' + '+esc(p.pad)+'</div>'+
        '<div class="plink"><a href="'+esc(p.url)+'" target="_blank">올리브영 상품페이지</a>'+
        '<a href="https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=KR&q='+encodeURIComponent(p.brand)+'&search_type=keyword_unordered" target="_blank">메타 광고 라이브러리</a></div></div>'+
        '<div class="pf">'+
          '<div><div class="k">판매가</div><div class="v">'+esc(p.price)+'<small>원</small></div></div>'+
          '<div><div class="k">수집 리뷰</div><div class="v">'+fmt(p.revN)+'<small> / '+fmt(p.siteTotal)+' · '+p.cov+'%</small></div></div>'+
          '<div><div class="k">패드를 말한 리뷰</div><div class="v">'+fmt(p.padN)+'<small> · '+p.padRev+'%</small></div></div>'+
          '<div><div class="k">그중 동봉 단서</div><div class="v">'+p.giftShare+'<small>%</small></div></div>'+
          '<div><div class="k">패드를 말한 상세</div><div class="v">'+p.padBlk+'<small> / '+p.detailN+'</small></div></div>'+
          '<div><div class="k">별점 · 패드 / 미언급</div><div class="v">'+p.ctlPadStar+'<small> / '+p.ctlOtherStar+'</small></div></div>'+
          '<div><div class="k">재구매 · 패드 / 미언급</div><div class="v">'+p.ctlPadRe+'<small>% / '+p.ctlOtherRe+'%</small></div></div>'+
        '</div></div>'+

      '<div class="board">'+
        '<div class="col">'+
          '<div class="colh ch1"><h3>브랜드가 동봉을 파는 방법 6축</h3>'+
            '<span>상세 '+p.detailN+'블록 + 광고 '+p.adN+'건에 대고 측정 · 숫자는 그 축에 매치되면서 <b>패드를 실제로 언급한</b> 블록 수'+(mum?' · '+mum+'축은 0':'')+'</span></div>'+
          brand.map(function(c){return card(c,'brand',p)}).join('')+
        '</div>'+
        '<div class="col">'+
          '<div class="colh ch2"><h3>고객이 동봉을 말하는 방법 10축</h3>'+
            '<span>분모는 전체 리뷰가 아니라 <b>패드를 언급한 리뷰 '+fmt(p.padN)+'건</b>입니다 (전체 '+fmt(p.revN)+'건의 '+p.padRev+'%)</span></div>'+
          user.map(function(c){return card(c,'user',p)}).join('')+
        '</div>'+
      '</div>'+

      '<div class="cols2">'+
        '<div><div class="ph" style="margin-top:18px"><h3>상세페이지 '+p.detailImgs+'장</h3><div class="hint">클릭하면 원본</div></div>'+
          '<div class="gal">'+(DETAIL[s]||[]).map(function(f,i){return '<a href="#" data-img="'+esc(f)+'"><span class="no">'+(i+1)+'</span><img loading="lazy" src="'+esc(f)+'" alt=""></a>'}).join('')+'</div></div>'+
        '<div><div class="ph" style="margin-top:18px"><h3>Meta 광고 '+p.adN+'건 <span class="mono" style="font-weight:400;color:var(--faint)">· 문안 '+p.adKinds+'종</span></h3><div class="hint">브랜드 단위 검색이라 다른 제품 광고가 섞여 있습니다</div></div>'+
          '<div class="adL">'+(ADS[s]||[]).slice(0,100).map(function(a){
            return '<div class="ad"><div class="adthumb">'+(a.img?'<img loading="lazy" src="'+esc(a.img)+'" alt="">':(a.v?'VIDEO':'—'))+'</div>'+
              '<div><div class="adpg">'+esc(a.pg||'')+(a.n>1?' <span class="w">같은 문안 '+a.n+'건</span>':'')+'</div>'+
              '<div class="adtx">'+esc(a.b||'')+'</div><div class="admeta">'+esc(a.st||'')+(a.cta?' · '+esc(a.cta):'')+'</div></div></div>';
          }).join('')+'</div></div>'+
      '</div>'+
      '<div class="ph" style="margin-top:18px"><h3>UGC '+p.ugcN+'건</h3><div class="hint">유튜브 검색 상위 · 협찬 콘텐츠가 섞여 있습니다</div></div>'+
      '<div class="ug">'+(UGC[s]||[]).slice(0,90).map(function(v){
        return '<a class="ugc" href="'+esc(v.url)+'" target="_blank">'+(v.img?'<img loading="lazy" src="'+esc(v.img)+'" alt="">':'<div class="noimg">'+esc(v.pf.toUpperCase())+'</div>')+
          '<div class="m"><div class="t">'+esc(v.t||v.d.slice(0,70))+'</div><div class="c"><span>'+esc(v.ch||'')+'</span><b>'+esc(v.vw||'')+'</b></div></div></a>';
      }).join('')+'</div>';
  }
  draw(P[0].slug);

  /* ---------- 동봉이 무엇을 바꾸나 ---------- */
  W.appendChild(E('div','panel',
    '<div class="ph"><h3>동봉은 만족을 올리고 정착은 못 만든다</h3>'+
    '<div class="hint">같은 SKU 안에서 패드를 말한 리뷰 대 안 말한 리뷰. 긴 리뷰가 패드도 더 말하고 별점도 다르므로 리뷰 길이 4분위 안에서 비교했고, 재구매 어휘가 본문에 든 리뷰는 뺐습니다.</div></div>'+
    '<div class="mapscroll"><table><thead><tr><th>리뷰 길이</th><th class="n">패드 언급 n</th><th class="n">별점</th><th class="n">미언급 n</th><th class="n">별점</th><th class="n">별점 차이</th>'+
    '<th class="n">재구매 · 패드</th><th class="n">재구매 · 미언급</th><th class="n">재구매 차이</th></tr></thead><tbody>'+
    LIFT.map(function(l){return '<tr><td><b>Q'+l.band+'</b> '+l.lo+(l.hi?'~'+l.hi:'자 이상')+(l.hi?'자':'')+'</td>'+
      '<td class="n dim">'+fmt(l.nA)+'</td><td class="n">'+l.starA.toFixed(2)+'</td>'+
      '<td class="n dim">'+fmt(l.nB)+'</td><td class="n">'+l.starB.toFixed(2)+'</td>'+
      '<td class="n" style="color:var(--up)"><b>'+sg(l.starA-l.starB,2)+'</b></td>'+
      '<td class="n">'+l.reA+'%</td><td class="n">'+l.reB+'%</td>'+
      '<td class="n" style="color:var(--subtle)">'+sg(l.reA-l.reB,1)+'pp</td></tr>'}).join('')+
    '</tbody></table></div>'+
    '<p>별점은 네 개 층 모두에서 같은 방향으로 오르고, 재구매는 층마다 부호가 뒤집히며 0 언저리에 머뭅니다. '+
    '이건 <a href="../bundle/" style="text-decoration:underline">동봉 스펙 문서</a>의 리쥬란 자연실험(한 리스팅 안에서 세트 759건 대 패드단품 1,378건)과 방법이 다른데 결론이 같습니다.</p>'+
    '<div class="mapscroll" style="margin-top:12px"><table><thead><tr><th>제품</th><th>동봉 패드</th><th class="n">패드 리뷰</th><th class="n">별점 패드/미언급</th><th class="n">재구매 패드/미언급</th></tr></thead><tbody>'+
    P.map(function(p){return '<tr><td><b>'+esc(p.brand)+'</b></td><td>'+esc(p.pad)+'</td>'+
      '<td class="n dim">'+fmt(p.ctlPadN)+'</td>'+
      '<td class="n">'+p.ctlPadStar.toFixed(2)+' / '+p.ctlOtherStar.toFixed(2)+' <span class="mono" style="color:var(--up)">'+sg(p.ctlPadStar-p.ctlOtherStar,2)+'</span></td>'+
      '<td class="n">'+p.ctlPadRe+'% / '+p.ctlOtherRe+'% <span class="mono" style="color:var(--subtle)">'+sg(p.ctlPadRe-p.ctlOtherRe,1)+'pp</span></td></tr>'}).join('')+
    '</tbody></table></div>'+
    '<p style="font-size:11.5px">토리든의 재구매 +13.6pp는 패드 리뷰가 55건뿐이라 잡음입니다. 그래서 제품별 표가 아니라 위의 층화 표로 읽어야 합니다.</p>'));

  /* ---------- 크로스 판독 ---------- */
  var mute=[], loud=[];
  P.forEach(function(p){ CON[p.slug].brand.forEach(function(c){
    (c.nPad===0?mute:loud).push({b:p.brand,c:c}); }); });
  loud.sort(function(a,b){return b.c.nPad-a.c.nPad||b.c.detPad-a.c.detPad});
  var topUser={};
  P.forEach(function(p){ topUser[p.slug]=CON[p.slug].user.slice().sort(function(a,b){return b.rev-a.rev})[0]; });

  W.appendChild(E('div','panel',
    '<div class="ph"><h3>5개 제품을 겹쳐 보면</h3><div class="hint">같은 6축 · 10축을 다섯 제품에 똑같이 댔습니다.</div></div>'+
    '<div class="three">'+
    '<div class="box"><div class="bt"><i class="dotc" style="background:var(--claim)"></i>브랜드가 상세에서 실제로 쓴 동봉 화법 '+loud.length+'개</div>'+
      '<div class="bs">그 축에 매치되면서 패드를 실제로 언급한 블록이 있는 경우만.</div><ul>'+
      loud.map(function(o){return '<li><b>'+esc(o.b)+'</b> '+esc(o.c.label.split(' · ')[0])+' <span class="mono" style="color:var(--claim)">'+o.c.nPad+'블록 · '+o.c.detPad+'%</span></li>'}).join('')+
      '</ul></div>'+
    '<div class="box"><div class="bt"><i class="dotc" style="background:#bfbfbf"></i>패드 이야기가 아예 없는 축 '+mute.length+'개</div>'+
      '<div class="bs">30개 축(5제품 × 6축) 중 '+mute.length+'개. 괄호는 패드 아닌 것으로 매치된 블록 수입니다.</div><ul>'+
      mute.map(function(o){return '<li><b>'+esc(o.b)+'</b> '+esc(o.c.label.split(' · ')[0])+(o.c.nAll?' <span class="mono" style="color:var(--faint)">(패드 아닌 매치 '+o.c.nAll+')</span>':'')+'</li>'}).join('')+
      '</ul></div>'+
    '<div class="box"><div class="bt"><i class="dotc" style="background:var(--want)"></i>제품마다 고객이 가장 많이 하는 동봉 이야기</div>'+
      '<div class="bs">패드 리뷰 안에서 1위인 축.</div><ul>'+
      P.map(function(p){var c=topUser[p.slug];
        return '<li><b>'+esc(p.brand)+'</b> '+esc(c.label.split(' · ')[0])+' <span class="mono" style="color:var(--want)">'+c.n+'건 · '+c.rev+'%</span></li>'}).join('')+
      '</ul></div></div>'));

  /* ---------- foot ---------- */
  W.appendChild(E('div','foot',
    '<b>이 문서의 범위</b> · 세럼 자체의 컨셉(성분·임상·제형·효능)은 같은 방법으로 <a href="../serum/" style="text-decoration:underline">세럼 컨셉맵</a>에서 다뤘습니다. 여기서는 동봉만 봅니다. '+
    '고른 기준은 세럼/앰플 본품과 토너패드가 <b>한 SKU로 함께 오는</b> 기획 상품, 브랜드 중복 제외, 리뷰 최다순 5종입니다.<br>'+
    '<b>축을 정한 방법</b> · 브랜드 6축은 상세 OCR '+fmt(T.det)+'장을 읽고 「동봉을 파는 방법」으로 분류될 수 있는 화법을 뽑은 것이고, 다섯 제품에 똑같이 댔습니다. '+
    '고객 10축은 패드를 언급한 리뷰 '+fmt(T.pad)+'건을 읽고 반복되는 말을 뽑은 것입니다. 축은 제품마다 다르지 않으므로 제품끼리 바로 비교됩니다.<br>'+
    '<b>분모</b> · 브랜드 축의 상세 %는 상세 블록 중 비율, 광고 %는 광고 문안 중 비율입니다. 고객 축의 %는 <b>패드를 언급한 리뷰 중</b> 비율이고, 괄호 안 작은 숫자가 전체 리뷰 중 비율입니다. 건수를 함께 실은 이유는 토리든처럼 패드 리뷰가 66건뿐인 제품에서 %만 보면 잡음을 크게 읽기 때문입니다.<br>'+
    '<b>브랜드 카드의 문장</b> · 제가 요약한 문장이 아니라 그 축에 매치된 상세 OCR 블록 원문 그대로입니다(가장 긴 블록, 190자에서 자름). 디자인 글씨체 오독이 섞여 있으니 문장이 아니라 비율로 읽고, 원본은 썸네일을 눌러 확인하세요.<br>'+
    '<b>광고는 SKU가 아니라 브랜드 단위입니다</b> · Meta 광고 라이브러리는 브랜드 이름으로만 검색되므로 광고 '+fmt(T.ads)+'건에는 다른 제품 광고가 섞여 있습니다. 광고 %는 브랜드가 지금 무엇을 밀고 있는지로 읽고, 이 SKU의 주장으로 읽지 않습니다.<br>'+
    '<b>「패드」가 늘 그 패드는 아닙니다</b> · 동봉 단서(증정·사은품·같이 온·N매 등)가 확실한 비율은 제품별로 '+byslug.numbuzin.giftShare+'~'+byslug.biodance.giftShare+'%입니다. 나머지는 별매 패드이거나 판별 불가입니다. 「동봉 패드가 아니라 다른 패드 이야기」 축을 따로 둔 이유입니다.<br>'+
    '<b>표본</b> · 리뷰는 올리브영 리뷰 API를 정렬 · 리뷰유형 · 피부타입 · 피부톤으로 층화해 받았습니다. 스트림당 서버 상한이 있어 100%는 도달할 수 없습니다(수집률 '+Math.round(T.rev/T.site*100)+'%). '+
    '인용한 리뷰는 저장된 원문 그대로이며 작성자 식별정보는 수집하지 않았습니다.'));

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
