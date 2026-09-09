# County to DMA crosswalk: sources, coverage, sanity checks

Built 2026-09-09. Output files in this directory:

| File | Content |
|---|---|
| `dma_shares_2024.csv` | 210 rows, one per Nielsen DMA / Google Trends metro. Columns: `dma_code`, `dma_name` (Google Trends metro name), `geo_code` (Google Trends `US-XX-NNN`, XX = state of the first-named city), `nielsen_name`, `n_counties`, `total_pop`, `pct_hisp`, `pct_white_nh`, `pct_black_nh`, `pct_asian_nh`. Percentages are population-weighted from county counts. |
| `county_dma_crosswalk_2024.csv` | 3,147 rows: every 2024 county FIPS with its DMA code, the share of the county assigned to that DMA (1.0 except the 10 split counties), and the basis. |

Input: `county_counts_2024.json` (Census Vintage 2024 county population estimates; `white`, `black`, `asian` = non-Hispanic, one race alone).

## Crosswalk source

No free, official, current Nielsen county list exists (Nielsen licenses DMA definitions). The crosswalk used here is:

**Primary: BritCrit/dma_county_zip** (GitHub)
- URL: https://github.com/BritCrit/dma_county_zip (file `dma_county_zip_data_set.csv`, raw: https://raw.githubusercontent.com/BritCrit/dma_county_zip/main/dma_county_zip_data_set.csv)
- Committed 2021-12-22. No license stated in the repo. Columns: fips, county, st, dma_code, dma_name, zipcode (41,534 zip rows; collapsed to 3,141 counties, each county maps to exactly one DMA code).
- Nielsen vintage is not stated. The county list is pre-2008 (has Wade Hampton AK, Shannon SD, Bedford city VA, the old Alaska census areas), so the DMA assignment was joined onto an old county file. It carries the numeric Nielsen codes directly (`dma_code`), and uses code 0 = "(NON-DMA COUNTIES)" for the Alaska areas Nielsen leaves outside any DMA.

**Code verification against Google Trends**
- All 13 check codes match: Los Angeles 803, New York 501, Chicago 602, Houston 618, Dallas-Ft. Worth 623, Miami-Ft. Lauderdale 528, Atlanta 524, San Francisco-Oakland-San Jose 807, Phoenix 753, Harlingen-Weslaco-Brownsville-McAllen 636, El Paso 765, Fresno-Visalia 866, Honolulu 744.
- BritCrit's 209 real codes plus Palm Springs (804, added here, see below) equal the 210-code list in fissehab/Nielsen-Media-Research-DMA `DMA_Names.csv` (https://github.com/fissehab/Nielsen-Media-Research-DMA) and the 210 metro names carried in the Kaggle "Google Trends County-DMA-FIPS Mapping" file (below).
- The Google Ads geotargets CSV (geotargets-2026-08-12) no longer contains DMA Region rows, so it could not be used as a second code list.

**Google Trends metro names: kapastor, "Google Trends County-DMA-FIPS Mapping" (Kaggle)**
- URL: https://www.kaggle.com/datasets/kapastor/google-trends-countydma-mapping (v3, file dated 2025-06-24, downloaded via the public dataset download endpoint). License not stated on the page.
- Used only for the `dma_name` column (its `GOOGLE_DMA` column, assigned to each code by county-level majority vote). Its own county-to-DMA assignments were rejected: it is an older Nielsen list (all of Alaska forced into Anchorage/Fairbanks, 46 rows with `#N/A` names, `#REF!` county names, and first-token lookup errors that swapped Portland ME/OR, Springfield MO/MA and Wichita/Wichita Falls). Those swaps were fixed by hand; Palm Springs CA, Billings MT, Myrtle Beach-Florence SC and Paducah-Cape Girardeau-Harrisburg were set by hand.

