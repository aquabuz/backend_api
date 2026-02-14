export * from '../../../src/types/database.types';

// NestJS에서 사용할 Auction 관련 타입 alias
import type { Database } from '../../../src/types/database.types';

export type Auction = Database['public']['Tables']['auctions']['Row'];
export type AuctionInsert = Database['public']['Tables']['auctions']['Insert'];
export type AuctionUpdate = Database['public']['Tables']['auctions']['Update'];
export interface AuctionFilters {
  status?: Auction['status'];
  sellerId?: string;
  search?: string;
}
