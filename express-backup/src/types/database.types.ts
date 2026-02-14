export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      auction_items: {
        Row: {
          address: string | null;
          appraised_value: number | null;
          case_number: string | null;
          created_at: string | null;
          id: string;
          item_type: string | null;
        };
        Insert: {
          address?: string | null;
          appraised_value?: number | null;
          case_number?: string | null;
          created_at?: string | null;
          id?: string;
          item_type?: string | null;
        };
        Update: {
          address?: string | null;
          appraised_value?: number | null;
          case_number?: string | null;
          created_at?: string | null;
          id?: string;
          item_type?: string | null;
        };
        Relationships: [];
      };
      auctions: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          seller_id: string;
          status: "draft" | "active" | "ended" | "cancelled";
          current_price: number;
          starting_price: number;
          end_time: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          seller_id: string;
          status?: "draft" | "active" | "ended" | "cancelled";
          current_price?: number;
          starting_price: number;
          end_time: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          seller_id?: string;
          status?: "draft" | "active" | "ended" | "cancelled";
          current_price?: number;
          starting_price?: number;
          end_time?: string;
          created_at?: string;
          updated_at?: string | null;
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
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      auction_recommendations_test: {
        Row: {
          address: string | null;
          appraisal_price: number | null;
          area: string | null;
          auction_date: string | null;
          case_info: string | null;
          created_at: string | null;
          id: string;
          image_url: string | null;
          min_price: number | null;
          special_rights: string | null;
          status: string | null;
        };
        Insert: {
          address?: string | null;
          appraisal_price?: number | null;
          area?: string | null;
          auction_date?: string | null;
          case_info?: string | null;
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          min_price?: number | null;
          special_rights?: string | null;
          status?: string | null;
        };
        Update: {
          address?: string | null;
          appraisal_price?: number | null;
          area?: string | null;
          auction_date?: string | null;
          case_info?: string | null;
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          min_price?: number | null;
          special_rights?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      auction_schedules: {
        Row: {
          auction_date: string | null;
          id: string;
          item_id: string | null;
          minimum_price: number | null;
          status: string | null;
        };
        Insert: {
          auction_date?: string | null;
          id?: string;
          item_id?: string | null;
          minimum_price?: number | null;
          status?: string | null;
        };
        Update: {
          auction_date?: string | null;
          id?: string;
          item_id?: string | null;
          minimum_price?: number | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "auction_schedules_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "auction_items";
            referencedColumns: ["id"];
          },
        ];
      };
      item_attachments: {
        Row: {
          file_type: string | null;
          file_url: string | null;
          id: string;
          item_id: string | null;
        };
        Insert: {
          file_type?: string | null;
          file_url?: string | null;
          id?: string;
          item_id?: string | null;
        };
        Update: {
          file_type?: string | null;
          file_url?: string | null;
          id?: string;
          item_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "item_attachments_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "auction_items";
            referencedColumns: ["id"];
          },
        ];
      };
      rights_analysis: {
        Row: {
          creditor: string | null;
          id: string;
          is_extinguished: boolean | null;
          item_id: string | null;
          rank: number | null;
          right_type: string | null;
        };
        Insert: {
          creditor?: string | null;
          id?: string;
          is_extinguished?: boolean | null;
          item_id?: string | null;
          rank?: number | null;
          right_type?: string | null;
        };
        Update: {
          creditor?: string | null;
          id?: string;
          is_extinguished?: boolean | null;
          item_id?: string | null;
          rank?: number | null;
          right_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rights_analysis_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "auction_items";
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"];
export type InsertTables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"];

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
