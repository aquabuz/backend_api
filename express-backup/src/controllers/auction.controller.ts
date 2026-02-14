/**
 * 경매 컨트롤러
 * HTTP 요청을 받아 서비스를 호출하고 응답을 반환
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { z } from "zod";
import { AuctionService } from "../services/auction.service";
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

@Controller("auction")
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  async getAll(@Query() query: any, @Res() res: Response): Promise<void> {
    const { page, limit, status, search } = query;
    const pagination = getPaginationParams(page, limit);
    const filters: any = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    const { data, count } = await this.auctionService.getAll(
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
  @Get("active")
  async getActive(@Query() query: any, @Res() res: Response): Promise<void> {
    const { page, limit } = query;
    const pagination = getPaginationParams(page, limit);
    const { data, count } = await this.auctionService.getActive(
      pagination.offset,
      pagination.limit,
    );
    paginatedResponse(res, data, pagination, count);
  }

  /**
   * 단일 경매 조회
   * GET /auctions/:id
   */
  @Get(":id")
  async getById(@Param("id") id: string, @Res() res: Response): Promise<void> {
    const auction = await this.auctionService.getById(id);
    successResponse(res, auction);
  }

  /**
   * 경매 생성
   * POST /auctions
   * - 인증 필요
   */
  @Post()
  async create(
    @Body() auctionData: any,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const auction = await this.auctionService.create({
      ...auctionData,
      seller_id: req.user?.id,
    });
    createdResponse(res, auction);
  }

  /**
   * 경매 수정
   * PUT /auctions/:id
   * - 인증 필요, 소유자만 가능
   */
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updates: any,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const existing = await this.auctionService.getById(id);
    if (existing.seller_id !== req.user?.id) {
      throw new Error("Unauthorized to update this auction");
    }
    const auction = await this.auctionService.update(id, updates);
    successResponse(res, auction);
  }

  /**
   * 경매 삭제
   * DELETE /auctions/:id
   * - 인증 필요, 소유자만 가능
   */
  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<void> {
    const existing = await this.auctionService.getById(id);
    if (existing.seller_id !== req.user?.id) {
      throw new Error("Unauthorized to delete this auction");
    }
    await this.auctionService.delete(id);
    noContentResponse(res);
  }

  /**
   * 경매 상태 변경
   * PATCH /auctions/:id/status
   */
  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: string,
    @Res() res: Response,
  ): Promise<void> {
    // 상태 값 검증 및 변환
    const allowedStatuses = ["draft", "active", "ended", "cancelled"] as const;
    if (!allowedStatuses.includes(status as any)) {
      throw new Error("Invalid status value");
    }
    const typedStatus = status as (typeof allowedStatuses)[number];
    const auction = await this.auctionService.updateStatus(id, typedStatus);
    successResponse(res, auction);
  }

  /**
   * 내 경매 목록 조회
   * GET /auctions/my
   * - 인증 필요
   */
  @Get("my")
  async getMyAuctions(
    @Req() req: any,
    @Query() query: any,
    @Res() res: Response,
  ): Promise<void> {
    const { page, limit } = query;
    const pagination = getPaginationParams(page, limit);
    const { data, count } = await this.auctionService.getAll(
      { sellerId: req.user?.id },
      pagination.offset,
      pagination.limit,
    );
    paginatedResponse(res, data, pagination, count);
  }
}
