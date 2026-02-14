import { supabase } from '../config/supabase';

export class AuctionRecommendationService {
  async getRecommendations(): Promise<any[]> {
    const { data, error } = await supabase
      .from('auction_recommendations_test')
      .select('*')
      .order('created_at', { ascending: false });

    // 쿼리 결과 및 에러 로그 출력
    console.log('[Supabase] auction_recommendations_test data:', data);
    console.log('[Supabase] auction_recommendations_test error:', error);

    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
    ) {
      throw new Error((error as { message: string }).message);
    } else if (error) {
      throw new Error('Unknown error');
    }
    return Array.isArray(data) ? data : [];
  }
}
