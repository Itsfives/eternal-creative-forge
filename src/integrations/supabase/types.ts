export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          metadata: Json | null
          status: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      client_communications: {
        Row: {
          attachments: Json | null
          created_at: string
          from_name: string
          from_role: string | null
          from_user_id: string | null
          id: string
          is_unread: boolean
          message: string
          message_type: string
          priority: string
          project_id: string | null
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          from_name: string
          from_role?: string | null
          from_user_id?: string | null
          id?: string
          is_unread?: boolean
          message: string
          message_type?: string
          priority?: string
          project_id?: string | null
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          from_name?: string
          from_role?: string | null
          from_user_id?: string | null
          id?: string
          is_unread?: boolean
          message?: string
          message_type?: string
          priority?: string
          project_id?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_communications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_projects: {
        Row: {
          budget: number | null
          client_company: string | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          name: string
          next_milestone: string | null
          phase: string | null
          priority: string
          progress: number
          status: string
          team_lead: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          client_company?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          name: string
          next_milestone?: string | null
          phase?: string | null
          priority?: string
          progress?: number
          status?: string
          team_lead?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          client_company?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          name?: string
          next_milestone?: string | null
          phase?: string | null
          priority?: string
          progress?: number
          status?: string
          team_lead?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          created_at: string
          file_size: number
          file_type: string
          filename: string
          id: string
          original_name: string
          url: string
          user_id: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_size: number
          file_type: string
          filename: string
          id?: string
          original_name: string
          url: string
          user_id: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          original_name?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_per_item: number
          product_id: string
          quantity: number
          total_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_per_item: number
          product_id: string
          quantity?: number
          total_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_per_item?: number
          product_id?: string
          quantity?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          id: string
          order_number: string
          payment_method: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          order_number: string
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          order_number?: string
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          meta_description: string | null
          slug: string
          status: string
          template: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          slug: string
          status?: string
          template?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          slug?: string
          status?: string
          template?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          category: string
          challenges: string | null
          client: string | null
          completed_date: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          github_url: string | null
          id: string
          images: string[] | null
          live_url: string | null
          results: string | null
          slug: string
          solutions: string | null
          status: string
          technologies: string[] | null
          testimonial: string | null
          testimonial_author: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          challenges?: string | null
          client?: string | null
          completed_date?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          images?: string[] | null
          live_url?: string | null
          results?: string | null
          slug: string
          solutions?: string | null
          status?: string
          technologies?: string[] | null
          testimonial?: string | null
          testimonial_author?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          challenges?: string | null
          client?: string | null
          completed_date?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          github_url?: string | null
          id?: string
          images?: string[] | null
          live_url?: string | null
          results?: string | null
          slug?: string
          solutions?: string | null
          status?: string
          technologies?: string[] | null
          testimonial?: string | null
          testimonial_author?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          provider: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          provider?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          provider?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_team_members: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          project_id: string | null
          project_role: Database["public"]["Enums"]["project_role"]
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          project_id?: string | null
          project_role: Database["public"]["Enums"]["project_role"]
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          project_id?: string | null
          project_role?: Database["public"]["Enums"]["project_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "client_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_id: string | null
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_id?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_id?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      store_products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          features: string[] | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          name: string
          preview_image_url: string | null
          price: number
          status: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          name: string
          preview_image_url?: string | null
          price: number
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          name?: string
          preview_image_url?: string | null
          price?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_purchases: {
        Row: {
          amount_paid: number
          created_at: string
          download_count: number | null
          download_limit: number | null
          expires_at: string | null
          id: string
          product_id: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          download_count?: number | null
          download_limit?: number | null
          expires_at?: string | null
          id?: string
          product_id: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          download_count?: number | null
          download_limit?: number | null
          expires_at?: string | null
          id?: string
          product_id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_project_role: {
        Args: {
          p_assigned_by?: string
          p_project_id: string
          p_role: Database["public"]["Enums"]["project_role"]
          p_user_id: string
        }
        Returns: string
      }
      create_notification: {
        Args: {
          p_data?: Json
          p_message: string
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: string
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_project_team_members: {
        Args: { p_project_id: string }
        Returns: {
          assigned_at: string
          avatar_url: string
          display_name: string
          email: string
          project_role: Database["public"]["Enums"]["project_role"]
          user_id: string
        }[]
      }
      get_safe_public_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          created_at: string
          display_id: string
          display_name: string
        }[]
      }
      get_user_projects_with_roles: {
        Args: { p_user_id: string }
        Returns: {
          assigned_at: string
          project_description: string
          project_id: string
          project_name: string
          project_priority: string
          project_role: Database["public"]["Enums"]["project_role"]
          project_status: string
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      remove_project_member: {
        Args: {
          p_project_id: string
          p_role?: Database["public"]["Enums"]["project_role"]
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "cms_editor" | "client"
      project_role: "owner" | "project_manager" | "developer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "cms_editor", "client"],
      project_role: ["owner", "project_manager", "developer"],
    },
  },
} as const
