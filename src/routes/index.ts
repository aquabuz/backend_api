/**
 * 메인 라우터 - 모든 API 라우트를 여기서 조합함
 * app.ts에서 /api/v1 prefix로 마운트됨
 */
import { Router } from "express";

import auctionRoutes from "./auction.routes";
import bidRoutes from "./bid.routes";
import healthRoutes from "./health.routes";
import userRoutes from "./user.routes";
import auctionRecommendationRoutes from "./auctionRecommendation.routes";

const router = Router();

// 헬스체크 라우트 - 서버 상태 및 DB 연결 확인용
// 최종 URL: /api/v1/health
router.use("/health", healthRoutes);

// 경매 관련 라우트 - 경매 CRUD
// 최종 URL: /api/v1/auctions/*
router.use("/auctions", auctionRoutes);

// 입찰 관련 라우트 - 루트에 마운트 (내부에서 /auctions/:id/bids 등으로 정의됨)
router.use("/", bidRoutes);

// 사용자 관련 라우트 - /users
// 최종 URL: /api/v1/users

// 경매 추천 리스트 라우트
// 최종 URL: /api/v1/auction-recommendations-test, /api/v1/auction-recommendation
router.use("/auction-recommendations-test", auctionRecommendationRoutes);
router.use("/auction-recommendation", auctionRecommendationRoutes);
router.use("/users", userRoutes);

export default router;
