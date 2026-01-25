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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointment_attendees: {
        Row: {
          appointment_id: string
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
        }
        Insert: {
          appointment_id: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          appointment_id?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_attendees_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          client_id: string
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number
          id: string
          location: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          scheduled_date: string
          scheduled_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          subject: string
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["appointment_visibility"]
          vp_notes: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          subject: string
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["appointment_visibility"]
          vp_notes?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          subject?: string
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["appointment_visibility"]
          vp_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          performed_at: string
          performed_by: string
          user_agent: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by: string
          user_agent?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      cases: {
        Row: {
          appointment_id: string | null
          assigned_to: string | null
          case_number: string
          closed_at: string | null
          closed_by: string | null
          created_at: string
          created_by: string
          deadline: string | null
          description: string | null
          id: string
          opened_at: string | null
          priority: Database["public"]["Enums"]["case_priority"]
          reopen_reason: string | null
          reopened_at: string | null
          reopened_by: string | null
          resolution_summary: string | null
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
          vp_notes: string | null
        }
        Insert: {
          appointment_id?: string | null
          assigned_to?: string | null
          case_number: string
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          created_by: string
          deadline?: string | null
          description?: string | null
          id?: string
          opened_at?: string | null
          priority?: Database["public"]["Enums"]["case_priority"]
          reopen_reason?: string | null
          reopened_at?: string | null
          reopened_by?: string | null
          resolution_summary?: string | null
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
          vp_notes?: string | null
        }
        Update: {
          appointment_id?: string | null
          assigned_to?: string | null
          case_number?: string
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          created_by?: string
          deadline?: string | null
          description?: string | null
          id?: string
          opened_at?: string | null
          priority?: Database["public"]["Enums"]["case_priority"]
          reopen_reason?: string | null
          reopened_at?: string | null
          reopened_by?: string | null
          resolution_summary?: string | null
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
          vp_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          client_type: Database["public"]["Enums"]["client_type"]
          contact_person: string | null
          created_at: string
          created_by: string | null
          district: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          notes: string | null
          organization_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          client_type?: Database["public"]["Enums"]["client_type"]
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          district?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          organization_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          client_type?: Database["public"]["Enums"]["client_type"]
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          district?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          organization_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      document_links: {
        Row: {
          document_id: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["document_entity_type"]
          id: string
          linked_at: string
          linked_by: string | null
        }
        Insert: {
          document_id: string
          entity_id?: string | null
          entity_type: Database["public"]["Enums"]["document_entity_type"]
          id?: string
          linked_at?: string
          linked_by?: string | null
        }
        Update: {
          document_id?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["document_entity_type"]
          id?: string
          linked_at?: string
          linked_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_links_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          description: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["document_entity_type"]
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_active: boolean
          is_current_version: boolean
          mime_type: string | null
          owner_role: string | null
          parent_document_id: string | null
          status: Database["public"]["Enums"]["document_status"]
          status_changed_at: string | null
          status_changed_by: string | null
          title: string | null
          uploaded_at: string
          uploaded_by: string | null
          version_number: number
        }
        Insert: {
          description?: string | null
          entity_id: string
          entity_type?: Database["public"]["Enums"]["document_entity_type"]
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_active?: boolean
          is_current_version?: boolean
          mime_type?: string | null
          owner_role?: string | null
          parent_document_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          status_changed_at?: string | null
          status_changed_by?: string | null
          title?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          version_number?: number
        }
        Update: {
          description?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["document_entity_type"]
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_active?: boolean
          is_current_version?: boolean
          mime_type?: string | null
          owner_role?: string | null
          parent_document_id?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          status_changed_at?: string | null
          status_changed_by?: string | null
          title?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      note_links: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["note_entity_type"]
          id: string
          note_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["note_entity_type"]
          id?: string
          note_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["note_entity_type"]
          id?: string
          note_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_links_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: true
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          owner_user_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          owner_user_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          owner_user_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: Database["public"]["Enums"]["notification_category"] | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["notification_category"] | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["notification_category"] | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      protocol_events: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["protocol_status"]
          status_changed_at: string
          status_changed_by: string | null
          updated_at: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["protocol_status"]
          status_changed_at?: string
          status_changed_by?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["protocol_status"]
          status_changed_at?: string
          status_changed_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_events_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          case_id: string
          channel: Database["public"]["Enums"]["reminder_channel"]
          created_at: string
          id: string
          is_sent: boolean
          reminder_date: string
          reminder_type: Database["public"]["Enums"]["reminder_type"]
          sent_at: string | null
        }
        Insert: {
          case_id: string
          channel?: Database["public"]["Enums"]["reminder_channel"]
          created_at?: string
          id?: string
          is_sent?: boolean
          reminder_date: string
          reminder_type: Database["public"]["Enums"]["reminder_type"]
          sent_at?: string | null
        }
        Update: {
          case_id?: string
          channel?: Database["public"]["Enums"]["reminder_channel"]
          created_at?: string
          id?: string
          is_sent?: boolean
          reminder_date?: string
          reminder_type?: Database["public"]["Enums"]["reminder_type"]
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
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
      get_protocol_attendees: {
        Args: { p_appointment_id?: string }
        Returns: {
          appointment_id: string
          created_at: string
          created_by: string
          id: string
          name: string
          role: string
        }[]
      }
      get_secretary_user_ids: { Args: never; Returns: string[] }
      get_vp_user_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_protocol: { Args: { _user_id: string }; Returns: boolean }
      is_secretary: { Args: { _user_id: string }; Returns: boolean }
      is_vp: { Args: { _user_id: string }; Returns: boolean }
      is_vp_or_secretary: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "vp" | "secretary" | "protocol"
      appointment_status:
        | "draft"
        | "pending_vp"
        | "approved"
        | "rejected"
        | "rescheduled"
        | "cancelled"
        | "completed"
      appointment_visibility: "vp_secretary" | "vp_only"
      audit_action:
        | "create"
        | "update"
        | "status_change"
        | "pdf_generate"
        | "priority_change"
        | "deadline_change"
        | "case_reopened"
        | "case_reopen_edit"
        | "case_reclosed"
        | "document_linked"
        | "document_viewed"
        | "document_downloaded"
        | "document_deactivated"
        | "note_created"
        | "note_updated"
        | "note_deleted"
        | "note_linked"
        | "note_unlinked"
        | "notification_created"
        | "notification_read"
        | "document_status_changed"
        | "document_version_created"
      case_priority: "high" | "medium" | "low"
      case_status:
        | "draft"
        | "open"
        | "in_progress"
        | "parked"
        | "closed"
        | "reopened"
      client_type: "person" | "organization"
      document_entity_type: "case" | "guest" | "appointment" | "none"
      document_status: "draft" | "final" | "archived"
      note_entity_type: "guest" | "appointment" | "case"
      notification_category: "case" | "appointment" | "document" | "system"
      protocol_status:
        | "expected"
        | "arrived"
        | "assisted"
        | "no_show"
        | "completed"
      reminder_channel: "in_app" | "email"
      reminder_type: "upcoming_deadline" | "overdue"
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
      app_role: ["vp", "secretary", "protocol"],
      appointment_status: [
        "draft",
        "pending_vp",
        "approved",
        "rejected",
        "rescheduled",
        "cancelled",
        "completed",
      ],
      appointment_visibility: ["vp_secretary", "vp_only"],
      audit_action: [
        "create",
        "update",
        "status_change",
        "pdf_generate",
        "priority_change",
        "deadline_change",
        "case_reopened",
        "case_reopen_edit",
        "case_reclosed",
        "document_linked",
        "document_viewed",
        "document_downloaded",
        "document_deactivated",
        "note_created",
        "note_updated",
        "note_deleted",
        "note_linked",
        "note_unlinked",
        "notification_created",
        "notification_read",
        "document_status_changed",
        "document_version_created",
      ],
      case_priority: ["high", "medium", "low"],
      case_status: [
        "draft",
        "open",
        "in_progress",
        "parked",
        "closed",
        "reopened",
      ],
      client_type: ["person", "organization"],
      document_entity_type: ["case", "guest", "appointment", "none"],
      document_status: ["draft", "final", "archived"],
      note_entity_type: ["guest", "appointment", "case"],
      notification_category: ["case", "appointment", "document", "system"],
      protocol_status: [
        "expected",
        "arrived",
        "assisted",
        "no_show",
        "completed",
      ],
      reminder_channel: ["in_app", "email"],
      reminder_type: ["upcoming_deadline", "overdue"],
    },
  },
} as const
