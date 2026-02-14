import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionService {
	async getAll(query: any): Promise<any> {
		// TODO: DB 연동 및 페이징/필터 구현
		return [];
	}
	async getActive(query: any): Promise<any> {
		return [];
	}
	async getById(id: string): Promise<any> {
		return {};
	}
	async create(data: any): Promise<any> {
		return data;
	}
	async update(id: string, updates: any): Promise<any> {
		return updates;
	}
	async delete(id: string): Promise<any> {
		return { id };
	}
	async updateStatus(id: string, status: string): Promise<any> {
		return { id, status };
	}
}
