import { Module } from '@nestjs/common';
import { AuctionRecommendationController } from './auction-recommendation.controller';
import { AuctionRecommendationService } from './auction-recommendation.service';

@Module({
  controllers: [AuctionRecommendationController],
  providers: [AuctionRecommendationService],
})
export class AuctionRecommendationModule {}
