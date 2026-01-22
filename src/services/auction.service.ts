/**
 * 경매 서비스
 * 경매 데이터의 CRUD 작업을 처리하는 비즈니스 로직 레이어
 * Supabase를 통해 데이터베이스와 통신
 */
import { supabaseAdmin } from "../config/supabase";
import {
  Database,
  Tables,
  InsertTables,
  UpdateTables,
} from "../types/database.types";
import { ApiError } from "../middlewares";

// 타입 정의 - 데이터베이스 타입에서 추출
export type Auction = Tables<"auctions">; // 경매 조회 타입
export type AuctionInsert = InsertTables<"auctions">; // 경매 생성 타입
export type AuctionUpdate = UpdateTables<"auctions">; // 경매 수정 타입

// 경매 목록 조회시 사용할 필터 옵션
export interface AuctionFilters {
  status?: Auction["status"]; // 경매 상태 (draft, active, ended, cancelled)
  sellerId?: string; // 판매자 ID
  search?: string; // 제목 검색어
}

class AuctionService {
  // 테이블명 상수
  private readonly table = "auctions" as const;

  /**
   * 경매 목록 조회
   * @param filters - 필터 옵션 (status, sellerId, search)
   * @param offset - 시작 위치 (페이지네이션)
   * @param limit - 조회 개수
   * @returns 경매 목록과 전체 개수
   */
  async getAll(
    filters: AuctionFilters = {},
    offset: number = 0,
    limit: number = 20,
  ): Promise<{ data: Auction[]; count: number }> {
    // 기본 쿼리 - 모든 컨텐츠 선택하고 전체 개수도 반환
    let query = supabaseAdmin.from(this.table).select("*", { count: "exact" });

    // 필터 적용 - 상태로 필터링
    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    // 필터 적용 - 판매자 ID로 필터링
    if (filters.sellerId) {
      query = query.eq("seller_id", filters.sellerId);
    }

    // 필터 적용 - 제목 검색 (대소문자 무시)
    if (filters.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }

    // 정렬 및 페이지네이션 - 최신순으로 정렬
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw ApiError.internal(`Failed to fetch auctions: ${error.message}`);
    }

    return { data: data || [], count: count || 0 };
  }

  /**
   * 단일 경매 조회
   * @param id - 경매 ID (UUID)
   * @returns 경매 데이터
   * @throws NotFound - 경매가 없을 경우
   */
  async getById(id: string): Promise<Auction> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single(); // 단일 결과만 반환

    if (error) {
      // PGRST116: 결과가 없음
      if (error.code === "PGRST116") {
        throw ApiError.notFound("Auction not found");
      }
      throw ApiError.internal(`Failed to fetch auction: ${error.message}`);
    }

    return data;
  }

  /**
   * 경매 생성
   * @param auction - 경매 생성 데이터
   * @returns 생성된 경매 데이터
   */
  async create(auction: AuctionInsert): Promise<Auction> {
    // 초기값 설정 - 현재가는 시작가로, 상태는 기본 draft
    const insertData: AuctionInsert = {
      ...auction,
      current_price: auction.starting_price,
      status: auction.status || "draft",
    };

    const { data, error } = await supabaseAdmin
      .from("auctions")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw ApiError.internal(`Failed to create auction: ${error.message}`);
    }

    return data;
  }

  /**
   * 경매 수정
   * @param id - 경매 ID
   * @param updates - 수정할 데이터
   * @returns 수정된 경매 데이터
   */
  async update(id: string, updates: AuctionUpdate): Promise<Auction> {
    // 수정 시간 자동 업데이트
    const updateData: AuctionUpdate = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("auctions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw ApiError.notFound("Auction not found");
      }
      throw ApiError.internal(`Failed to update auction: ${error.message}`);
    }

    return data;
  }

  /**
   * 경매 삭제
   * @param id - 경매 ID
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from("auctions")
      .delete()
      .eq("id", id);

    if (error) {
      throw ApiError.internal(`Failed to delete auction: ${error.message}`);
    }
  }

  /**
   * 활성 경매 목록 조회
   * - status가 'active'인 경매만 조회
   */
  async getActive(
    offset: number = 0,
    limit: number = 20,
  ): Promise<{ data: Auction[]; count: number }> {
    return this.getAll({ status: "active" }, offset, limit);
  }

  /**
   * 경매 상태 변경
   * @param id - 경매 ID
   * @param status - 새로운 상태
   */
  async updateStatus(id: string, status: Auction["status"]): Promise<Auction> {
    return this.update(id, { status });
  }
}

export const auctionService = new AuctionService();
