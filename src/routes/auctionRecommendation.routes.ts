import { Router } from "express";
import { getAuctionRecommendations } from "../controllers/auctionRecommendation.controller";

const router = Router();

// GET /auction-recommendations-test
router.get("/", getAuctionRecommendations);

export default router;
