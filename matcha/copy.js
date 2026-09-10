/* 요약과 각주. 인용하는 수치는 concept-data.js 에서 런타임에 다시 읽어 데이터와 어긋나지 않게 한다. */
(function(){
  var P=window.P, CON=window.CON, ADS=window.ADS;
  var fmt=function(n){return (n||0).toLocaleString('ko-KR')};
  var g=function(s,side,label){return (CON[s][side]||[]).filter(function(c){return c.label===label})[0]||{}};
  var byslug={}; P.forEach(function(p){byslug[p.slug]=p});
  var T={det:0,detN:0,promo:0,ads:0,ugc:0,rev:0,site:0,nb:0,nu:0,adOn:0};
  P.forEach(function(p){T.det+=p.detailImgs;T.detN+=p.detailN;T.promo+=p.promoN;T.ads+=p.adN;
    T.ugc+=p.ugcN;T.rev+=p.revN;T.site+=p.siteTotal;T.nb+=p.nBrand;T.nu+=p.nUser;if(p.adN)T.adOn++});
  // 같은 브랜드의 광고는 두 제품에 같이 달린다 — 문안은 페이지+본문으로 한 번만 센다.
  var seen={}, kinds=0, matcha=0, MR=/抹茶|マッチャ|MATCHA|matcha/;
  Object.keys(ADS).forEach(function(s){ADS[s].forEach(function(a){
    var k=(a.pg||'')+'||'+(a.b||''); if(seen[k])return; seen[k]=1; kinds++; if(MR.test(a.b||''))matcha++;})});
  var deaf=0; Object.keys(CON).forEach(function(s){CON[s].brand.forEach(function(c){
    if(Math.max(c.rev,c.ugc)<1)deaf++})});

  window.SUMMARY =
  '<p class="d1">말차는 상품명과 상세페이지에 있습니다. 광고에는 없고, 고객 언어에서는 말차보다 여행·용기·체험단이 먼저 나옵니다.</p><ul>'+
  '<li><b>메타 광고 문안 '+kinds+'종 가운데 말차를 말하는 건 '+matcha+'건입니다.</b> 10종 중 '+(10-T.adOn)+'종은 일본 메타 광고가 0건이고, 광고가 잡힌 브랜드는 바닐라코 · VT · 위글리 셋입니다. 바닐라코 광고의 '+g('banila_kit','user','덤과 메가와리가 구매 이유다').ad+'%가 메가와리 · 라쿠텐 세일 안내입니다.</li>'+
  '<li><b>바닐라코 말차 키트는 말차로 팔리지 않습니다.</b> 상세 '+byslug.banila_kit.detailN+'장 중 말차를 말하는 장은 1장, 리뷰 '+fmt(byslug.banila_kit.revN)+'건 중 '+g('banila_kit','user','말차를 말하는 사람은 100명에 두 명이다').rev+'%만 말차를 말합니다. 같은 리뷰의 '+g('banila_kit','user','여행 때문에 산다 (리뷰 절반이 여행을 말한다)').rev+'%가 여행을 말합니다.</li>'+
  '<li><b>포들과 루틴프로젝트의 리뷰는 구매자의 말이 아닙니다.</b> 큐텐 샘플마켓(무상 제공)을 밝힌 리뷰가 포들 '+g('podl','user','리뷰 넷 중 셋은 큐텐 샘플마켓 당첨자다').rev+'%, 루틴프로젝트 '+g('routine','user','리뷰 넷 중 셋은 큐텐 샘플마켓 당첨자다').rev+'%입니다. 두 제품의 사진 리뷰 비중은 '+byslug.podl.photo+'% · '+byslug.routine.photo+'%, 바닐라코 키트는 '+byslug.banila_kit.photo+'%입니다.</li>'+
  '<li><b>냉장고는 상세에 없고 리뷰에 있습니다.</b> 루틴프로젝트는 쿨링 기술과 피부 온도 −6.10℃를 걸면서 냉장 보관은 한 줄도 쓰지 않습니다. 리뷰 '+g('routine','user','냉장고에 넣어 두고 쓴다 (상세에 없는 사용법)').rev+'%가 냉장고에 넣어 쓴다고 적습니다.</li>'+
  '<li><b>택배 박스가 컨셉이 됩니다.</b> 위글리 클렌징 오일 리뷰 '+g('wiggly_oil','user','체리 박스로 도착한다 (여는 순간이 경험이다)').rev+'%가 체리 박스를 말합니다. 상세페이지는 발송인 이름이 Wiggle Wiggle이라는 안내만 싣습니다.</li>'+
  '<li><b>이름에 말차를 걸면 향을 확인합니다.</b> 썸바이미 상세는 찻잎 입자를 더 곱게 갈았다고 쓰는데, 리뷰 '+g('somebymi','user','말차 향이 전혀 안 난다 (그게 산 이유였는데)').rev+'%는 말차 향이 전혀 안 난다고 적습니다. VT도 '+g('vt','user','말차 향은 안 난다 (무향이거나 약초 냄새)').rev+'%가 무향 또는 약초 냄새라고 적습니다.</li>'+
  '<li><b>말차가 눈에 보이는 제품은 하나입니다.</b> JOYIQ는 병 안에 찻잎을 그대로 넣었습니다. 상세 '+g('joyiq','user','병 안에 진짜 찻잎이 보인다 (그래서 샀다)').det+'% 대 리뷰 '+g('joyiq','user','병 안에 진짜 찻잎이 보인다 (그래서 샀다)').rev+'%로, 브랜드보다 고객이 더 많이 말합니다.</li>'+
  '<li><b>사용법은 고객이 만듭니다.</b> 톤28 상세는 2층 제형까지만 쓰고 3WAY라는 말은 쓰지 않는데, 리뷰 '+g('toun28','user','3WAY로 쓴다 (섞기 / 아래층만 / 위층만)').rev+'%가 섞기 · 아래층만 · 위층만 세 가지로 정리해 씁니다. 흔들어 말차 라테 색을 만드는 행위는 리뷰 '+g('toun28','user','흔들면 말차 라테 색이 된다 (보는 재미)').rev+'%가 말합니다.</li>'+
  '<li><b>상세페이지의 일부는 제품이 아닙니다.</b> 전체 '+T.det+'장 중 '+T.promo+'장이 메가와리 매장 배너이고, VT와 썸바이미는 통관 · 관세 안내를 상세에 싣습니다. 바닐라코 파우더는 9장 중 6장이 배너라 제품을 말하는 장이 '+byslug.banila_powder.detailN+'장입니다.</li>'+
  '<li><b>브랜드가 건 '+T.nb+'개 컨셉 중 '+deaf+'개는 고객 언어에 1% 미만입니다.</b></li>'+
  '</ul>';

  window.FOOT =
  '<b>컨셉을 뽑은 방법</b> · 큐텐 상세 이미지 '+T.detN+'장(매장 배너 '+T.promo+'장 제외)을 macOS Vision 일본어 OCR로 텍스트화하고, 메타 광고 라이브러리 JP 문안 '+kinds+'종을 함께 읽어 브랜드가 실제로 내건 문장을 '+T.nb+'개 추렸습니다. '+
  '고객 컨셉 '+T.nu+'개는 리뷰 '+fmt(T.rev)+'건과 UGC '+fmt(T.ugc)+'건에서 그 제품에만 유난히 자주 나오는 표현을 뽑아(일본어는 띄어쓰기가 없어 2~4자 문자 n-gram, 다른 9개 제품 평균 대비 2.2배 이상) 실제 문장을 확인해 정리했습니다.<br>'+
  '<b>퍼센트가 뜻하는 것</b> · 상세 % = 그 문구가 나오는 상세 이미지의 비율, 광고 % = 그 컨셉을 말하는 광고 문안의 비율, 리뷰 % = 그 컨셉을 말한 리뷰의 비율, UGC % = 그 컨셉을 말한 UGC의 비율. '+
  '채널마다 문서 단위가 다르므로 채널 간 절대 비교가 아니라 같은 채널 안에서의 크기와 0 여부로 읽습니다. 바닐라코 파우더는 상세 코퍼스가 '+byslug.banila_powder.detailN+'장, 리뷰가 '+byslug.banila_powder.revN+'건이라 퍼센트가 한 건에 크게 흔들립니다.<br>'+
  '<b>표본</b> · 큐텐 리뷰는 전량입니다 — '+fmt(T.rev)+'건 / 사이트 '+fmt(T.site)+'건. 올리브영처럼 스트림 상한이 없어 10종 모두 100%에 가깝습니다. 대신 일본 리뷰는 짧습니다(제품별 평균 27~187자).<br>'+
  '<b>한국어 병기</b> · 화면에 나오는 일본어 문장 693개에 한국어를 손으로 달았습니다. 회색 줄이 원문, 아래가 한국어입니다.<br>'+
  '<b>광고 라이브러리</b> · 활성 + 종료 전량을 받고 광고주 페이지명으로 걸렀습니다. 일본 라이브러리의 키워드 검색은 브랜드와 무관한 광고를 대량으로 돌려주므로(「トーン28」로 치면 치아 미백 · 주택 시공 광고가 옵니다) 페이지명 필터 없이는 읽을 수 없습니다.<br>'+
  '<b>UGC 주의</b> · 유료 파트너십 · 제품 제공 표기가 섞여 있습니다. 브랜드 토큰이 다른 말 안에 들어앉는 경우(ポドル ⊂ Kポドル, トーン28 ⊂ ダイヤトーン28)와 말차 디저트 영상은 걸러냈고, 브랜드를 말하거나 말차 + 화장품 어휘를 함께 말하는 것만 남겼습니다. 포들 '+byslug.podl.ugcN+'건 · JOYIQ '+byslug.joyiq.ugcN+'건처럼 일본 UGC가 거의 없는 제품이 있습니다.<br>'+
  '<b>OCR</b> · 디자인 글씨체에서 오독이 나므로 개별 문장이 아니라 비율로만 읽습니다. 인용한 상세 문구는 원본 이미지를 확인해 손으로 옮겼습니다.<br>'+
  '<b>올리브영에는 없습니다</b> · 이 10종 가운데 한국 올리브영에서 파는 제품은 0종입니다. 썸바이미 · 바닐라코 · VT · 톤28 · 포들은 올리브영에 있지만 말차 SKU만 없고, 위글리 · JOYIQ · 루틴프로젝트(화장품)는 브랜드 자체가 없습니다. 올리브영에서 「맛차 · 말차 · matcha」를 검색하면 화장품이 아니라 식품이 나옵니다.';
})();
