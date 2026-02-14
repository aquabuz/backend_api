
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, Req, Res, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuctionService } from './auction.service';

@Controller('auction')
export class AuctionController {
	constructor(private readonly auctionService: AuctionService) {}

	@Get()
	async getAll(@Query() query: any): Promise<any> {
		// TODO: 서비스 연결 및 페이징/필터 구현
		return this.auctionService.getAll(query);
	}

	@Get('active')
	async getActive(@Query() query: any): Promise<any> {
		return this.auctionService.getActive(query);
	}

	@Get(':id')
	async getById(@Param('id') id: string): Promise<any> {
		return this.auctionService.getById(id);
	}

	@Post()
	async create(@Body() auctionData: any, @Req() req: any): Promise<any> {
		// req.user는 추후 AuthGuard 적용 시 구현
		return this.auctionService.create({ ...auctionData, seller_id: req.user?.id });
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() updates: any, @Req() req: any): Promise<any> {
		// 인증/권한 체크는 추후 구현
		return this.auctionService.update(id, updates);
	}

	@Delete(':id')
	async delete(@Param('id') id: string, @Req() req: any): Promise<any> {
		// 인증/권한 체크는 추후 구현
		return this.auctionService.delete(id);
	}

	@Patch(':id/status')
	async updateStatus(@Param('id') id: string, @Body('status') status: string): Promise<any> {
		return this.auctionService.updateStatus(id, status);
	}

	@Get('my')
	async getMyAuctions(@Req() req: any, @Query() query: any): Promise<any> {
		// req.user는 추후 AuthGuard 적용 시 구현
		return this.auctionService.getAll({ ...query, sellerId: req.user?.id });
	}
}
