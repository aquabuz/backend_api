/**
 * 입찰 서비스
 * 입찰 데이터 처리 및 입찰 로직을 담당
 */
import { supabaseAdmin } from "../config/supabase";
import { Tables, InsertTables } from "../types/database.types";
import { ApiError } from "../middlewares";

// 타입 정의
export type Bid = Tables<"bids">; // 입찰 조회 타입
export type BidInsert = InsertTables<"bids">; // 입찰 생성 타입

class BidService {
  private readonly table = "bids";

  /**
   * 특정 경매의 입찰 목록 조회
   * - 금액 내림차순으로 정렬
   */
  async getByAuctionId(
    auctionId: string,
    offset: number = 0,
    limit: number = 50,
  ): Promise<{ data: Bid[]; count: number }> {
    const { data, error, count } = await supabaseAdmin
      .from(this.table)
      .select("*", { count: "exact" })
      .eq("auction_id", auctionId)
      .order("amount", { ascending: false }) // 최고가 순으로
      .range(offset, offset + limit - 1);

    if (error) {
      throw ApiError.internal(`Failed to fetch bids: ${error.message}`);
    }

    return { data: data || [], count: count || 0 };
  }

  /**
   * 경매의 최고 입찰가 조회
   * @returns 최고 입찰 데이터 (없으면 null)
   */
  async getHighestBid(auctionId: string): Promise<Bid | null> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select("*")
      .eq("auction_id", auctionId)
      .order("amount", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // 결과 없음 = 입찰 없음
      if (error.code === "PGRST116") {
        return null;
      }
      throw ApiError.internal(`Failed to fetch highest bid: ${error.message}`);
    }

    return data;
  }

  /**
   * 입찰 등록
   * - 현재 최고가보다 높아야 함
   * - 성공시 경매의 current_price 업데이트
   */
  async placeBid(bid: BidInsert): Promise<Bid> {
    // 현재 최고가 확인
    const highestBid = await this.getHighestBid(bid.auction_id);

    if (highestBid && bid.amount <= highestBid.amount) {
      throw ApiError.badRequest("Bid must be higher than current highest bid");
    }

    // 입찰 등록
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .insert(bid)
      .select()
      .single();

    if (error) {
      throw ApiError.internal(`Failed to place bid: ${error.message}`);
    }

    // 경매의 현재가 업데이트
    await supabaseAdmin
      .from("auctions")
      .update({
        current_price: bid.amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bid.auction_id);

    return data;
  }

  /**
   * 사용자의 입찰 목록 조회
   * - 최신순으로 정렬
   */
  async getByUserId(
    userId: string,
    offset: number = 0,
    limit: number = 20,
  ): Promise<{ data: Bid[]; count: number }> {
    const { data, error, count } = await supabaseAdmin
      .from(this.table)
      .select("*", { count: "exact" })
      .eq("bidder_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw ApiError.internal(`Failed to fetch user bids: ${error.message}`);
    }

    return { data: data || [], count: count || 0 };
  }
}

export const bidService = new BidService();
