import { Injectable } from '@nestjs/common';
import { supabase } from '../config/supabase';
import { Database } from '../types/database.types';

@Injectable()
export class AuctionRecommendationService {
  async getRecommendations(): Promise<
    Database['public']['Tables']['auction_recommendations']['Row'][]
  > {
    const { data, error } = await supabase
      .from('auction_recommendations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  }
}
