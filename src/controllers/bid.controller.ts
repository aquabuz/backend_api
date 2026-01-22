/**
 * 입찰 컨트롤러
 * 입찰 관련 HTTP 요청 처리
 */
import { Request, Response } from "express";
import { z } from "zod";
import { bidService, auctionService } from "../services";
import { AuthenticatedRequest } from "../types";
import {
  successResponse,
  createdResponse,
  paginatedResponse,
  getPaginationParams,
} from "../utils";
import { ApiError } from "../middlewares";

// ========== 유효성 검증 스키마 ==========

// 입찰 등록 요청 검증
export const placeBidSchema = z.object({
  amount: z.number().positive(), // 입찰금액: 양수만 허용
});

// 입찰 목록 조회 쿼리 검증
export const bidQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "1", 10)),
  limit: z
    .string()
    .optional()
    .transform((val) => Math.min(parseInt(val || "50", 10), 100)),
});

class BidController {
  /**
   * 경매의 입찰 목록 조회
   * GET /auctions/:auctionId/bids
   */
  async getByAuction(req: Request, res: Response): Promise<void> {
    const { auctionId } = req.params;
    const { page, limit } = req.query as unknown as z.infer<
      typeof bidQuerySchema
    >;
    const pagination = getPaginationParams(page, limit);

    const { data, count } = await bidService.getByAuctionId(
      auctionId,
      pagination.offset,
      pagination.limit,
    );

    paginatedResponse(res, data, pagination, count);
  }

  /**
   * 최고 입찰가 조회
   * GET /auctions/:auctionId/bids/highest
   */
  async getHighest(req: Request, res: Response): Promise<void> {
    const { auctionId } = req.params;
    const bid = await bidService.getHighestBid(auctionId);
    successResponse(res, bid);
  }

  /**
   * 입찰 등록
   * POST /auctions/:auctionId/bids
   * - 인증 필요
   * - 활성 경매에만 입찰 가능
   * - 현재가보다 높은 금액만 가능
   * - 자기 경매에는 입찰 불가
   */
  async placeBid(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { auctionId } = req.params;
    const { amount } = req.body as z.infer<typeof placeBidSchema>;

    // 경매 존재 및 활성 상태 확인
    const auction = await auctionService.getById(auctionId);

    if (auction.status !== "active") {
      throw ApiError.badRequest("Auction is not active");
    }

    // 경매 종료 여부 확인
    const now = new Date();
    const endTime = new Date(auction.end_time);
    if (now > endTime) {
      throw ApiError.badRequest("Auction has ended");
    }

    // 본인 경매에 입찰 불가
    if (auction.seller_id === req.user!.id) {
      throw ApiError.badRequest("Cannot bid on your own auction");
    }

    // 최소 입찰금액 확인 - 현재가보다 높아야 함
    if (amount <= auction.current_price) {
      throw ApiError.badRequest(
        `Bid must be higher than current price: ${auction.current_price}`,
      );
    }

    // 입찰 등록
    const bid = await bidService.placeBid({
      auction_id: auctionId,
      bidder_id: req.user!.id,
      amount,
    });

    createdResponse(res, bid);
  }

  /**
   * 내 입찰 목록 조회
   * GET /bids/my
   */
  async getMyBids(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { page, limit } = req.query as unknown as z.infer<
      typeof bidQuerySchema
    >;
    const pagination = getPaginationParams(page, limit);

    const { data, count } = await bidService.getByUserId(
      req.user!.id,
      pagination.offset,
      pagination.limit,
    );

    paginatedResponse(res, data, pagination, count);
  }
}

export const bidController = new BidController();
