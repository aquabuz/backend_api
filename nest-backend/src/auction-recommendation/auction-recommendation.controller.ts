import { Controller, Get } from '@nestjs/common';
import { AuctionRecommendationService } from './auction-recommendation.service';

@Controller('auction-recommendation')
export class AuctionRecommendationController {
  constructor(
    private readonly auctionRecommendationService: AuctionRecommendationService,
  ) {}

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
      function isErrorWithMessage(e: unknown): e is { message: string } {
        return (
          typeof e === 'object' &&
          e !== null &&
          'message' in e &&
          typeof (e as { message?: unknown })?.message === 'string'
        );
      }
      const message = isErrorWithMessage(error)
        ? (error as { message: string }).message
        : '추천 경매 목록 조회 실패';
      return {
        success: false,
        data: [],
        message,
      };
    }
  }
}
