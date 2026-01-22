/**
 * 입찰 라우트
 * 입찰 관련 API 엔드포인트 정의
 * routes/index.ts에서 루트("/")에 마운트됨
 */
import { Router } from "express";
import { bidController, placeBidSchema, bidQuerySchema } from "../controllers";
import { authenticate, validate, schemas } from "../middlewares";

const router = Router();

// ========== 공개 API ==========

// GET /auctions/:auctionId/bids - 경매의 입찰 목록 조회
router.get(
  "/auctions/:auctionId/bids",
  validate(bidQuerySchema, "query"),
  (req, res) => bidController.getByAuction(req, res),
);

// GET /auctions/:auctionId/bids/highest - 최고 입찰가 조회
router.get("/auctions/:auctionId/bids/highest", (req, res) =>
  bidController.getHighest(req, res),
);

// ========== 보호된 API ==========

// POST /auctions/:auctionId/bids - 입찰 등록
router.post(
  "/auctions/:auctionId/bids",
  authenticate, // 인증 필요
  validate(placeBidSchema, "body"), // 입찰금액 검증
  (req, res) => bidController.placeBid(req, res),
);

// GET /bids/my - 내 입찰 목록 조회
router.get(
  "/bids/my",
  authenticate,
  validate(bidQuerySchema, "query"),
  (req, res) => bidController.getMyBids(req, res),
);

export default router;
