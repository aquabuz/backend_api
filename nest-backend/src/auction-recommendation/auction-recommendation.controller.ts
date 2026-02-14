import { Controller, Get } from '@nestjs/common';

@Controller('auction-recommendation')
export class AuctionRecommendationController {
  @Get()
  getHello() {
    return {
      success: true,
      data: [],
      message: 'auction-recommendation works!',
    };
  }
}
