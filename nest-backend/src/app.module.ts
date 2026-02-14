import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuctionModule } from './auction/auction.module';

@Module({
  imports: [AuctionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
