// scripts/crawlAndInsertAuctionListings.ts
import axios from "axios";
import * as cheerio from "cheerio";
import { supabaseAdmin } from "../config/supabase";

const TARGET_URL =
  "https://www.my-auction.co.kr/auction/recommend.php?aresult=&charge_no=&usage_code_all=&acourt=&office=&sno=&tno=&spe_age=&npls=&spels=&schs=&pchs=&listds=&ipdate1=&ipdate2=&eprice1=&eprice2=&mprice1=&mprice2=&viewType=&auction_cate=&catelist=&subNum=&subDis=&apoint1=&apoint2=&buildingtxt=&address1_01=&address1_02=&address1_03=&aorder=&option1=&option2=102&lastidxin=&barea1=&barea2=&larea1=&larea2=&gm_age=&np1=&np2=&option2=101";

async function crawlAndInsertAuctionListings() {
  const { data: html } = await axios.get(TARGET_URL);
  const $ = cheerio.load(html);

  // 실제 테이블 구조에 맞게 selector 조정 필요
  $("table tr").each(async (i, el) => {
    const tds = $(el).find("td");
    if (tds.length < 7) return; // 데이터 행만

    const image_url = $(tds[1]).find("img").attr("src") || null;
    const case_info = $(tds[2]).text().trim() || null;
    const addressAreaRights = $(tds[3])
      .text()
      .trim()
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const address = addressAreaRights[0] || null;
    const area = addressAreaRights[1] || null;
    const special_rights = addressAreaRights.slice(2).join(", ") || null;
    const priceText = $(tds[4]).text().replace(/,/g, "").split(" ");
    const appraisal_price = parseInt(priceText[0]) || null;
    const min_price = parseInt(priceText[1]) || null;
    const status = $(tds[5]).text().trim() || null;
    const auction_date = $(tds[6]).text().trim() || null;

    // DB insert
    await supabaseAdmin.from("auction_recommendations_test").insert({
      image_url,
      case_info,
      address,
      area,
      special_rights,
      appraisal_price,
      min_price,
      status,
      auction_date,
    });
  });
  console.log("크롤링 및 DB 저장 완료");
}

crawlAndInsertAuctionListings().catch(console.error);
