import { Router } from "express";
import { getAllUsers } from "../controllers";

const router = Router();

// GET /users - 모든 사용자 조회 (보호된 API)
router.get("/", getAllUsers);

export default router;
