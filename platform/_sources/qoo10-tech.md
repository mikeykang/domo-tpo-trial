검증 완료. 최종 보고서입니다.

---

# Qoo10 Japan 기술/물류 레이어 리서치 (2026-08-13 실측)

## 0. 핵심 요약

- **QSM API는 "운영 전용(write/ops-only)"이다. 분석용 READ API는 존재하지 않는다.** 매출통계, 트래픽, 키워드, 랭킹 API는 클래스 자체가 없음. 대시보드를 만들려면 데이터는 다른 데서 와야 함. `확실` (실측 검증, 아래 방법 참조)
- API 전체 표면적은 **9개 클래스 / 검증된 30개 메서드**. Amazon SP-API 대비 극도로 작음. 직접 연동 난이도는 낮음.
- API key는 **셀프서브가 아님**. Qoo10 담당창구에 문의 티켓으로 신청 후 심사, 승인까지 영업일 약 5일, **1년마다 갱신 필요**(만료 알림 없음).
- **해외발송(海外発送)은 판매수수료 +2% 가산.** Qoo10 공식 FAQ 명시.
- Qxpress는 폐업하지 않았음. **TracX Logis로 사명 변경**했고 Qoo10 Japan 공식 물류 파트너로 계속 운영 중. `확실` (qxpress.net → tracxlogis.com 302 리다이렉트 실측)

---

## 1. QSM API 실측 스펙

### 1-1. 프로토콜 / 인증

```
POST https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi/<Class>.<Method>

Content-Type: application/x-www-form-urlencoded
GiosisCertificationKey: <인증키>
QAPIVersion: 1.0          # 메서드별로 1.1 등 상이
--data "returnType=application/json&<파라미터>"
```