**Validation: official Nielsen 2016-17 county list** (Nielsen text as posted by Gaurav Sood, gist https://gist.github.com/soodoku/f0f92abcf48218993d28db61a7377e5f, file `nielsen_2016`: 210 DMAs, county names by state, no FIPS, no codes).
- 3,071 BritCrit counties matched by name: 3,048 agree, 23 disagree (list below). 70 counties could not be name-matched (25 Alaska areas Nielsen lists only as "Fairbanks plus" / "Juneau plus", plus spelling variants such as DeKalb, Miami-Dade, O'Brien, St. Marys).
- Nielsen splits 11 counties between two DMAs (Apache AZ, Lea NM, Kern CA, Saguache CO, Brown NE, Buffalo NE, Nevada AR, Riverside CA, El Dorado CA, Solano CA, Oneida NY). County-level data cannot split them; BritCrit's whole-county assignment was kept (it is the larger part in each case checked: Kern to Bakersfield, Solano to Sacramento, Oneida to Utica, Riverside handled separately below).
- alex-patton/US-TVDMA-BY-COUNTY (https://github.com/alex-patton/US-TVDMA-BY-COUNTY, 2017, names only, no codes) was also compared; it agrees with BritCrit on the same order of magnitude (91 first-token differences, most of them naming variants).

**Not usable**
- Harvard Dataverse "Geographic Information on Designated Media Markets" (doi:10.7910/DVN/IVXEHT): the Dataverse API returns no published version, so no files could be fetched.
- Census API without a key is blocked ("Missing Key"), so sub-county ethnic data came from the ACS summary file instead (below).

## Method

1. Each 2024 county FIPS is looked up in BritCrit. Nine FIPS that changed after BritCrit's county list were recoded to their predecessor before lookup:
   02063 Chugach and 02066 Copper River <- 02261 Valdez-Cordova; 02105 Hoonah-Angoon and 02230 Skagway <- 02232; 02158 Kusilvak <- 02270 Wade Hampton; 02195 Petersburg and 02275 Wrangell <- 02280; 02198 Prince of Wales-Hyder <- 02201; 46102 Oglala Lakota <- 46113 Shannon (Rapid City 764). Bedford city VA (51515) exists only in BritCrit and is dropped (merged into Bedford County, same DMA).
2. Connecticut's nine planning regions (Census county-equivalents since 2022) are not in any crosswalk. Each region was split into its towns with the Census crosswalk https://www2.census.gov/geo/docs/reference/ct_change/ct_cou_to_cousub_crosswalk.txt; towns of the former Fairfield County go to New York (501), all other towns to Hartford & New Haven (533). Each region's 2024 counts were divided between the two DMAs group by group in proportion to the towns' ACS 2019-2023 5-year B03002 counts (https://www2.census.gov/programs-surveys/acs/summary_file/2023/table-based-SF/data/5YRData/acsdt5y2023-b03002.dat). Only two regions are actually split: Western Connecticut (95.2% to 501, New Milford and Bridgewater to 533) and Naugatuck Valley (9.2% to 501, Shelton).
3. Riverside County CA is the one split county reproduced, because Palm Springs (804) is otherwise absent from a county-level file. Palm Springs = Nielsen's "Riverside Central" = the Coachella Valley, approximated by four Census County Divisions (Palm Springs, Cathedral City-Palm Desert, Coachella Valley, Desert Hot Springs); the remainder of Riverside stays in Los Angeles (803). The split uses the same ACS B03002 shares: 18.0% of Riverside's population to 804. Treat the 804 row as approximate.
4. Counties with code 0 are left unassigned. Per-DMA percentages = sum of county group counts / sum of county totals.

## Coverage

| | Count |
|---|---|
| Counties in input | 3,144 |
| Assigned to a DMA | 3,119 (10 of them fractionally: 9 CT planning regions + Riverside CA) |
| Unassigned | 25, all Alaska, 145,138 people (0.043% of US population) |
| Population assigned | 339,965,850 of 340,110,988 (99.957%) |
| DMAs in output | 210 (codes 500 to 881; Google Trends' full metro set) |

Unassigned counties (Nielsen non-DMA Alaska areas): 02013 Aleutians East, 02016 Aleutians West, 02050 Bethel, 02060 Bristol Bay, 02063 Chugach, 02066 Copper River, 02068 Denali, 02070 Dillingham, 02100 Haines, 02105 Hoonah-Angoon, 02130 Ketchikan Gateway, 02150 Kodiak Island, 02158 Kusilvak, 02164 Lake and Peninsula, 02180 Nome, 02185 North Slope, 02188 Northwest Arctic, 02195 Petersburg, 02198 Prince of Wales-Hyder, 02220 Sitka, 02230 Skagway, 02240 Southeast Fairbanks, 02275 Wrangell, 02282 Yakutat, 02290 Yukon-Koyukuk.

## Counties where BritCrit disagrees with the official Nielsen 2016-17 list

Kept as BritCrit (unknown which is current). Format: FIPS county: BritCrit DMA vs Nielsen 2016.

05017 Chicot AR: Greenwood-Greenville vs Little Rock · 18171 Warren IN: Lafayette IN vs Indianapolis · 18177 Wayne IN: Dayton vs Indianapolis · 20089 Jewell KS and 20147 Phillips KS: Lincoln-Hastings-Kearney vs Wichita-Hutchinson · 27103 Nicollet MN: Mankato vs Minneapolis-St. Paul · 28039 George MS: Biloxi-Gulfport vs Mobile-Pensacola · 29155 Pemiscot MO: Memphis vs Paducah · 29199 Scotland MO: Ottumwa-Kirksville vs Quincy · 30019 Daniels MT: Minot-Bismarck vs Great Falls · 31031 Cherry NE: Denver vs Sioux Falls · 31057 Dundy NE: Wichita-Hutchinson vs Denver · 31165 Sioux NE: Cheyenne-Scottsbluff vs Denver · 32009 Esmeralda NV: Reno vs Los Angeles · 32011 Eureka NV: Salt Lake City vs Reno · 36073 Orleans NY: Buffalo vs Rochester · 39121 Noble OH: Columbus OH vs Wheeling-Steubenville · 41049 Morrow OR: Portland OR vs Yakima · 46075 Jones SD: Rapid City vs Sioux Falls · 48269 King TX: Wichita Falls vs Lubbock · 48447 Throckmorton TX: Abilene vs Wichita Falls · 51137 Orange VA: Charlottesville vs Richmond · 51640 Galax city VA: Roanoke-Lynchburg vs Greensboro.

Sensitivity: moving all 23 counties (298,364 people) to their Nielsen 2016 DMA changes no DMA's share by more than 1.44 percentage points (Biloxi-Gulfport; next Lafayette IN 0.92, Greenwood-Greenville 0.69, Charlottesville 0.55, Mankato 0.54). Among the 87 DMAs above 1 million people the largest changes are Richmond-Petersburg 0.44 (Orange County VA), Dayton 0.38 and Indianapolis 0.34 (Wayne County IN), Mobile-Pensacola 0.32 (George County MS); every other DMA above 1 million moves by less than 0.2 points.

## Sanity check: top 10 DMAs

| pct_hisp | | pct_black_nh | | pct_asian_nh | |
|---|---|---|---|---|---|
| Laredo TX (749) | 94.7 | Greenwood-Greenville MS (647) | 63.6 | Honolulu HI (744) | 36.3 |
| Harlingen-Weslaco-Brownsville-McAllen TX (636) | 91.3 | Jackson MS (718) | 48.2 | San Francisco-Oakland-San Jose CA (807) | 30.5 |
| El Paso TX (765) | 79.8 | Montgomery (Selma) AL (698) | 44.8 | Los Angeles CA (803) | 15.1 |
| Yuma AZ-El Centro CA (771) | 75.4 | Memphis TN (640) | 43.3 | Sacramento-Stockton-Modesto CA (862) | 14.6 |
| Corpus Christi TX (600) | 62.7 | Macon GA (503) | 40.8 | Seattle-Tacoma WA (819) | 14.3 |
| Fresno-Visalia CA (866) | 59.9 | Meridian MS (711) | 40.2 | San Diego CA (825) | 13.1 |
| Bakersfield CA (800) | 57.8 | Albany GA (525) | 38.7 | New York NY (501) | 12.2 |
| Odessa-Midland TX (633) | 57.7 | Columbia SC (546) | 37.6 | Las Vegas NV (839) | 11.3 |
| Palm Springs CA (804) | 56.1 | Augusta GA (520) | 37.3 | Washington DC (Hagerstown MD) (511) | 10.4 |
| San Antonio TX (641) | 55.9 | Columbus GA (522) | 36.9 | Dallas-Ft. Worth TX (623) | 8.6 |

Reference rows: Los Angeles 47.3% Hispanic (18.07M people); McAllen 91.3%; Honolulu highest Asian; Jackson MS 48.2%, Memphis 43.3%, Atlanta 31.3% Black.

## Caveats

- Google Trends metros use Nielsen's codes, but Google's polygons only approximately follow Nielsen's boundaries and Google does not publish a county list. County-level demographics are the best public proxy.
- The BritCrit vintage is unknown (no later than 2021). Nielsen moves a few rural counties every season; the sensitivity test above bounds the effect.
- `geo_code` state prefixes are derived from the first-named city in the Google metro name (e.g. US-TN-531 for Tri-Cities TN-VA, US-DC-511 for Washington DC). Join on `dma_code` if a prefix does not match what Trends returns.
- Percentages use one-race-alone non-Hispanic counts, so multiracial people are in `total_pop` but in none of the four groups (largest effect in Honolulu).
