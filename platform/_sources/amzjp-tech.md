The research is complete. Full report:

---

# Amazon.co.jp 랭킹 / 광고 / 브랜드도구 / SP-API 리서치 (2026-08-13 기준)

## 0. 먼저 알아야 할 3가지

- **Rufus는 곧 사라진다.** 2025-09-02 일본 전면 출시 → 2026-05-13 Amazon이 Rufus 브랜드를 폐지하고 `Alexa for Shopping`으로 통합 발표. 미국은 이미 교체 완료, **일본 포함 미국 외 출시 일정은 미발표**. [출처: https://www.itmedia.co.jp/news/articles/2605/14/news089.html, 2026-05-14] `확실`
- **한국 상표로는 JP 브랜드 등록이 안 된다.** 일본 마켓플레이스는 **일본 특허청(JPO) 상표**가 필요. 단 등록 완료 전이라도 **출원번호만 있으면 신청 가능**. [출처: https://jagoo.co.jp/column/amazon-brand-registry/, 2026] `확실`
- **화장품 수입 판매 자체가 게이트다.** 일본에서 해외 화장품을 판매하려면 판매자가 `化粧品製造販売業許可` + `化粧品製造業許可`를 보유해야 하고, 품목별 `製造販売届出`이 선행되어야 함. 무허가 수입 판매는 위법. Amazon 이전에 약기법(薬機法) 문제. [출처: https://www.cyber-records.co.jp/amazon-cosmetics-listing-restrictions/, 2025] `확실`

---

## 1. 검색 / 랭킹 알고리즘 2026

### 1-1. 기본 구조는 여전히 A9 (관련성 × 실적)

- 순위는 **관련성 스코어**(타이틀/불릿/상품설명/백엔드 키워드의 검색어 일치) × **퍼포먼스 스코어**(판매실적, CTR, CVR, 리뷰, 재고, 가격)로 결정. "A9의 최대 특징은 **그 상품이 구매될 확률**을 가장 중시하는 점". [출처: https://www.nint.jp/blog/amazon-seo/, 2026] `확실`
- "COSMO / Rufus가 들어왔지만 **토대는 계속 A9(관련성 × 퍼포먼스)**"이 일본 대행사들의 공통 정리. [출처: https://www.nint.jp/blog/amazon-seo/, 2026] `확실`
- 소위 A10 프레이밍에서 가중치 순위: ① 최근 판매속도 + CVR (최강 신호) ② **외부 트래픽**(SNS/블로그/YouTube 유입, A10에서 가중치 증가) ③ 광고 없는 오가닉 판매 실적 ④ 리뷰 ⑤ 재고 안정성("재고 소진 시 평가는 즉시 하락") ⑥ 가격 경쟁력. [출처: https://aidaim.co.jp/amazon-seo/, 2026] `추정` (A10은 Amazon 공식 명칭이 아니라 업계 통칭)
- 신규 ASIN 콜드스타트 실무: **롱테일 키워드로 초기 실적 축적 → Vine으로 리뷰 가속 → 광고로 판매 부스트**. [출처: https://proteinum.co.jp/blog/amazon-searchranking/, 2026] `추정`

### 1-2. Rufus (일본 현황)

| 항목 | 내용 |
|---|---|
| 일본 출시 | 2025-09-02, Amazon.co.jp + Amazon Business 전체 고객 [출처: https://ecnomikata.com/ecnews/ecmall/48098/, 2025-09] `확실` |
| 규모 | 2025년 3억+ 사용자, 연환산 약 $12B 추가 매출 기여 (글로벌) [출처: https://www.itmedia.co.jp/news/articles/2605/14/news089.html, 2026-05-14] `추정` |
| 종료 | 2026-05-13 발표, `Alexa for Shopping`으로 통합. 일본 전환 일정 미발표 `확실` |

- **Rufus가 읽는 것**: 상품정보(타이틀/불릿/상품설명), 이미지·동영상, 리뷰 **본문**(별점이 아니라 내용을 요약), Q&A, 랭킹, 배송옵션을 종합. [출처: https://www.axalpha.com/blog/amazon-rufus/ · https://sobani.co.jp/columnlist/amazon-rufus, 2026] `추정`
- **리스팅 작성 함의**: 키워드 나열이 아니라 **상황·용도 서술**. "이 스피커는 파티에 최적입니다" 같이 구매자가 던질 질문에 직접 답하는 문장을 넣을 것. A+ 콘텐츠의 비교표 / 인포그래픽 텍스트 / FAQ 형식이 파싱에 유리. [출처: https://sobani.co.jp/columnlist/amazon-rufus, 2026] `추정`
- **외부 SNS 유입이 브랜드 신뢰도로 AI에 평가된다**는 서술. [출처: 동일] `불확실`
- **트래픽 영향 증거는 없음.** 일본 대행사들도 "아직 시험 운용 단계, 기존 검색 행동을 완전히 대체하지 못함"이라고 기술. 정량 데이터 0건. [출처: https://www.axalpha.com/blog/amazon-rufus/, 2026] `확실` (데이터가 없다는 사실이 확실)

### 1-3. COSMO / semantic search

- COSMO = Amazon의 commonsense knowledge 엔진. 검색 관련성 / 추천 / 검색 내비게이션에 배포. 쿼리의 **의미**를 이해하며, "shoes for a wedding"에서 정장 구두를 추론. [출처: https://www.zonguru.com/blog/amazon-cosmo-guide · https://salesduo.com/blog/amazon-cosmo-algorithm/, 2026] `추정` (Amazon 공식 문서가 아니라 논문 + 벤더 해설 기반)
- 키워드 전략 변화: 키워드 밀도 < 리스팅이 "이 제품이 무엇을 하고, 누구를 위한 것이며, 어떻게 쓰이는지"를 정확히 전달하는가. 반복 키워드 스터핑은 플래그 대상. **A+ 콘텐츠의 alt-text와 구조화 텍스트 모듈까지 파싱**해서 관련성 판정에 씀. [출처: https://www.xnurta.com/blog/how-to-optimize-your-keyword-strategy-with-amazons-cosmo-algorithm, 2025] `불확실` (벤더 주장, Amazon 미확인)
- 타이틀 200자 제한, 특수문자 제한, 반복 키워드 스터핑 플래그. [출처: 동일] `추정`
- **일본어 쿼리에서 COSMO가 어떻게 동작하는지에 대한 공개 자료는 0건.** 일본 대행사 글도 전부 미국 논의를 번역한 수준. `확실`

### 1-4. 일본 고유 요인

- **포인트는 카트(추천출품) 알고리즘에 직접 들어간다.** 실질 가격 계산식 = `상품가격 + 배송비 - 포인트액`. 포인트 부여율을 올리면 실질가가 내려가 카트 획득에 유리. [출처: https://jagoo.co.jp/column/amazon-cart/, 2026] `확실`
- 포인트는 **판매자 부담으로 개별 설정 가능**(마켓플레이스 출품자가 자기 상품 포인트율을 스스로 설정). 관리 UI는 `ポイントセントラル`로 통합됨. [출처: https://proteinum.co.jp/blog/amazon-recommended-listing/ · https://ecnomikata.com/column/38369/, 2026] `확실`
- **대형 세일의 포인트업 캠페인 재원은 Amazon 부담이 기본** → 판매가를 안 내리고 매출을 올리는 레버. 월 1~2회 개최. [출처: https://bxo.co.jp/magazine/15008, 2025] `추정`
- 검색 필터에 "포인트 대상 상품" 항목이 있어 **노출 필터 통과 여부**로도 작동. [출처: https://www.busoken.com/blog/amazon/, 2025] `추정`
- 포인트가 **오가닉 검색 순위**에 직접 들어간다는 근거는 못 찾음. 카트/실질가 경로로 간접 영향으로 보는 게 안전. `불확실`
- **배송일수가 일본에서 다르게 가중된다는 근거는 못 찾음.** Prime 배지는 CVR 경로로 작동한다는 서술만 존재. [출처: https://proteinum.co.jp/blog/amazon-searchranking/, 2026] `불확실`

### 1-5. 카트박스(カート獲得 / 현 "おすすめ出品") 규칙

- 필수 3조건: ① **大口出品**(프로 계정) 등록 ② 퍼포먼스 지표 ③ 일정 주문 실적. [출처: https://jagoo.co.jp/column/amazon-cart/, 2026] `확실`
- 임계값 (일본 공개 기준):
  - `注文不良率` 1% 미만 (60일)
  - `出荷遅延率` 4% 미만 (10~30일)
  - `キャンセル率` 2.5% 미만 (7일)
- 판매 실적 임계값은 카테고리별로 **비공개**. 조건을 다 채워도 카트 획득이 보장되지 않음. [출처: 동일] `확실`
- FBA 이용은 평가 개선 + Prime 배지로 카트 확률 상승. [출처: 동일] `확실`

### 1-6. 相乗り出品(피기백) 대책 — K뷰티 최대 리스크

이번 리서치에서 가장 중요한 반전입니다.

- **브랜드 등록만으로는 피기백을 못 막는다.** 지적재산권 침해 신고는 "상대가 피기백이라서" 또는 "전매업자라서"로는 근거 부족. **허위 신고로 간주되면 소송/영업방해 리스크 + Brand Registry 등록 자체가 삭제될 수 있음.** [출처: https://bxo.co.jp/magazine/2210, 2025] `확실`
- 브랜드 등록이 실제로 주는 것은 **카탈로그 편집권 독점(카탈로그 락)**: 타이틀/이미지/불릿/설명을 브랜드 소유자 외에는 시스템 레벨에서 변경 차단. 피기백 출품 자체를 막는 기능은 아님. [출처: https://eresa.co.jp/column/amazon-brand-registry-guide/, 2026] `확실`
- **실질적 하드 블록 = Transparency 프로그램.** 제조 단계에서 상품 1개마다 고유 코드(QR)를 부여, 코드 없는 재고는 판매가 막힘. 2026년 일본 피기백 대책 트렌드가 "Transparency 참가 + 시리얼 넘버 관리"로 이동 중. [출처: https://eresa.co.jp/column/amazon-brand-registry-guide/ · https://itsumo365.co.jp/blog/post-7692/, 2025-2026] `추정`
- Transparency 일본 개시 **2020-10-01**. 10개국(일본 포함) 제공, 1만+ 브랜드 참여, 50만점+ 위조품 차단. 코드 단가는 이 자료에 없음. [출처: https://prtimes.jp/main/html/rd/p/000001196.000004612.html, 2020-10-01] `확실` / `확인 필요 (오래된 소스)`
- Project Zero 일본 제공 중. 셀프서비스 삭제 툴 + 자동 보호는 무료. [출처: https://www.aboutamazon.jp/news/company-news/amazon-launches-counterfeit-eradication-project-zero-in-japan] `확실` / `확인 필요 (오래된 소스)`
- 현실적 대책 순서: **오리지널/세트 구성으로 신규 ASIN 생성 → 상표 등록 → 브랜드 등록(카탈로그 락) → Transparency**. 가격 인하는 가장 직접적이지만 이익을 갉아먹는 방어책. [출처: https://itsumo365.co.jp/blog/post-7692/, 2025] `추정`

---

## 2. Amazon Ads Japan

### 2-1. 2026년 일본에서 쓸 수 있는 광고

| 광고 유형 | JP 제공 | 브랜드 등록 |
|---|---|---|
| スポンサープロダクト (SP) | O | **불필요** |
| スポンサーブランド (SB) | O | **필요** (+ 최소 3 ASIN) |
| スポンサーディスプレイ (SD) | O | 불필요 `불확실` |
| スポンサーTV | O (2024-11 릴리스, 2025-03-24 시점 일본은 Twitch 배신) | 필요 `추정` |
| Amazon DSP | O (Prime Video / Netflix 인벤토리 2025 Q4부터 일본 포함) | - |
| ブランドストア | O, **무료** | 필요 |
| Posts | O | 필요 |

[출처: https://salesduo.com/blog/amazon-ad-types-guide/ · https://value-creation.jp/knowledges/amazonad_sponsortv/ · https://itsumo365.co.jp/blog/post-22835/ · https://blog.goaltech.co.jp/articles/11/ · https://advertising.amazon.com/ja-jp/solutions/products/stores, 2025-2026] `추정`

- **SP는 브랜드 등록 없이 실행 가능**(프로 계정 + 카트 획득 가능 상태). SB는 브랜드 등록 필수 + 최소 3 ASIN. [출처: https://digigyor.com/blog/amazon-ads-eligibility/, 2026] `추정`
- SD의 브랜드 등록 요건은 소스 간 충돌. 영어권 자료는 "불필요", 일본 실무 안내는 "필요" 경향. `불확실`
- Netflix 인벤토리: Amazon Ads x Netflix 제휴 2025-09-10 발표, 일본 포함 11개국, 2025 Q4 개시. [출처: https://blog.goaltech.co.jp/articles/45/, 2026] `추정`
- **新しいプロダクトキャンペーン(New Product Campaigns)는 일본에서 못 씀.** 공식 페이지: "현시점 대상은 브랜드 등록 완료한 **미국의** 출품자/거래기업/브랜드/대행사, CPG·소모품·하드라인 카테고리". DSP 최소 $150,000. [출처: https://advertising.amazon.com/ja-jp/solutions/products/new-product-campaigns] `확실`

### 2-2. 실제 CPC / ACoS 벤치마크 (일본, 2026)

일본 뷰티 카테고리 CPC 실측 레인지 확보. 이번 리서치에서 가장 실용적인 숫자입니다.

| 카테고리 | CPC 레인지 | 경쟁도 |
|---|---|---|
| サプリメント | **100 ~ 500엔+** | 최고 |
| ヘルス&パーソナルケア | **50 ~ 150엔** | 높음 |
| **ビューティー** | **40 ~ 120엔** | 높음 |
| ホーム&キッチン | 20 ~ 60엔 | 중간 |
| ファッション | 10 ~ 40엔 | 낮음~중간 |

[출처: https://funnel-inc.jp/blog/amazon/ads/cpc-optimization, 2026] `추정` (대행사 자체 집계, Amazon 공식 아님)

- **Q4(10~12월)에는 통상기의 1.5~2배**로 상승. 프라임데이도 동일 패턴. [출처: 동일] `추정`
- CTR 벤치마크: **美容・化粧品 0.5 ~ 0.7%**. 광고 타입별 평균 SP 0.4~0.5% / SB 0.3~0.4% / SD 0.2~0.3%. [출처: https://markenote.jp/article/3588, 2025] `불확실` (데이터 출처 미명기)
- ACoS 목표: 일반론 20~30%, ROAS 300~500%. 손익분기는 조이익률 40%일 때 ROAS 250%. [출처: https://itsumo365.co.jp/blog/post-1380/ · https://funnel-inc.jp/blog/amazon/ads/cpc-optimization, 2025-2026] `추정`
- **미국 대비 직접 비교 데이터는 존재하지 않음.** 다만 일본 CPC 절대값은 미국($0.80~$1.50 = 약 120~230엔)보다 낮은 레인지로 보임. `불확실`
- "평균 CPC 5~10엔"이라 쓴 일본 기사가 다수 검색되는데, **오래된 값이거나 저경쟁 카테고리 기준**. 뷰티 예산 산정에 쓰면 안 됨. `확인 필요 (오래된 소스)`
- Amazon Ads 공식 일본 뷰티 페이지에 **CPC/ACoS 벤치마크 없음**. 유일한 일본 숫자는 사례 1건("일본 뷰티 브랜드가 동영상 제작 아웃소싱으로 동영상 광고 CPC 11% 삭감"). 나머지 통계는 전부 미국 Kantar/Amazon 조사(2021). [출처: https://advertising.amazon.com/ja-jp/solutions/industries/beauty] `확실` / 2021 수치는 `확인 필요 (오래된 소스)`

### 2-3. Amazon Vine 先取りプログラム (일본, 2026)

| 제공 점수 (부모 ASIN당) | 등록 수수료 |
|---|---|
| 1 ~ 2점 | **0엔** |
| 3 ~ 10점 | **10,000엔** |
| 11 ~ 30점 | **22,000엔** |

[출처: https://funnel-inc.jp/blog/amazon/vine, 2026 · https://www.hideandseek.co.jp/archives/7954, 2025 · https://www.axalpha.com/blog/vine新価格変更内容とオススメの活用方法/] `확실` (2023-10-19 개정, 2025~2026 자료로 재확인)

- **참가 조건**: 大口出品 계정 + **Amazon 브랜드 등록 완료** + FBA 재고 + **리뷰 30건 미만** + 신품. 성인용품/디지털/대형 상품 제외. [출처: https://funnel-inc.jp/blog/amazon/vine, 2026] `확실`
- **유닛 캡 = 부모 ASIN당 최대 30점 / 최대 30리뷰.** [출처: 동일] `확실`
- **과금 시점**: 첫 리뷰 게시 시 과금. 90일 이내 리뷰가 하나도 안 달리면 **무과금**. [출처: 동일] `추정`
- 실비: 등록 수수료 외 **상품 원가(무상 제공) + 판매수수료 + FBA 수수료** 전액 부담.
- **등록 후 구분 변경 불가**, **Vine 등록한 부모 ASIN에 나중에 자식 ASIN 추가 불가**. [출처: https://www.axalpha.com/blog/vine新価格変更内容とオススメの活用方法/] `확실`
- 2026 변경: **베리에이션 상품의 리뷰 통합 공유 폐지.** ASIN마다 개별 Vine 등록 필요. 토너패드를 사이즈/타입 SKU로 여러 개 낼 계획이면 비용이 곱해집니다. [출처: https://funnel-inc.jp/blog/amazon/vine, 2026] `추정` (단일 소스, 비용 영향 커서 교차 검증 필요)
- FBA新商品特典プログラム 참가 시 Vine 등록 수수료 **25% 할인**(3~10점 구간). [출처: https://sellercentral.amazon.co.jp/seller-forums/discussions/t/7940fcb1-bc76-4372-aa90-222fd502b03d] `추정`
- 리스크: 저평가 리뷰가 그대로 붙음. 30점 신청해도 전부 리뷰가 달리지는 않음. [출처: https://www.hideandseek.co.jp/archives/7954, 2025] `확실`

### 2-4. 신상품 프로그램 / 세일 / 수수료

**FBA新商品特典プログラム / 신규 출품자 특전**:
- 스폰서프로덕트 광고 크레딧 **22,000엔**
- 대상 신규 FBA ASIN의 재고보관 + 반송/소유권포기 수수료 일정기간 무료
- 첫 ASIN 출품 후 12개월 내 신규 쿠폰 등록 시 **쿠폰 크레딧 5,500엔**
- 조건: 2022-01-01 이후 개설한 大口出品 계정
[출처: https://ecstarslab.com/blog/fba-new-products-privilege-program/ · https://bxo.co.jp/magazine/16064] `추정` / `확인 필요 (오래된 소스)` — 2026 현행 조건 미검증

**타임세일 수수료 (일본, 2026)**:

| 종류 | 참가 방법 | 수수료 |
|---|---|---|
| 特選タイムセール | Amazon 초대제 | **무료** (판매/FBA 수수료만) |
| 数量限定タイムセール | 셀러센트럴 신청 | **선불 150엔/일 + 매출 1.0% (상한 15,000엔)** |
| 7日間のタイムセール (구 おすすめ) | 셀러센트럴 신청 | 위와 동일 |
| プライム会員限定割引 | 가격할인 기능 | 고정 참가 수수료 없음 (할인분 = 비용) |

- 참가 조건: 출품 계정 평가 **별 3.5 이상**, 상품 리뷰 **별 4.0 이상**
- **프라임데이 / 블랙프라이데이 참가 = 数量限定タイムセール와 동일 기준**
- 상기 요금은 "상전기(商戦期) 외" 기준
[출처: https://jagoo.co.jp/column/amazon-time-sale, 2025] `추정`

**핵심 함의**: 제로 리뷰 신규 ASIN은 **상품 리뷰 별 4.0 요건 때문에 타임세일에 애초에 못 들어감**. 순서가 Vine → 리뷰 확보 → 세일 참가로 강제됩니다.

---

## 3. 브랜드 도구

### 3-1. ブランド登録 — 한국 상표는 JP에서 안 통함

- **일본 마켓플레이스는 일본 특허청(JPO) 등록 상표가 필요.** "판매하려는 나라(일본이면 **日本国特許庁**)의 정부 상표국이 발행한" 상표. [출처: https://jagoo.co.jp/column/amazon-brand-registry/, 2026] `확실`
- 재확인: "판매하는 나라(일본이면 일본)의 특허청에 등록된 상표를 보유할 것". [출처: https://eresa.co.jp/column/amazon-brand-registry-guide/, 2026] `확실`
- **Amazon Brand Registry가 전역적으로 수용하는 상표청 목록** (마켓플레이스별로 해당 국가 상표가 필요): 미국(USPTO), 브라질, 캐나다, 멕시코, 호주, 인도, **일본(JPO)**, 프랑스, 독일, 이탈리아, 터키, 싱가포르, 스페인, 베네룩스(BOIP), 사우디, 스웨덴, 폴란드, 이집트, 영국, EUIPO, UAE. **한국(KIPO)도 수용 목록에 포함되지만 그건 한국 마켓플레이스용이며 JP 커버가 아님.** [출처: https://www.tramatm.com/en/trademark-questions-and-answers/amazon-brand-registry/ · https://trademarkangel.com/amazon-brand-registry-requirements-explained/] `추정`
- **출원중(pending)도 접수 가능**: 특허청 출원 완료 + **출원번호 발급**되면 브랜드 등록 신청 가능. [출처: https://jagoo.co.jp/column/amazon-brand-registry/, 2026] `확실`
- **문자 상표를 권장.** 로고만 등록하면 Amazon 운용에서 불리. [출처: https://eresa.co.jp/column/amazon-brand-registry-guide/, 2026] `추정`
- 제출물: 브랜드 로고 업로드 + **브랜드명/로고가 영구적으로 표시된 상품·패키지 이미지** + 상표 등록/출원 번호. [출처: https://jagoo.co.jp/column/amazon-brand-registry/, 2026] `확실`
- Brand Registry 자체는 **무료, 월정액 없음**. [출처: https://eresa.co.jp/column/amazon-brand-registry-guide/, 2026] `확실`

**일본 상표 취득 시간 / 비용**:

| 경로 | 기간 | 비용 |
|---|---|---|
| 통상 심사 | 평균 **10개월** (등록까지 6~12개월) | 관납료 약 **45,000엔** |
| ファストトラック審査 | 약 4개월 단축, 평균 **6개월** | 추가 비용 없음 (요건 충족 시 자동) |
| 早期審査 | **최단 2개월**에 1차 심사 결과 | 별도 신청 |
| Amazon IP Accelerator | **2~4주**에 잠정 브랜드 등록 접근 | 유료 제휴 법률사무소 |

[출처: https://www.jpo.go.jp/system/trademark/shinsa/fast/shohyo_fast.html · https://eresa.co.jp/column/amazon-brand-registry-guide/ · https://www.evorix.jp/blog/商標登録を最短2ヶ月で完了させる-早期審査-の完全ガイド, 2025-2026] `추정` (변리사 수수료 별도, 실무상 1구분 10~20만엔대)

- **ファストトラック 요건**: 출원 시 「類似商品・役務審査基準」/「商標法施行規則」/니스분류 게재 상품·역무만 지정 + 심사 착수 시까지 지정상품 보정 없음. 화장품은 3류에 표준 표기가 잘 갖춰져 있어 요건 충족이 쉬움. [출처: JPO] `확실`
- **최단 경로 권고**: 토너패드 = 3류. 표준 표기만 써서 출원 → ファストトラック 자동 적용 → **출원번호 나오는 즉시 Amazon 브랜드 등록 신청**.

### 3-2. A+ / プレミアムA+

| 항목 | 통상 A+ | プレミアムA+ |
|---|---|---|
| 이미지 폭 | 970px | 1464px 등 대형 |
| 모듈 수 | 최대 5개 | 최대 7개 |
| 동영상 삽입 | 불가 | **가능** |
| 모듈 종류 | 17종 | 19종 |

- **프리미엄 A+ 조건 (전부 충족)**: ① 브랜드 등록 완료 ② 카탈로그 내 **모든 ASIN에 브랜드 스토리 적용** ③ 과거 12개월 내 **A+ 콘텐츠 5건 이상 승인** ④ 가이드라인 준수 + 판매 실적/계정 건전성.
- **현재 무료** (프로모션 기간, 향후 유료화 가능성 명시).
[출처: https://sobani.co.jp/columnlist/amazon_premium-a-plus, 2026] `확실`
- 함의: 프리미엄 A+는 **런칭 직후 못 씀**(A+ 5건 승인 이력 필요). 초기에는 통상 A+로 5건 쌓는 걸 로드맵에 넣을 것.

### 3-3. ブランドアナリティクス (일본에서 뭘 받나)

일본에서 5개 리포트 전부 제공:

1. **検索クエリパフォーマンス (SQP)**: 검색어별 노출 → 클릭 → 구매 + 그 검색어에서의 **자사 점유율**
2. **検索カタログパフォーマンス**: 상품별로 어느 단계에서 이탈하는지
3. **上位の検索用語 (Top Search Terms)**: Amazon 전체 검색어 **랭킹** → 질문하신 `検索頻度ランキング`이 이것. **일본 제공됨** `확실`
4. **リピート購入行動**
5. **マーケットバスケット分析**

- **일본 한계**: 인구통계 데이터(연령/성별/세대소득)는 **미국 스토어 중심 제공, 일본 셀러센트럴에서는 표시 안 되거나 제한적**. [출처: https://link-ecconsulting.co.jp/column/amazon-brand-analytics-guide/, 2026] `추정`
- 2025-10-01부터 Amazon Ads가 **branded search 식별 방식 개선**(전 리전). 브랜드 검색 지표가 이 시점 전후로 불연속. [출처: https://advertising.amazon.com/ja-jp/resources/whats-new/branded-searches-metric-enhancements, 2025-10-01] `확실`

### 3-4. ブランドストア / Posts / Transparency / Project Zero

- **브랜드스토어**: 일본 제공, **무료 작성**. [출처: https://advertising.amazon.com/ja-jp/solutions/products/stores] `확실`
- **Posts**: 일본 제공. 주 수회 게시 권장, 브랜드스토어 링크 가능. [출처: https://advertising.amazon.com/ja-jp/library/guides/get-started-posts] `확실`
- 2025-09-15부터 SB 광고에 **브랜드스토어 페이지뷰 지표** 신설. [출처: https://advertising.amazon.com/ja-jp/resources/whats-new/new-brand-store-page-views-metric, 2025-09-15] `확실`
- **Transparency**: 일본 제공 (2020-10-01~). 코드 단가는 개별 문의. `확실` / 단가 `불확실`
- **Project Zero**: 일본 제공. 셀프서비스 삭제 + 자동 보호 무료. `확실`

---

## 4. SP-API (일본 마켓플레이스 관점)

### 4-1. 기본값 (공식 문서 확인)

```
JP marketplaceId : A1VC38T7YXB528     (countryCode: JP)
Region           : FE (Far East)
SP-API endpoint  : https://sellingpartnerapi-fe.amazon.com
AWS region       : us-west-2
FE 소속 스토어    : Singapore, Australia, Amazon Japan
```
[출처: https://developer-docs.amazon/sp-api/docs/marketplace-ids · https://developer-docs.amazon/sp-api/docs/sp-api-endpoints] `확실`

Ads API는 별도 호스트:
```
Amazon Ads API (FE) : https://advertising-api-fe.amazon.com
JP LWA token URL    : https://api.amazon.co.jp/auth/o2/token
JP currency         : JPY
FE 마켓플레이스      : JP, AU, SG
```
[출처: https://raw.githubusercontent.com/denisneuf/python-amazon-ad-api/main/ad_api/base/marketplaces.py] `추정` (라이브러리 소스. Amazon Ads 공식 문서 사이트는 JS 렌더링이라 fetch 실패)

**주의**: JP는 LWA 토큰 엔드포인트가 `api.amazon.co.jp`. 미국용 `api.amazon.com`을 그대로 쓰면 Ads API에서 실패할 수 있음. `추정` — 실제 호출로 검증 필요

### 4-2. 미국 대비 다른 점

- **Rate limit은 마켓플레이스별이 아니라 "selling partner × application 쌍"별.** 다만 리전별 셀러 계정(다른 seller ID)이면 **토큰 버킷이 분리**됨. US 트래픽이 JP 쿼터를 안 먹음. [출처: https://developer-docs.amazon/sp-api/docs/usage-plans-and-rate-limits] `확실`
- **JP 전용 rate limit 차이는 문서상 없음.** `확실` (없다는 것이 확실)
- **Listings Items API는 원래 JP에서 못 썼다가 나중에 열림.** JP public developer도 프로그램적 리스팅 생성/관리 가능. [출처: https://developer-docs.amazon/sp-api/changelog/the-listings-items-api-is-now-available-in-the-jp-marketplace] `확실` (정확한 날짜는 페이지에서 추출 실패)
- **2026-07-29부터 Listings Items v2021-08-01의 `marketplaceIds`가 같은 리전 내 복수 ID 수용** → JP + AU + SG 한 호출 처리 가능. [출처: https://developer-docs.amazon/sp-api/docs/sp-api-release-notes, 2026-07-29] `확실`
- **Product Type Definitions API v2020-09-01**: `searchDefinitionsProductTypes` / `getDefinitionsProductType`. NA/EU/FE 전 리전. 역할은 `Inventory and Order Tracking` 또는 `Product Listing`. **마켓플레이스별로 스키마가 다름**(JSON Schema 2019-09 확장). `productTypeVersion` 미지정 시 항상 최신 요건. [출처: https://developer-docs.amazon/sp-api/docs/product-type-definitions-api] `확실`
- 2026-05-27: Product Type Definitions에 `parentageLevel` 쿼리 파라미터 추가(부모/자식 스키마 분리 취득). 베리에이션 SKU에 유용. [출처: 릴리스노트, 2026-05-27] `확실`
- **일본어 속성 요건**: SP-API 문서에 "JP는 일본어 필수" 같은 명시 규정 없음. 다만 약기법상 **전성분명/내용량을 일본어로 정확 표시**해야 하므로 리스팅 텍스트와 패키지 모두 일본어여야 함. 실제 필수 속성은 **`getDefinitionsProductType`으로 JP 마켓플레이스의 화장품 productType 스키마를 직접 뽑는 것이 유일한 정답.** `추정`

### 4-3. Feeds vs Listings API (JP 카탈로그)

- 두 방식은 **데이터 포맷 동일, 상호운용됨**. "Listings data is interoperable between the Listings Items API and the `JSON_LISTINGS_FEED` feed type."
- **Listings Items API** = 개별/실시간 (`putListingsItem`, `patchListingsItem`, `deleteListingsItem`, `getListingsItem`, `searchListingsItems`)
- **`JSON_LISTINGS_FEED`** = 벌크. Product Type Definitions API로 스키마 받아 페이로드 구성.
- 마켓플레이스별 caveat은 문서에 없음.
[출처: https://developer-docs.amazon/sp-api/docs/manage-product-listings-guide] `확실`
- **권고**: 토너패드 SKU 몇 개 수준이면 Listings Items API만으로 충분. Feeds는 불필요한 복잡도.
- 2026-04-01: Feeds v2021-06-30 + Reports v2021-06-30에 `enableContentEncodingUrlHeader` 추가(자동 압축 해제). `확실`
- 2026-02-23: `JSON_LISTINGS_FEED` 상태가 **모든 처리 완료 후에만 DONE**으로 변경(이전엔 조기 DONE). `FEED_PROCESSING_FINISHED` 알림 타이밍도 변경. **폴링 로직 있으면 영향.** `확실`

### 4-4. Data Kiosk (일본 사용 가능)

- **NA/EU/FE 전 리전 글로벌 제공.** 일본 사용 가능. [출처: https://developer-docs.amazon/sp-api/docs/data-kiosk-api] `확실`
- 데이터셋:
  - `analytics_salesAndTraffic_2024_04_24` (역할: **Brand Analytics**) — `salesAndTrafficTrends` 쿼리로 ASIN별 일/주/월 트렌드 (2025-08-27 추가)
  - `analytics_economics_*` (역할: **Selling Partner Insights**) — 상품 단위 매출/반품/광고/수수료/오프아마존 비용/순수익
  - `analytics_vendorAnalytics_2024_09_30` (`sourcingView`, `manufacturingView`) — 벤더 전용
- **`analytics_salesAndTraffic_2023_11_15`는 2026-03-26 제거됨** (이미 경과). 후속 `2024_04_24`는 **`marketplaceIds`를 입력으로 요구**. 기존 US 코드를 그대로 JP에 붙이면 여기서 깨집니다. [출처: https://developer-docs.amazon/sp-api/changelog/analytics-sales-and-traffic-data-kiosk-datasets-update-and-deprecation] `확실`
- 2026-02-23: Sales and Traffic에 B2B 환불/피드백/클레임 지표 추가. `확실`
- **쿼리 백로깅 미지원**, 셀러당/쿼리당 동시 비종료 쿼리 수 제한. `확실`

### 4-5. Search Query Performance — 일본 O

```
GET_BRAND_ANALYTICS_SEARCH_QUERY_PERFORMANCE_REPORT
GET_BRAND_ANALYTICS_SEARCH_CATALOG_PERFORMANCE_REPORT
Role: Brand Analytics
```
- 2025-02-26 Reports API v2021-06-30에 추가.
- **지원 스토어에 Japan (JP) 명시 포함**: CA, US, MX, BR, ES, UK, FR, NL, DE, IT, SE, TR, SA, AE, IN, SG, **JP**, AU. [출처: https://developer-docs.amazon/sp-api/changelog/update-added-new-search-query-performance-and-search-catalog-performance-analytics-report-types, 2025-02-26] `확실`
- 즉 **일본 SQP를 API로 자동 수집 가능.** 일본 키워드 전략의 유일한 1차 데이터 소스. 브랜드 등록이 선행 조건.

### 4-6. 2025-2026 SP-API 변경 중 영향 있는 것

| 날짜 | 변경 | 영향 |
|---|---|---|
| 2025-02-26 | SQP / Search Catalog Performance 리포트 추가 (JP 포함) | 키워드 전략 자동화 |
| 2025-05-28 | Listings Items v2021-08-01에 JSON Patch `merge` 지원 | 재고 갱신 단순화 |
| 2025-06-25 | **Customer Feedback API v2024-06-01 신설** (리뷰/반품 인사이트) | 리뷰 모니터링 |
| 2025-09-30 | Product Pricing `CompetitivePriceThreshold` 제거 | 가격 로직 영향 |
| 2026-01-28 | **Orders API v2026-01-01 신설** — 10개 오퍼레이션을 `getOrder` + `searchOrders` 2개로 통합 | 마이그레이션 권장 |
| 2026-01-28 | Orders API v0에서 FBA 주문 `BuyerEmail` 제거. MFN은 `Direct-to-Consumer Shipping` 역할 필요 | 권한 재신청 가능성 |
| 2026-02-23 | `JSON_LISTINGS_FEED` DONE 타이밍 변경 | 폴링 로직 수정 |
| 2026-03-26 | Data Kiosk `analytics_salesAndTraffic_2023_11_15` 제거 | 마이그레이션 필수 |
| 2026-04-01 | Product Pricing에 `similarItems` 추가 | 경쟁 상품 자동 식별 |
| 2026-05-27 | Product Type Definitions `parentageLevel` / Notifications CEL `filterExpression` | 베리에이션, 알림 필터 |
| 2026-07-29 | **Invoices API v2026-06-25 신설**, Listings `marketplaceIds` 복수, Product Pricing `promotions` | 일본 경리 + 멀티마켓 |
| 2026-08-05 | **Tracking API v2026-01-30 신설** (`getShipmentTracking`) + `SHIPMENT_TRACKING_MILESTONE_CHANGED` | 배송 추적 |

[출처: https://developer-docs.amazon/sp-api/docs/sp-api-release-notes] `확실`

**Amazon Ads API 변경**:
- 2025-05-15: SP 입찰 추천 v3 콘텐츠 타입 폐지 → v4 `application/vnd.spthemebasedbidrecommendation.v4+json`. 광고그룹/키워드 추천은 통합 엔드포인트 `/sp/targets/bid/recommendations`로 이전. [출처: https://web.swipeinsight.app/posts/amazon-ads-to-phase-out-v3-for-sponsored-products-bid-recommendations-10126, 2025] `추정`
- 2025-06~07에 SP/SB/DSP/AMC 구형 엔드포인트 대량 종료, 일부는 2026년까지. [출처: https://amalert.co.uk/updates/amazon-advertising-api-deprecation-schedule-key-deadlines-sellers-need-to-track-in-2025-2ac7d86c] `불확실` (공식 deprecations 페이지 fetch 실패)
- 2026-07: AMC Advertiser Audience API 폐지 예정. [출처: https://advertising.amazon.com/API/docs/en-us/release-notes/deprecations] `추정`

---

## 5. 경쟁 인텔리전스 도구 (JP)

| 도구 | JP 커버리지 | 가격 | 평가 |
|---|---|---|---|
| **Nint ECommerce** (일본산) | **라쿠텐 + Amazon + Yahoo 3몰 횡단**, 10년+ 데이터, 2,300+ 도입 (2026-04) | **9,800엔/월~** (EC Lite Basic) | 추정 오차 **평균 7~8%**. **JP 시장 사이징에는 이게 정답** `추정` |
| **Keepa** | `domainId 5 = co.jp`. 12개 마켓플레이스 | 약 €19/월 | 가격/랭킹 히스토리 깊이는 최강. JP 커버리지 품질 독립 검증 자료는 없음 `불확실` |
| **SellerSprite (セラースプライト)** | JP 대응, 일본어 UI + `sellersprite.jp` 별도 도메인 | 연간 결제 30% 할인 (금액 fetch 403) | 키워드/리버스 ASIN 강점. 2025-12-08 확장기능에 **Amazon + TikTok 통합 분석 + 일/중/영 AI 스크립트** 추가 `추정` |
| **Helium 10** | 21개 마켓플레이스 (JP 포함) | $39~/월 | 올인원. JP 키워드 볼륨 정확도 평가 자료 없음 `불확실` |
| **Jungle Scout** | JP 지원 | $49~/월 | 초보 친화. JP 데이터 깊이는 Nint에 밀릴 것으로 추정 `불확실` |
| **ERESA** | JP 특화, Keepa계 | 무료~ | 일본 셀러 표준 툴로 언급 `추정` |
| **マカド！** | JP 전용 가격개정 | **4,980엔/월** | 상품 수 무제한, 5분 간격 `확실` |
| **プライスター** | JP 전용 가격개정 + 종합관리 | **5,280엔/월** | 자체발송/FBA 양쪽 `확실` |
| **セラースケット** | JP 전용 | **2,980엔/월~** | 계정 보호 기능 포함 `확실` |
| **Amazon Brand Analytics** | JP 제공 (인구통계 제외) | **무료** (브랜드 등록 필요) | **1차 데이터. 위 어떤 툴보다 정확** `확실` |

[출처: https://www.nint.jp/blog/ec-analysis-tools-comparison/ · https://www.nint.jp/topics/topics-18860/ · https://docs.datavirtuality.com/connectors/keepa-api-reference · https://www.sellersprite.com/en/ · https://crossma.jp/column/price-revision-automation-tools/ · https://hikomhikom.com/amazon-kakaku-kaitei-tool-hikaku/, 2025-2026]

- **NINJA TOOLS, DELTA tracer**: 이번 리서치에서 유효 자료 못 찾음. `불확실`
- **권고**: JP 시장 사이징/경쟁사 매출 추정은 **Nint**, ASIN 히스토리는 **Keepa**, 자사 키워드 진실값은 **Brand Analytics SQP(API)**. 가격개정 툴은 단일 브랜드 오너에게 불필요(피기백 대응용).
- 자체 SP-API를 이미 운영 중이므로 툴 구매보다 **SQP + Data Kiosk를 JP 마켓플레이스로 확장**하는 게 비용 대비 효율이 압도적.

---

## 6. 모순 / 미확인

### 모순
1. **CPC 벤치마크가 소스 간 20배 차이.** "평균 CPC 5~10엔" vs "뷰티 40~120엔". 전자는 오래된 값이거나 초저경쟁 카테고리 기준으로 판단. **뷰티 예산은 40~120엔 기준이 안전.**
2. **Vine 과금 시점**: "첫 리뷰 게시 시 과금" vs "등록일로부터 30일 후 청구" vs "90일 이내 리뷰 없으면 무과금". 세 서술 병존. 실질은 "리뷰가 안 달리면 안 낸다"로 수렴하나 정확한 청구일 미확정.
3. **Sponsored Display 브랜드 등록 요건**: 영어권 "불필요" vs 일본 실무 "필요". 계정에서 직접 확인 필요.
4. **A9 vs A10 명칭**: A10은 Amazon 공식 명칭이 아님. "외부 트래픽 가중치 증가"는 Amazon 확인 사실이 아니라 업계 관찰.

### 미확인 (WebSearch 예산 200/200 소진으로 미완)
1. **쿠폰 상환 수수료(일본, 엔)** — 완전 미확인. 셀러센트럴 직접 확인 필요.
2. **Transparency 코드 단가** — 공개 자료 없음. Amazon 개별 문의.
3. **Listings Items API JP 개방 정확한 날짜** — 체인지로그에서 날짜 추출 실패.
4. **JP 화장품 productType의 실제 필수 속성 목록**(성분/내용량/사용기한 필드명) — 문서로는 없음. **`getDefinitionsProductType`을 JP 마켓플레이스로 직접 호출해 스키마를 덤프하는 것이 유일한 확인 방법. 다음 액션 1순위.**
5. **Amazon Ads API FE 호스트명** — 공식 문서 fetch 실패(JS 렌더링). 라이브러리 소스로만 확인.
6. **Ads API 2025-06~07 대량 폐지 목록** — 공식 deprecations 페이지 접근 실패.
7. **일본 vs 미국 CPC/ACoS 직접 비교 데이터** — 존재하지 않음.
8. **Rufus의 일본 트래픽 점유율 / 전환 영향** — 정량 데이터 0건. 여기에 전략을 걸면 안 됨.
9. **Alexa for Shopping 일본 출시 일정** — Amazon 미발표.
10. **`特定商取引法` 기반 출품자 정보 표시 요건** — JP 고유 요건 가능성이 높은데 미검증.
11. **FBA新商品特典プログラム 2026 현행 조건** — 최신 소스가 2022년 기준. `확인 필요 (오래된 소스)`
12. **Vine 베리에이션 리뷰 공유 폐지(2026)** — 단일 소스. SKU마다 별도 과금이라 비용 영향이 커서 교차 검증 필요.

### 즉시 실행 권고 3가지
- **일본 상표 3류 출원을 지금 시작** (표준 표기만 사용 → ファストトラック 자동 적용). 출원번호만 나오면 브랜드 등록 신청이 되므로 런칭 크리티컬 패스가 약 6개월 단축됩니다.
- **화장품 제조판매업 허가 경로 확정** (자사 취득 vs 일본 수입대행사). 이게 안 풀리면 나머지 전부 무의미.
- **`getDefinitionsProductType`을 JP + 화장품 productType으로 호출해 스키마 덤프.** 필수 속성은 문서가 아니라 API가 진실입니다.