- REST 유사(POST/GET 모두 가능), SOAP 아님. 응답은 `returnType`으로 **JSON/XML 선택** (`application/json` 또는 `text/xml`). `확실`
- 인증은 **헤더에 인증키 1개**. OAuth 없음, 서명(signature) 없음. `확실`
- 인증키 발급 자체도 API로 가능: `CertificationAPI.CreateCertificationKey`에 `user_id` + `pwd`(셀러 계정 비밀번호)를 넘김. 즉 **연동 시스템이 셀러 평문 비밀번호를 보관**하는 구조. 서드파티 툴들도 전부 "판매자 계정 비밀번호" 입력을 요구함. `확실`
  [출처: https://qiita.com/Mikeinu/items/eef5b88c5e12cc40c34d , https://ec.smaregi.jp/oms/faq/article-list/qoo10_api_manual/]
- **비밀번호 변경 시 인증키가 무효화됨.** [출처: https://goqsystem.com/manual/post?id=4771] `확실`

### 1-2. 검증된 메서드 카탈로그 (실측)

전수 검증했습니다. 클래스는 **9개가 전부**입니다.

```
CertificationAPI.CreateCertificationKey

ItemsBasic.SetNewGoods              # 신규 상품 등록
ItemsBasic.SetNewMoveGoods
ItemsBasic.UpdateGoods
ItemsBasic.UpdateMoveGoods
ItemsBasic.EditGoodsStatus          # 판매상태 변경

ItemsOptions.EditGoodsInventory     # 재고 수정 (가격도 여기)
ItemsOptions.EditGoodsOption
ItemsOptions.EditMoveGoodsInventory

ItemsContents.EditGoodsContents     # 상세페이지 HTML
ItemsContents.EditGoodsImage
ItemsContents.EditMoveGoodsContents

ItemsLookup.GetAllGoodsInfo         # 상품 목록
ItemsLookup.GetItemDetailInfo
ItemsLookup.GetMoveItemDetailInfo
ItemsLookup.GetGoodsOptionInfo
ItemsLookup.GetSellerDeliveryGroupInfo

ShippingBasic.GetShippingInfo       # 주문 조회
ShippingBasic.GetShippingInfo_v2
ShippingBasic.GetShippingInfo_v3    # 현행 권장
ShippingBasic.SetSendingInfo        # 송장번호 등록
ShippingBasic.SetSendingComplete    # 발송완료 처리
ShippingBasic.GetClaimInfo
ShippingBasic.GetClaimInfo_V2
ShippingBasic.GetClaimInfo_V3       # 취소/반품 조회

Claim.SetCancelProcess              # 취소 처리

CSCenter.GetInquiryMessage          # 문의 조회
CSCenter.SetInquiryMessage          # 문의 답변

CommonInfoLookup.GetCatagoryListAll # ★ Category 아님, Catagory (오타가 공식)
CommonInfoLookup.SearchBrand
```

**검증 방법 (재현 가능):** 잘못된 인증키로 호출하면 응답이 3가지로 갈립니다. 이걸 오라클로 써서 자격증명 없이 메서드 존재 여부를 판정했습니다.

| 응답 | 의미 |
|---|---|
| `Can't find service Name <X>` | 클래스 없음 |
| `Can't find method Info <Y>` | 클래스는 있고 메서드 없음 |
| `{"ErrorCode":-90001,"ErrorMsg":"存在しないAPIです。"}` | **둘 다 존재**, 인증키 단계에서 거부 |

약 240개 후보명을 프로브해서 위 30개를 확정했습니다. `확실`

### 1-3. 분석 API는 없다 (가장 중요한 결론)

다음 클래스명을 전부 프로브했고 **전부 `Can't find service Name`** 이었습니다:

```
Settlement / SettlementBasic / SettlementLookup / SettleBasic / AdjustBasic
Stat / Stats / StatBasic / Statistics / StatisticsAPI / SalesStat / StatInfo
Analytics / Report / Rank / Ranking / Traffic / Keyword / Ad / Advertising / Marketing
Review / ReviewBasic / Inquiry / InquiryBasic / QnA
Order* / Category* / Seller* / Promotion* / Coupon* / Delivery* / Product / Goods / Sales
```

추가로 기존 클래스 안에도 `ItemsLookup.GetGoodsStat`, `GetGoodsRank`, `GetGoodsReview`, `GetReviewList`, `GetGoodsTraffic`, `GetSalesStat`, `ShippingBasic.GetSettlementInfo` 등을 프로브했고 **전부 없음**.

**결론: API로 얻을 수 있는 것은 내 상품/내 주문/내 문의뿐입니다.** 정산(精算), 리뷰, 랭킹, 트래픽, 키워드는 API가 없습니다. QSM 화면 또는 FTP/CSV 다운로드로만 접근 가능. `확실`

→ 대시보드를 만들려면 **QSM 화면 스크래핑 또는 CSV 익스포트 파이프라인**이 필수. Amazon SP-API처럼 Reports API로 해결되지 않습니다.

### 1-4. gotchas (실측)

- **HTTP 상태코드는 항상 200.** 에러는 body의 `ErrorCode`(음수)로만 옴. 상태코드 기반 에러핸들링은 전부 실패함. `확실`
- **메서드명은 대소문자 무시.** `ITEMSBASIC.SETNEWGOODS`, `itemsbasic.SetNewGoods` 모두 동작. 버전 접미사도 `_v3`/`_V3` 둘 다 동작. `확실` (실측)
- **`GetCatagoryListAll`의 "Catagory" 오타가 공식 철자.** 올바른 철자 `GetCategoryListAll`은 존재하지 않음. `확실`
- 가격 전용 메서드 없음. `ItemsBasic.UpdateGoodsPrice` / `UpdateGoodsInventory`는 **존재하지 않습니다**(팀리드 스코프에 적힌 이름이지만 실측 결과 없음). 가격/재고는 `ItemsOptions.EditGoodsInventory` 또는 `ItemsBasic.UpdateGoods` 경유. `확실`
- API 문서 사이트(`api.qoo10.jp/.../QAPIGuideIndex.aspx`)는 **QSM 로그인 게이트**. 비로그인 시 `__PAGE_VALUE={"IS_LOGIN":false}`이고 좌측 메서드 목록이 통째로 비어 나옵니다. 파라미터 스펙/에러코드표는 셀러 계정 없이는 못 봅니다. `확실` (실측)
- 문서 내부 백엔드는 `swe_DynamicDataService.asmx/ExecuteToDataTable`에 `QAPI.GetQAPIClassMethodInfo` 등을 호출하는 구조. 비로그인 상태에서는 빈 행 반환. `확실`

### 1-5. Rate limit / sandbox / 버전

- **공개된 rate limit 문서 없음.** 서드파티 연동사 매뉴얼 어디에도 호출 제한 기재가 없음. `불확실` (없다는 게 아니라 미공개)
- **공개 sandbox 없음.** 문서 JS에 `-dev.qoo10.jp`, `-test.qoo10.jp`, `staging-www.qoo10.jp` 문자열이 있으나 Qoo10 내부 환경이며 외부 발급 대상 아님. 테스트는 문서 페이지의 **QAPI Test Form**(로그인 필요)이 유일. `추정`
- 버전은 헤더 `QAPIVersion`으로 지정, 메서드별 기본 1.0 또는 1.1. `_v2`/`_v3` 접미사가 사실상의 메이저 버전. 구버전(`GetShippingInfo`, `GetClaimInfo`)도 **여전히 살아있음**(deprecate 안 됨). `확실`
- **2025-2026 API 변경/deprecation은 확인하지 못했습니다.** 변경이력(Notice/Change History)이 로그인 게이트 뒤에 있음. `불확실`

### 1-6. API key 발급 조건 (공식 문서 원문)

```
API発行条件:
- 出店審査状態が完了していること
- サービスポイント0点以上
- 未処理件がないこと(発送遅延・問合せ未回答・クレーム件)
- 利用目的が明確であること

担当窓口: Qoo10へのお問い合わせ > カテゴリー[システム] > [API・FTP・QSM権限]
  -販売店ID / -メールアドレス / -商品カテゴリ / -API利用目的 / -API連動会社名

※API keyの発行は土日祝日は行っておりません
```
[출처: https://doc.image-qoo10.jp/sqm/JP/guide_APItoFTP_JP.pdf , Update 2022-02 → `확인 필요 (오래된 소스)`. 단 2026년 서드파티 매뉴얼들과 내용 일치]

- 승인 소요 **약 5영업일**. [출처: https://crossma.jp/manual/qoo10-api-first/] `추정`
- **1년마다 갱신 필수, 만료 알림 기능이 Qoo10 측에 없음.** 크로스마 매뉴얼이 "楽天やYahooのようにAPI有効期限を送信する機能がありません"라고 명시. 만료일 자체 관리 필요. `확실`
- API/FTP 개설은 **무료**. `확실`

### 1-7. FTP 대안 (API 없이 대량처리)

```
Host: mxls.image-qoo10.jp   Port: 21
/item        상품정보 등록/수정
/inventory   가격/재고 수정
```
J-QSM > 基本情報 > 販売者権限の管理 > 「FTP接続権限」 신청. 조건은 API와 동일. 대량 상품등록은 이쪽이 현실적. `확실` (단 2022 문서 기준, `확인 필요`)

---

## 2. 서드파티 연동 생태계

### 2-1. Qoo10 공식 소개 목록 (Qoo10大学)

Qoo10이 직접 자사 사이트에 게재한 목록입니다. "인증"이라는 표현은 없고 **소개(販売支援サービス紹介)** 수준입니다.
[출처: https://university.qoo10.jp/system/ , 2026-08-13 접속]

- **일원관리(一元管理):** ネクストエンジン, TEMPOSTAR, CROSS MALL, アシスト店長, ALIS, Zaiko, Wasabi Switch, BOSS, ec店長, zaiko Robot, Robot-in, 特攻店長, 速販UX, マイティ, 店舗アップ, クロスマ, **cafe24**, popinborder
- **물류(3PL):** **TracX Logis**, EXMATE, **POOMGO(품고)**, **KSE**, **STOO**, acrossB, **LX PANTOS**, **SHIPNERGY(쉽너지)**, 京東物流
- 결제: Payoneer

**한국 팀에 중요:** 물류 파트너 9곳 중 5곳(POOMGO, KSE, STOO, LX PANTOS, SHIPNERGY)이 한국계이고, 일원관리에 **cafe24**가 들어있습니다. Qoo10 Japan은 한국 셀러 유입을 전제로 생태계가 짜여 있습니다. `확실`

### 2-2. 일원관리 툴 월 비용

[출처: https://next-engine.net/ec-blog/system-comparison/ , ネクストエンジン 자체 비교글이므로 벤더 편향 주의]

| 툴 | 월 비용 |
|---|---|
| ネクストエンジン | ¥3,000 + 종량 |
| TEMPOSTAR | ¥1,650 ~ 11,000 + 옵션 |
| CROSS MALL | ¥10,000 ~ 25,000 (사이트 수 비례) |
| 助ネコ | ¥2,100 ~ 84,000 |
| アシスト店長 | ¥25,000 ~ 30,000 |
| GoQSystem | ¥15,000 ~ 64,800 |
| LOGILESS | ¥20,000 + 종량 |
| まとまるEC店長 | ¥9,800 ~ |

- GoQSystem의 Qxpress 연계는 별도: **초기 ¥30,000 + 월 ¥20,000**(ロジオプション). CSV 교환 방식이고 **Qxpress 측 API는 사용하지 않음**. [출처: https://goqsystem.com/blog/function/qxpress] `확실`
- SmartShip by TracX Logis의 ネクストエンジン 앱: **초기 ¥0 / 월 ¥3,300**. [출처: https://base.next-engine.org/apps/4591/detail/] `확실`

### 2-3. 한국 툴

- **cafe24**: Qoo10 공식 소개 목록에 등재. `확실`
- **플레이오토(PlayAuto)**: "국내·해외 무제한 쇼핑몰 연동" STANDARD ₩150,000/월. **Qoo10 지원 여부는 확인 실패** (몰 목록이 JS 렌더링). `불확실`
- **사방넷, 셀러툴, 이셀러스**: Qoo10 지원 여부 **확인 실패**. `불확실`

### 2-4. 판정: 직접 연동 vs 툴 구매

**직접 연동을 권합니다.** 근거:

- API 표면적이 30개 메서드뿐이고 인증이 헤더 키 1개입니다. SP-API(서명, LWA 토큰, 레이트 버킷)나 TikTok Shop 대비 훨씬 단순합니다. 이미 두 개를 돌리는 팀이면 **작업량은 며칠 수준**입니다.
- 반대로 툴을 사도 **분석 데이터는 안 나옵니다**(1-3 참조). 툴이 해결해주는 건 주문/재고 동기화뿐인데, 그건 여러분이 이미 가진 역량입니다.
- 단, **물류 대행(3PL)은 사는 게 맞습니다.** 이건 코드로 해결되는 문제가 아닙니다.
- 툴을 산다면 유일한 실익은 **다른 몰(라쿠텐/야후)까지 동시 운영할 때의 통합 재고**입니다. Qoo10 단독이면 툴은 불필요.

---

## 3. 물류 (핵심 섹션)

### 3-1. 海外発送 vs 国内発送

| 항목 | 国内発送 | 海外発送 |
|---|---|---|
| 판매수수료 | 카테고리별 6~10% `추정` | **동일 + 2% 가산** `확실` |
| 배송일수 (한국발) | 2~5일 | **7~14일** (발송 2~5일 + 항공 4~7일 + 통관 2~4일) |
| 구매자 필터 | 「国内発送」 라벨로 식별/필터 가능 | - |
| 발송기한 규칙 | 동일 적용 | **동일 적용, 예외 없음** |

- +2% 가산은 Qoo10 공식 FAQ 명시: "국제 배송 또는 해외 계좌 등록 시 +2%". 출금 수수료 ¥150/건 별도. 메가와리 참가 상품 +1%. [출처: https://university.qoo10.jp/faq/] `확실`
- **출점에 일본 법인/주소는 불필요.** "国籍や住居・拠点に関係なく、どなたでも出店できます" (OFAC 제재국 제외). 통장 명의는 셀러 등록명과 일치해야 함. [출처: https://university.qoo10.jp/faq/] `확실`
- 일본 구매자가 「国内発送」을 명시적으로 선호하고 필터로 거른다는 점은 복수 소스에서 일관됩니다. 다만 **검색 랭킹에 国内発送 가점이 있다는 공식 근거는 찾지 못했습니다.** `불확실`
- 메가와리(메가할인) 기간에는 한국발 배송이 **추가 1~2주 지연**. [출처: https://mobinc.jp/column/2026/04/01/qoo10-delivery-tracking-and-timelines-guide/ , 2026-04-01] `추정`

### 3-2. 발송기한과 페널티 (이게 海外発送의 진짜 장벽)

[출처: https://article-university.qoo10.jp/entry/84 (Qoo10 공식), https://bxo.co.jp/magazine/15545]

```
입금확인일(배송요청일) 기준 3영업일 이내 발송 필수

1단계 注意   : 입금일+3영업일에 미발송 → 독촉 메일
2단계 警告   : 입금일+4영업일 미발송 → 익일 배송지연 포인트 -2점
3단계 制限   : 입금일+5영업일 경과 & 발송률 95% 이하 → 판매정지 + 프로모션 광고 정지
              해제는 적용 31일 후

예약상품: 예약일+3일 경과 & 발송률 95% 이하 → 판매정지 (주말 포함 계산)
```

- **발송률 = 입금 후 3영업일 내 발송 비율.** 95% 라인입니다.
- **海外発送 셀러에 대한 완화 규정은 어떤 소스에서도 발견되지 않았습니다.** 규칙이 동일 적용됩니다. `확실` (부재 확인, 4개 소스 교차)
- 실무 회피책은 **「発送予定日」 입력**입니다. 발송예정일을 넣으면 3영업일을 넘겨도 페널티를 피할 수 있습니다. `추정`
  - **API 함정:** GoQSystem 매뉴얼에 따르면 発送予定日은 API로 쓸 수 없고 QSM 수동 입력이며, 이걸 갱신하면 주문 상태가 「配送要請/配送準備」로 바뀌어 **동기화 전에 건드리면 주문 취득이 안 됩니다**. [출처: https://goqsystem.com/manual/post?id=4771] `확실`

**판단:** 한국 직배송으로 3영업일 발송률 95%를 지키는 것은 물리적으로 가능하지만(발송 처리 시점 기준이므로), 통관/항공 스케줄 변동을 감안하면 **일본 내 재고를 두는 쪽이 구조적으로 안전합니다.**

### 3-3. Qxpress 현황 (2024년 사태 이후)

**결론: 살아있고, 이름만 바뀌었습니다.**

- **Qxpress Corp. → TracX Logis Japan**으로 사명 변경. `qxpress.net`은 현재 `tracxlogis.com`으로 **302 리다이렉트**됩니다. `확실` (직접 실측)
- 법인: 2012년 설립, 자본금 ¥1억, 본사 **치바현 후나바시시**(〒273-0017 船橋市西浦3-4-2). [출처: https://ecnomikata.com/support_company/969/]
- **Qoo10 Japan 공식 물류 파트너**로서 보장배송 서비스 **"KanDash"**(입금 익일 발송 보장, 5일 내 배송)를 운영. [출처: https://www.tracxlogis.com/] `확실`
- 서비스 라인: **SmartShip**(B2C/D2C 국경간), **SmartFulfillment / TXFS**(창고+피킹+포장+출고), SmartPost(C2C), SmartCargo(B2B 포워딩)
- 구 **QWMS → TXFS**로 2025년 전환. `추정`
- **한국 시장 진출에 특히 강점**이라고 자사 표기, 항공/해상 루트 보유. 오사카 센터를 2026년 3월 이전(한국행 해상 서비스에 영향). 2026년 5월 FBA 납품대행 개시. [출처: https://ecnomikata.com/support_company/969/] `추정`
- Smartship은 2026년 1월 기준 Qoo10.jp, Shopee, Coupang 등과 **API 연동** 구현. `추정`
- 요금: **초기비용/월고정비 없음, 완전 종량제, 1 SKU부터**. **구체 단가는 비공개, 견적 문의 필요.** `확실` (구조는 확실, 금액은 미공개)
- 연락처: JP_Sales@tracxlogis.com (평일 9-18시 JST)

**eBay Japan이 대체했는가:** 아니오. eBay Japan(Qoo10 운영사)과 TracX Logis는 별개 법인이고, TracX가 파트너로 남았습니다. `확실`

### 3-4. Qoo10 자체 풀필먼트

Qoo10 Japan이 **직영 창고를 운영하지는 않습니다.** FBA 등가물은 없고, 대신 **TracX Logis(구 Qxpress)에 위탁**하는 구조입니다. 셀러 입장에서는 "Qoo10 공식 물류 = TracX"로 이해하면 됩니다. `추정` (Qoo10 직영 창고의 존재 근거를 찾지 못했고, 공식 물류 소개가 전부 외부 3PL 목록임)

### 3-5. 3PL 옵션

- **TracX Logis (TXFS)**: Qoo10 특화. 치바 본사 + 오사카. 한국 루트 강점. 종량제. Qoo10 셀러의 디폴트 선택지.
- **OPENLOGI (오픈로지)**: 전국 **70거점**, 상온/정온/냉동, 화장품 취급 가능. **Qoo10 연동 확인됨.** 초기/고정비 무료 종량제, 120개국 배송. **단가는 견적제로 비공개.** [출처: https://service.openlogi.com/] `확실`(연동), `확실`(단가 비공개)
- **LOGILESS**: 월 ¥20,000 + 종량. OMS+WMS 일체형.
- **한국계 (Qoo10 공식 목록 등재)**: POOMGO(품고), SHIPNERGY(쉽너지), LX PANTOS, KSE, STOO. 화장품 한국 셀러라면 **여기부터 견적 받는 게 합리적**입니다(한국어 커뮤니케이션 + 한국 출고 연계).
- 富士ロジテック, スクロール360: Qoo10 공식 목록에 **없음**. `확실`(부재)

### 3-6. 배송 단가 (200~400g 토너패드 기준)

**일본 국내 (실측 공식 요금):**

| 서비스 | 규격 | 요금 |
|---|---|---|
| ゆうパケット 1cm 이하 | 3변 60cm, 장변 34cm, 1kg | **¥250** |
| ゆうパケット 2cm 이하 | 동일 | **¥310** |
| ゆうパケット 3cm 이하 | 동일 | **¥360** |
| こねこ便420 (야마토) | 소형, 우편함 투函 | **¥420** (전국 균일, 세금포함) |

[출처: https://www.post.japanpost.jp/service/send/domestic/delivery/yu-packet/ , https://www.kuronekoyamato.co.jp/ytc/customer/send/services/ , 2026-08-13 접속] `확실`

- 토너패드 박스는 두께상 **2~3cm 구간**일 가능성이 높아 **¥310~360** 선. 3PL 계약 시 대량 할인으로 이보다 내려갑니다.
- **주의: ヤマト ネコポス가 야마토 현행 서비스 목록에서 사라졌습니다.** 대신 こねこ便420과 クロネコゆうパケット 체제. 2025-2026 변화로 보이나 완전 폐지 여부는 미확인. `추정` / `확인 필요`
- **추적 없음 → 추적 있음 변경은 사후 불가**(Qoo10 송료 설정 제약). 처음부터 추적 있음으로 설정하십시오. [출처: https://bxo.co.jp/magazine/16450] `확실`

**한국 → 일본 직배송:**

**죄송합니다. 이 부분은 실패했습니다.** WebSearch 세션 예산이 소진(200/200)된 시점 이후여서 우정사업본부 EMS/K-Packet 요금표 페이지를 URL 추정으로 4회 시도했으나 전부 404였습니다. **구체 ₩ 금액을 제시하지 않겠습니다.** 추정치를 지어내는 것보다 공란이 낫다고 판단했습니다. `미확인`

- 정성적으로만: 한국발 직배송은 건당 단가가 일본 내 ゆうパケット(¥250~360)보다 확실히 높고, 여기에 **+2% 수수료**와 **7~14일 리드타임**이 붙습니다. 일본 내 재고 대비 불리한 구조입니다.
- 다음 액션: TracX Logis(JP_Sales@tracxlogis.com)와 한국계 3PL(품고/쉽너지) 양쪽에 200~400g 화장품 기준 견적을 동시에 요청하는 것이 가장 빠릅니다.

### 3-7. 반품 물류

- TracX Logis는 **일본/싱가포르/말레이시아 현지 반품 처리**를 서비스로 제공합니다. [출처: https://www.tracxlogis.com/] `확실`
- **일본 내 반품 주소 의무 규정은 확인하지 못했습니다.** 해외발송 셀러의 반품을 누가 받는지에 대한 Qoo10 공식 규정을 찾지 못했습니다. `미확인`
- 실무적으로는 3PL 계약 시 반품 수취 주소를 함께 확보하는 것이 표준으로 보입니다. `추정`

---

## 4. 데이터 수집 (경쟁 인텔리전스)

### 4-1. 프론트엔드 엔드포인트: 조사 불가 상태

**www.qoo10.jp 스토어프론트가 조사 시점에 다운되어 있었습니다.**

```
2026-08-13 17:38Z 실측
https://www.qoo10.jp/                 → 200 / 1243B / "523 Error" 에러페이지
https://m.qoo10.jp/                   → 동일
https://www.qoo10.jp/gmkt.inc/Goods/  → 동일
https://qsm.qoo10.jp/  (셀러센터)      → 200 / 33,380B  정상
https://api.qoo10.jp/  (QAPI)         → 정상
https://university.qoo10.jp/          → 200 / 288,449B  정상
```

- 내 네트워크와 WebFetch(미국 egress) **양쪽에서 동일한 523**. 15초 간격 3회 재시도 모두 동일. 즉 **우리 IP 차단이 아니라 스토어프론트 자체 장애**로 보입니다. `확실`(관측), `추정`(원인)
- 따라서 **프론트엔드가 호출하는 JSON 엔드포인트를 관측하지 못했습니다.** 지어내지 않겠습니다. `미확인`
- 단, 셀러센터(QSM)와 API 문서가 모두 `swe_DynamicDataService.asmx/ExecuteToDataTable` + `RMSHelper.dynamic` 프레임워크를 쓰는 것을 확인했으므로, **스토어프론트도 같은 계열의 `.asmx` JSON 엔드포인트를 쓸 가능성이 높습니다.** 복구 후 재조사 권장. `추정`

### 4-2. 안티봇

- Cloudflare 뒤에 있음(api.qoo10.jp는 cloudflare, www/qsm은 Akamai edgekey). 
- robots.txt조차 523으로 응답해 정책을 읽지 못했습니다. `미확인`
- Apify의 상용 Qoo10 스크레이퍼가 **proxyConfiguration을 필수 입력으로 받는다**는 점이 프록시 없이는 어렵다는 간접 증거입니다. `추정`

### 4-3. 서드파티 분석 툴

- **Apify "Qoo10 Scraper" (cloud9_ai)**: qoo10.jp 대상. 추출 필드 = 상품명, 가격, 할인, 셀러, 평점, 리뷰수, 이미지. 입력 = `keyword`, `maxResults`(1~500), `proxyConfiguration`. **$3.00 / 1,000 results.** [출처: https://apify.com/cloud9_ai/qoo10-scraper/api] `확실`
  - 주의: **판매량/GMV 추정치는 제공하지 않습니다.** 리스팅 스크레이핑 수준입니다.
- **Nint**: 일본 EC 분석의 표준(라쿠텐/아마존/야후 + 아시아 몰). **Qoo10은 지원하지 않습니다.** [출처: https://www.nint.jp/] `확실`
- **Qoo10 전용 판매량/랭킹 추정 툴은 일본/한국 어느 쪽에서도 발견하지 못했습니다.** 이것 자체가 시사점입니다. Qoo10은 Nint급 서드파티 인텔리전스가 부재한 시장이고, 자체 수집 파이프라인을 만들면 **경쟁 대비 정보 우위를 가질 여지가 있습니다.** `추정` (부재 증명은 아님, WebSearch 예산 소진으로 탐색이 제한됨)

---

## 5. 모순 / 미확인

**모순**

1. **note.com "Qoo10 API Method Names" 기사(2026-05-12)의 SHA256 서명 주장은 틀렸습니다.**
   해당 기사는 "リクエストごとにSHA256署名を生成する必要があります"라고 단언하지만, 실측한 인증은 `GiosisCertificationKey` 헤더 하나이며 서명 파라미터가 없습니다. Qiita 실装 예제와 서드파티 연동사 매뉴얼 전부 서명을 언급하지 않습니다. **AI 생성 콘텐츠로 의심됩니다.** 같은 기사의 "메서드명 오타를 허용하지 않는다"는 주장도 부분적으로 틀렸습니다(대소문자는 무시됨, 실측). 다만 이 기사가 제시한 메서드명 자체(`ShippingBasic.GetClaimInfo_V3`, `Claim.SetCancelProcess`, `CSCenter.GetInquiryMessage`)는 **실측 결과 모두 실재**합니다.
   [출처: https://note.com/vjbussan/n/n7f472e6f0b52 , 2026-05-12]

2. **예약상품 발송기한이 소스마다 다릅니다.** Qoo10 공식(article-university)은 "예약일+3일", EC SUPPOTERZ는 "예약일로부터 2일 이내"라고 씁니다. 공식 쪽을 신뢰하되 실제 계약 전 확인 필요.

3. **팀리드 스코프에 적힌 `ItemsBasic.UpdateGoodsPrice` / `UpdateGoodsInventory` / `ShippingInfo_Update`는 실재하지 않는 메서드명입니다.** 실측 결과 `Can't find method Info`. 어디선가 유입된 부정확한 정보로 보입니다.

**미확인 (정직한 공란)**

- **한국→일본 소포 실단가(EMS/K-Packet/CJ대한통운 국제특송)**: WebSearch 예산 소진으로 요금표 확보 실패. 숫자를 제시하지 않았습니다.
- **API rate limit**: 공개 문서 없음. 미공개인지 무제한인지 불명.
- **2025-2026 API 변경이력/deprecation**: 문서의 Notice/Change History가 QSM 로그인 게이트 뒤에 있어 접근 불가.
- **파라미터 스펙 / 에러코드 전체표**: 동일 사유로 미확보. `-90001` 하나만 실측 확인.
- **프론트엔드 JSON 엔드포인트 및 robots.txt 정책**: 스토어프론트 523 장애로 관측 불가.
- **国内発送의 검색 랭킹 가점 여부**: 구매자 선호는 다수 소스 일치하나, 랭킹 알고리즘 반영 근거는 없음.
- **해외발송 셀러의 일본 내 반품 주소 의무 여부**: Qoo10 공식 규정 미발견.
- **플레이오토/사방넷/셀러툴/이셀러스의 Qoo10 지원 여부**: 몰 목록이 JS 렌더링이라 확인 실패. (cafe24만 Qoo10 공식 목록에서 확인됨)
- **TXFS/OPENLOGI 구체 단가**: 양사 모두 견적제로 비공개.
- **ネコポス 완전 폐지 여부**: 야마토 현행 서비스 목록에서 사라진 것은 확인했으나 폐지 공지는 미확인.

**오래된 소스 플래그**

- `guide_APItoFTP_JP.pdf` = Update 2022-02. `확인 필요 (오래된 소스)`. 다만 2026년 서드파티 매뉴얼들과 발급조건/갱신주기가 일치하여 여전히 유효한 것으로 판단.
- FTP 호스트/경로 정보도 동일 PDF 출처이므로 실제 개설 시 재확인 필요.

**가장 중요한 한 줄:** Qoo10 API로는 대시보드를 못 만듭니다. 연동은 쉽지만(30개 메서드, 헤더 키 1개) 분석 데이터가 API에 아예 없어서, 경쟁/실적 인텔리전스는 QSM 스크래핑 또는 CSV 파이프라인으로 별도 설계해야 합니다.