import axios from "axios";
import * as cheerio from "cheerio";
import { supabaseAdmin } from "../config/supabase";

const BASE_URL = "https://www.my-auction.co.kr/auction/recommend.php?page=";
const PAGE_START = 1;
const PAGE_END = 14;

async function crawlAndInsertAuctionRecommendations() {
  for (let page = PAGE_START; page <= PAGE_END; page++) {
    const url = `${BASE_URL}${page}`;
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    $("table tr").each(async (i, el) => {
      const tds = $(el).find("td");
      if (tds.length < 7) return;

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
    console.log(`page ${page} 크롤링 및 DB 저장 완료`);
  }
}

crawlAndInsertAuctionRecommendations().catch(console.error);
