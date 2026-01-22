/**
 * 헬스체크 라우트
 * 서버 상태 및 DB 연결 상태 확인용
 * URL: /api/v1/health
 */
import { Router } from "express";
import { healthController } from "../controllers";

const router = Router();

// GET /api/v1/health - 서버 상태 확인
router.get("/", (req, res) => healthController.check(req, res));

export default router;
