export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      auctions: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: string;
          seller_id: string;
          starting_price: number;
          current_price: number;
          end_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          status?: string;
          seller_id: string;
          starting_price: number;
          current_price?: number;
          end_time: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: string;
          seller_id?: string;
          starting_price?: number;
          current_price?: number;
          end_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      // ...다른 테이블 정의 필요시 추가
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export type Auction = Database['public']['Tables']['auctions']['Row'];
export type AuctionInsert = Database['public']['Tables']['auctions']['Insert'];
export type AuctionUpdate = Database['public']['Tables']['auctions']['Update'];
export interface AuctionFilters {
  status?: Auction['status'];
  sellerId?: string;
  search?: string;
}
