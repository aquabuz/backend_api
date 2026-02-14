/**
 * 경매 라우트
 * 경매 관련 API 엔드포인트 정의
 * URL prefix: /api/v1/auctions
 */
import { Router } from "express";
import {
  auctionController,
  createAuctionSchema,
  updateAuctionSchema,
  auctionQuerySchema,
} from "../controllers";
import { validate, schemas } from "../middlewares";

const router = Router();

// ========== 공개 API (인증 없이 접근 가능) ==========

// GET /auctions - 경매 목록 조회
router.get("/", validate(auctionQuerySchema, "query"), (req, res) =>
  auctionController.getAll(req, res),
);

// GET /auctions/active - 활성 경매만 조회
router.get("/active", validate(auctionQuerySchema, "query"), (req, res) =>
  auctionController.getActive(req, res),
);

// GET /auctions/:id - 단일 경매 조회
router.get("/:id", validate(schemas.id, "params"), (req, res) =>
  auctionController.getById(req.params.id, res),
);

// ========== 보호된 API (인증 필요) ==========

// GET /auctions/my - 내 경매 목록

router.get("/my", validate(auctionQuerySchema, "query"), (req, res) =>
  auctionController.getMyAuctions(req, req.query, res),
);

// POST /auctions - 경매 생성

router.post(
  "/",
  validate(createAuctionSchema, "body"), // 요청 본문 유효성 검증
  (req, res) => auctionController.create(req.body, req, res),
);

// PUT /auctions/:id - 경매 수정

router.put(
  "/:id",
  validate(schemas.id, "params"), // ID 파라미터 검증
  validate(updateAuctionSchema, "body"),
  (req, res) => auctionController.update(req.params.id, req.body, req, res),
);

// DELETE /auctions/:id - 경매 삭제

router.delete("/:id", validate(schemas.id, "params"), (req, res) =>
  auctionController.delete(req.params.id, req, res),
);

// PATCH /auctions/:id/status - 경매 상태 변경

router.patch("/:id/status", validate(schemas.id, "params"), (req, res) =>
  auctionController.updateStatus(req.params.id, req.body.status, res),
);

export default router;
