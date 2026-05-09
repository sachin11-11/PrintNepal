export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          role: "customer" | "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: string | null;
          description: string | null;
          specifications: string | null;
          image_url: string | null;
          base_price: number;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category?: string | null;
          description?: string | null;
          specifications?: string | null;
          image_url?: string | null;
          base_price?: number;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: string | null;
          description?: string | null;
          specifications?: string | null;
          image_url?: string | null;
          base_price?: number;
          is_featured?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      materials: {
        Row: {
          id: string;
          name: string;
          type: string | null;
          size: string | null;
          finish: string | null;
          price_modifier: number;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          type?: string | null;
          size?: string | null;
          finish?: string | null;
          price_modifier?: number;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string | null;
          size?: string | null;
          finish?: string | null;
          price_modifier?: number;
          description?: string | null;
        };
        Relationships: [];
      };
      product_designs: {
        Row: {
          id: string;
          service_id: string | null;
          title: string;
          category: string | null;
          description: string | null;
          image_url: string | null;
          price: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_id?: string | null;
          title: string;
          category?: string | null;
          description?: string | null;
          image_url?: string | null;
          price?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string | null;
          title?: string;
          category?: string | null;
          description?: string | null;
          image_url?: string | null;
          price?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_designs_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
      product_templates: {
        Row: {
          id: string;
          service_id: string | null;
          title: string;
          slug: string;
          category: string | null;
          thumbnail_url: string | null;
          template_json: Json;
          editable_fields: Json;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_id?: string | null;
          title: string;
          slug: string;
          category?: string | null;
          thumbnail_url?: string | null;
          template_json?: Json;
          editable_fields?: Json;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string | null;
          title?: string;
          slug?: string;
          category?: string | null;
          thumbnail_url?: string | null;
          template_json?: Json;
          editable_fields?: Json;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_templates_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          email: string;
          phone: string | null;
          service_id: string | null;
          selected_design_id: string | null;
          selected_template_id: string | null;
          final_design_url: string | null;
          final_design_json: Json | null;
          customer_lat: number | null;
          customer_lng: number | null;
          delivery_distance_km: number | null;
          estimated_delivery_minutes: number | null;
          estimated_completion_minutes: number | null;
          whatsapp_link: string | null;
          payment_status: "pending" | "confirmed" | "paid" | "failed" | "refunded";
          paper_size: string | null;
          paper_type: string | null;
          quantity: number;
          design_method: "uploaded" | "email_design" | "need_design";
          design_file_url: string | null;
          notes: string | null;
          status: "received" | "designing" | "printing" | "ready" | "delivered" | "cancelled";
          total_estimate: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          email: string;
          phone?: string | null;
          service_id?: string | null;
          selected_design_id?: string | null;
          selected_template_id?: string | null;
          final_design_url?: string | null;
          final_design_json?: Json | null;
          customer_lat?: number | null;
          customer_lng?: number | null;
          delivery_distance_km?: number | null;
          estimated_delivery_minutes?: number | null;
          estimated_completion_minutes?: number | null;
          whatsapp_link?: string | null;
          payment_status?: "pending" | "confirmed" | "paid" | "failed" | "refunded";
          paper_size?: string | null;
          paper_type?: string | null;
          quantity?: number;
          design_method: "uploaded" | "email_design" | "need_design";
          design_file_url?: string | null;
          notes?: string | null;
          status?: "received" | "designing" | "printing" | "ready" | "delivered" | "cancelled";
          total_estimate?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          email?: string;
          phone?: string | null;
          service_id?: string | null;
          selected_design_id?: string | null;
          selected_template_id?: string | null;
          final_design_url?: string | null;
          final_design_json?: Json | null;
          customer_lat?: number | null;
          customer_lng?: number | null;
          delivery_distance_km?: number | null;
          estimated_delivery_minutes?: number | null;
          estimated_completion_minutes?: number | null;
          whatsapp_link?: string | null;
          payment_status?: "pending" | "confirmed" | "paid" | "failed" | "refunded";
          paper_size?: string | null;
          paper_type?: string | null;
          quantity?: number;
          design_method?: "uploaded" | "email_design" | "need_design";
          design_file_url?: string | null;
          notes?: string | null;
          status?: "received" | "designing" | "printing" | "ready" | "delivered" | "cancelled";
          total_estimate?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
      order_messages: {
        Row: {
          id: string;
          order_id: string;
          sender_type: "customer" | "admin";
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          sender_type: "customer" | "admin";
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          sender_type?: "customer" | "admin";
          message?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_messages_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type MaterialRow = Database["public"]["Tables"]["materials"]["Row"];
export type ProductDesignRow = Database["public"]["Tables"]["product_designs"]["Row"];
export type ProductTemplateRow = Database["public"]["Tables"]["product_templates"]["Row"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderStatus = OrderRow["status"];
