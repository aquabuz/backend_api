import { Router } from "express";
import { getAuctionRecommendations } from "../controllers/auctionRecommendation.controller";

const router = Router();

// GET /auction-recommendations
router.get("/", getAuctionRecommendations);

export default router;
