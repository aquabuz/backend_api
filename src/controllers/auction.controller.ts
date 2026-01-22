/**
 * 경매 컨트롤러
 * HTTP 요청을 받아 서비스를 호출하고 응답을 반환
 */
import { Request, Response } from "express";
import { z } from "zod";
import { auctionService, AuctionFilters } from "../services";
import { AuthenticatedRequest } from "../types";
import {
  successResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse,
  getPaginationParams,
} from "../utils";

// ========== 유효성 검증 스키마 ==========

// 경매 생성 요청 검증
export const createAuctionSchema = z.object({
  title: z.string().min(1).max(200), // 제목: 1~200자
  description: z.string().max(2000).optional(), // 설명: 최대 2000자 (선택)
  starting_price: z.number().positive(), // 시작가: 양수
  start_time: z.string().datetime(), // 시작 시간: ISO8601 형식
  end_time: z.string().datetime(), // 종료 시간: ISO8601 형식
});

// 경매 수정 요청 검증 - 모든 필드 선택적
export const updateAuctionSchema = createAuctionSchema.partial();

// 경매 목록 조회 쿼리 검증
export const auctionQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "1", 10)), // 페이지 번호
  limit: z
    .string()
    .optional()
    .transform((val) => Math.min(parseInt(val || "20", 10), 100)), // 조회 개수 (최대 100)
  status: z.enum(["draft", "active", "ended", "cancelled"]).optional(), // 상태 필터
  search: z.string().optional(), // 검색어
});

class AuctionController {
  /**
   * 경매 목록 조회
   * GET /auctions
   */
  async getAll(req: Request, res: Response): Promise<void> {
    // 쿼리 파라미터 추출
    const { page, limit, status, search } = req.query as unknown as z.infer<
      typeof auctionQuerySchema
    >;
    const pagination = getPaginationParams(page, limit);

    // 필터 구성
    const filters: AuctionFilters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;

    // 서비스 호출
    const { data, count } = await auctionService.getAll(
      filters,
      pagination.offset,
      pagination.limit,
    );

    paginatedResponse(res, data, pagination, count);
  }

  /**
   * 활성 경매 목록 조회
   * GET /auctions/active
   */
  async getActive(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.query as unknown as z.infer<
      typeof auctionQuerySchema
    >;
    const pagination = getPaginationParams(page, limit);

    const { data, count } = await auctionService.getActive(
      pagination.offset,
      pagination.limit,
    );

    paginatedResponse(res, data, pagination, count);
  }

  /**
   * 단일 경매 조회
   * GET /auctions/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const auction = await auctionService.getById(id);
    successResponse(res, auction);
  }

  /**
   * 경매 생성
   * POST /auctions
   * - 인증 필요
   */
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const auctionData = req.body as z.infer<typeof createAuctionSchema>;

    // 현재 로그인한 사용자를 판매자로 설정
    const auction = await auctionService.create({
      ...auctionData,
      seller_id: req.user!.id,
    });

    createdResponse(res, auction);
  }

  /**
   * 경매 수정
   * PUT /auctions/:id
   * - 인증 필요, 소유자만 가능
   */
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const updates = req.body as z.infer<typeof updateAuctionSchema>;

    // 권한 확인 - 본인 경매만 수정 가능
    const existing = await auctionService.getById(id);
    if (existing.seller_id !== req.user!.id) {
      throw new Error("Unauthorized to update this auction");
    }

    const auction = await auctionService.update(id, updates);
    successResponse(res, auction);
  }

  /**
   * 경매 삭제
   * DELETE /auctions/:id
   * - 인증 필요, 소유자만 가능
   */
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;

    // 권한 확인
    const existing = await auctionService.getById(id);
    if (existing.seller_id !== req.user!.id) {
      throw new Error("Unauthorized to delete this auction");
    }

    await auctionService.delete(id);
    noContentResponse(res);
  }

  /**
   * 경매 상태 변경
   * PATCH /auctions/:id/status
   */
  async updateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body;

    const auction = await auctionService.updateStatus(id, status);
    successResponse(res, auction);
  }

  /**
   * 내 경매 목록 조회
   * GET /auctions/my
   * - 인증 필요
   */
  async getMyAuctions(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { page, limit } = req.query as unknown as z.infer<
      typeof auctionQuerySchema
    >;
    const pagination = getPaginationParams(page, limit);

    // 본인이 판매자인 경매만 조회
    const { data, count } = await auctionService.getAll(
      { sellerId: req.user!.id },
      pagination.offset,
      pagination.limit,
    );

    paginatedResponse(res, data, pagination, count);
  }
}

export const auctionController = new AuctionController();
