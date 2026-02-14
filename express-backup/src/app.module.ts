import { Module } from "@nestjs/common";
import { AuctionController } from "./controllers/auction.controller";
import { AuctionService } from "./services/auction.service";

@Module({
  imports: [],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AppModule {}
