import { Controller, Get } from '@nestjs/common';
import { AuctionRecommendationService } from './auction-recommendation.service';

@Controller('auction-recommendation')
export class AuctionRecommendationController {
  constructor(private readonly auctionRecommendationService: AuctionRecommendationService) {}

  @Get()
  async getRecommendations() {
    try {
      const data = await this.auctionRecommendationService.getRecommendations();
      return {
        success: true,
        data,
        message: '추천 경매 목록 조회 성공',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.message || '추천 경매 목록 조회 실패',
      };
    }
  }
}
