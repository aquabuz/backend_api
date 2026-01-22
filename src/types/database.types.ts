// Database types generated from Supabase
// Run: npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
// Or manually define your database schema types here

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      auctions: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          starting_price: number;
          current_price: number;
          seller_id: string;
          status: "draft" | "active" | "ended" | "cancelled";
          start_time: string;
          end_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          starting_price: number;
          current_price?: number;
          seller_id: string;
          status?: "draft" | "active" | "ended" | "cancelled";
          start_time: string;
          end_time: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          starting_price?: number;
          current_price?: number;
          seller_id?: string;
          status?: "draft" | "active" | "ended" | "cancelled";
          start_time?: string;
          end_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "auctions_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      auction_listings: {
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
      auction_recommendations: {
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
      bids: {
        Row: {
          id: string;
          auction_id: string;
          bidder_id: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          auction_id: string;
          bidder_id: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          auction_id?: string;
          bidder_id?: string;
          amount?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey";
            columns: ["auction_id"];
            isOneToOne: false;
            referencedRelation: "auctions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bids_bidder_id_fkey";
            columns: ["bidder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      auction_status: "draft" | "active" | "ended" | "cancelled";
    };
  };
}

// Type helpers
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
