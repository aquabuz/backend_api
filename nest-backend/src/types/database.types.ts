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
      auction_recommendations_test: {
        Row: {
          id: string;
          image_url: string | null;
          case_info: string | null;
          address: string | null;
          area: string | null;
          special_rights: string | null;
          appraisal_price: number | null;
          min_price: number | null;
          status: string | null;
          auction_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url?: string | null;
          case_info?: string | null;
          address?: string | null;
          area?: string | null;
          special_rights?: string | null;
          appraisal_price?: number | null;
          min_price?: number | null;
          status?: string | null;
          auction_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          case_info?: string | null;
          address?: string | null;
          area?: string | null;
          special_rights?: string | null;
          appraisal_price?: number | null;
          min_price?: number | null;
          status?: string | null;
          auction_date?: string | null;
          created_at?: string;
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
export type AuctionRecommendationTest =
  Database['public']['Tables']['auction_recommendations_test']['Row'];
export interface AuctionFilters {
  status?: Auction['status'];
  sellerId?: string;
  search?: string;
}
