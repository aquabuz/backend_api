import { supabase } from "../config/supabase";

import { AuctionRecommendation } from "./interfaces/auction-recommendation.interface";
import { AuctionRecommendationException } from "./auction-recommendation.exception";

const AUCTION_RECOMMENDATION_TABLE = "auction_recommendations_test";

export class AuctionRecommendationService {
  async getRecommendations(): Promise<AuctionRecommendation[]> {
    const { data, error } = await supabase
      .from(AUCTION_RECOMMENDATION_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    // 쿼리 결과 및 에러 로그 출력
    console.log(`[Supabase] ${AUCTION_RECOMMENDATION_TABLE} data:`, data);
    console.log(`[Supabase] ${AUCTION_RECOMMENDATION_TABLE} error:`, error);

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      throw new AuctionRecommendationException(
        (error as { message: string }).message,
      );
    } else if (error) {
      throw new AuctionRecommendationException("Unknown error");
    }
    return Array.isArray(data) ? (data as AuctionRecommendation[]) : [];
  }
}
