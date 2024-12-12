export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      plans: {
        Row: {
          description: string | null
          id: string
          interval: string | null
          intervalCount: number | null
          isUsageBased: boolean | null
          name: string
          price: number
          productId: number
          productName: string
          sort: number | null
          trialInterval: string | null
          trialIntervalCount: number | null
          variantId: number
        }
        Insert: {
          description?: string | null
          id?: string
          interval?: string | null
          intervalCount?: number | null
          isUsageBased?: boolean | null
          name: string
          price: number
          productId: number
          productName: string
          sort?: number | null
          trialInterval?: string | null
          trialIntervalCount?: number | null
          variantId: number
        }
        Update: {
          description?: string | null
          id?: string
          interval?: string | null
          intervalCount?: number | null
          isUsageBased?: boolean | null
          name?: string
          price?: number
          productId?: number
          productName?: string
          sort?: number | null
          trialInterval?: string | null
          trialIntervalCount?: number | null
          variantId?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          email: string | null
          id: string
        }
        Insert: {
          avatar?: string | null
          email?: string | null
          id: string
        }
        Update: {
          avatar?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          email: string
          endsAt: string | null
          id: number
          isPaused: boolean | null
          isUsageBased: boolean | null
          lemonsqueezyId: string
          name: string
          orderId: number
          planId: string
          price: number
          renewsAt: string | null
          status: string
          statusFormatted: string
          subscriptionItemId: number | null
          trialEndsAt: string | null
          userId: string
        }
        Insert: {
          email: string
          endsAt?: string | null
          id?: never
          isPaused?: boolean | null
          isUsageBased?: boolean | null
          lemonsqueezyId: string
          name: string
          orderId: number
          planId: string
          price: number
          renewsAt?: string | null
          status: string
          statusFormatted: string
          subscriptionItemId?: number | null
          trialEndsAt?: string | null
          userId: string
        }
        Update: {
          email?: string
          endsAt?: string | null
          id?: never
          isPaused?: boolean | null
          isUsageBased?: boolean | null
          lemonsqueezyId?: string
          name?: string
          orderId?: number
          planId?: string
          price?: number
          renewsAt?: string | null
          status?: string
          statusFormatted?: string
          subscriptionItemId?: number | null
          trialEndsAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_planid_fkey"
            columns: ["planId"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_event: {
        Row: {
          body: Json
          createdAt: string
          eventName: string
          id: number
          processed: boolean | null
          processingError: string | null
        }
        Insert: {
          body: Json
          createdAt?: string
          eventName: string
          id?: never
          processed?: boolean | null
          processingError?: string | null
        }
        Update: {
          body?: Json
          createdAt?: string
          eventName?: string
          id?: never
          processed?: boolean | null
          processingError?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
