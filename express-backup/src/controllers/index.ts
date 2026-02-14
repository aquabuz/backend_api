export * from "./auction.controller";
import { AuctionController } from "./auction.controller";
import { AuctionService } from "../services/auction.service";
export const auctionController = new AuctionController(new AuctionService());
export * from "./bid.controller";
export * from "./health.controller";
export * from "./user.controller";
