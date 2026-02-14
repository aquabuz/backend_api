import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { supabaseAdmin } from '../config/supabase';
import { Auction, AuctionFilters, AuctionInsert, AuctionUpdate } from '../types/database.types';

@Injectable()
export class AuctionService {
  private readonly table = 'auctions' as const;

  async getAll(
    filters: AuctionFilters = {},
    offset: number = 0,
    limit: number = 20,
  ): Promise<{ data: Auction[]; count: number }> {
    let query = supabaseAdmin.from(this.table).select('*', { count: 'exact' });
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.sellerId) query = query.eq('seller_id', filters.sellerId);
    if (filters.search) query = query.ilike('title', `%${filters.search}%`);
    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) throw new InternalServerErrorException(`Failed to fetch auctions: ${error.message}`);
    return { data: data || [], count: count || 0 };
  }

  async getById(id: string): Promise<Auction> {
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundException('Auction not found');
      throw new InternalServerErrorException(`Failed to fetch auction: ${error.message}`);
    }
    return data;
  }

  async create(auction: AuctionInsert): Promise<Auction> {
    const insertData: AuctionInsert = {
      ...auction,
      current_price: auction.starting_price,
      status: auction.status || 'draft',
      starting_price: auction.starting_price,
      end_time: auction.end_time,
    };
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .insert(insertData)
      .select()
      .single();
    if (error) throw new InternalServerErrorException(`Failed to create auction: ${error.message}`);
    return data;
  }

  async update(id: string, updates: AuctionUpdate): Promise<Auction> {
    const updateData: AuctionUpdate = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabaseAdmin
      .from(this.table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundException('Auction not found');
      throw new InternalServerErrorException(`Failed to update auction: ${error.message}`);
    }
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from(this.table)
      .delete()
      .eq('id', id);
    if (error) throw new InternalServerErrorException(`Failed to delete auction: ${error.message}`);
  }

  async getActive(offset: number = 0, limit: number = 20): Promise<{ data: Auction[]; count: number }> {
    return this.getAll({ status: 'active' }, offset, limit);
  }

  async updateStatus(id: string, status: Auction['status']): Promise<Auction> {
    return this.update(id, { status });
  }
}
