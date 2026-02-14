import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuctionModule } from './auction/auction.module';
import { AuctionRecommendationModule } from './auction-recommendation/auction-recommendation.module';

@Module({
  imports: [AuctionModule, AuctionRecommendationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
