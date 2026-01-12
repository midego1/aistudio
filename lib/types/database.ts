export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      account: {
        Row: {
          access_token: string | null;
          access_token_expires_at: string | null;
          account_id: string;
          created_at: string;
          id: string;
          id_token: string | null;
          password: string | null;
          provider_id: string;
          refresh_token: string | null;
          refresh_token_expires_at: string | null;
          scope: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          access_token?: string | null;
          access_token_expires_at?: string | null;
          account_id: string;
          created_at?: string;
          id: string;
          id_token?: string | null;
          password?: string | null;
          provider_id: string;
          refresh_token?: string | null;
          refresh_token_expires_at?: string | null;
          scope?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          access_token?: string | null;
          access_token_expires_at?: string | null;
          account_id?: string;
          created_at?: string;
          id?: string;
          id_token?: string | null;
          password?: string | null;
          provider_id?: string;
          refresh_token?: string | null;
          refresh_token_expires_at?: string | null;
          scope?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "account_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      affiliate_earning: {
        Row: {
          affiliate_relationship_id: string;
          affiliate_workspace_id: string;
          commission_percent: number;
          created_at: string;
          earning_amount_ore: number;
          id: string;
          invoice_amount_ore: number;
          invoice_id: string;
          paid_out_at: string | null;
          paid_out_reference: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          affiliate_relationship_id: string;
          affiliate_workspace_id: string;
          commission_percent: number;
          created_at?: string;
          earning_amount_ore: number;
          id: string;
          invoice_amount_ore: number;
          invoice_id: string;
          paid_out_at?: string | null;
          paid_out_reference?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          affiliate_relationship_id?: string;
          affiliate_workspace_id?: string;
          commission_percent?: number;
          created_at?: string;
          earning_amount_ore?: number;
          id?: string;
          invoice_amount_ore?: number;
          invoice_id?: string;
          paid_out_at?: string | null;
          paid_out_reference?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "affiliate_earning_affiliate_relationship_id_affiliate_relations";
            columns: ["affiliate_relationship_id"];
            isOneToOne: false;
            referencedRelation: "affiliate_relationship";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "affiliate_earning_affiliate_workspace_id_workspace_id_fk";
            columns: ["affiliate_workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "affiliate_earning_invoice_id_invoice_id_fk";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoice";
            referencedColumns: ["id"];
          },
        ];
      };
      affiliate_relationship: {
        Row: {
          affiliate_workspace_id: string;
          commission_percent: number;
          created_at: string;
          id: string;
          is_active: boolean;
          notes: string | null;
          referred_workspace_id: string;
          updated_at: string;
        };
        Insert: {
          affiliate_workspace_id: string;
          commission_percent?: number;
          created_at?: string;
          id: string;
          is_active?: boolean;
          notes?: string | null;
          referred_workspace_id: string;
          updated_at?: string;
        };
        Update: {
          affiliate_workspace_id?: string;
          commission_percent?: number;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          notes?: string | null;
          referred_workspace_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "affiliate_relationship_affiliate_workspace_id_workspace_id_fk";
            columns: ["affiliate_workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "affiliate_relationship_referred_workspace_id_workspace_id_fk";
            columns: ["referred_workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      image_generation: {
        Row: {
          created_at: string;
          error_message: string | null;
          id: string;
          metadata: Json | null;
          original_image_url: string;
          parent_id: string | null;
          project_id: string;
          prompt: string;
          result_image_url: string | null;
          status: string;
          updated_at: string;
          user_id: string;
          version: number;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          error_message?: string | null;
          id: string;
          metadata?: Json | null;
          original_image_url: string;
          parent_id?: string | null;
          project_id: string;
          prompt: string;
          result_image_url?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
          version?: number;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          metadata?: Json | null;
          original_image_url?: string;
          parent_id?: string | null;
          project_id?: string;
          prompt?: string;
          result_image_url?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
          version?: number;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "image_generation_project_id_project_id_fk";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "image_generation_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "image_generation_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      invitation: {
        Row: {
          accepted_at: string | null;
          created_at: string;
          email: string;
          expires_at: string;
          id: string;
          role: string;
          token: string;
          workspace_id: string;
        };
        Insert: {
          accepted_at?: string | null;
          created_at?: string;
          email: string;
          expires_at: string;
          id: string;
          role?: string;
          token: string;
          workspace_id: string;
        };
        Update: {
          accepted_at?: string | null;
          created_at?: string;
          email?: string;
          expires_at?: string;
          id?: string;
          role?: string;
          token?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invitation_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice: {
        Row: {
          created_at: string;
          currency: string;
          due_date: string | null;
          fiken_contact_id: number | null;
          fiken_invoice_id: number | null;
          fiken_invoice_number: string | null;
          id: string;
          issue_date: string | null;
          notes: string | null;
          paid_at: string | null;
          status: string;
          total_amount_ore: number;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          fiken_contact_id?: number | null;
          fiken_invoice_id?: number | null;
          fiken_invoice_number?: string | null;
          id: string;
          issue_date?: string | null;
          notes?: string | null;
          paid_at?: string | null;
          status?: string;
          total_amount_ore: number;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          currency?: string;
          due_date?: string | null;
          fiken_contact_id?: number | null;
          fiken_invoice_id?: number | null;
          fiken_invoice_number?: string | null;
          id?: string;
          issue_date?: string | null;
          notes?: string | null;
          paid_at?: string | null;
          status?: string;
          total_amount_ore?: number;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_line_item: {
        Row: {
          amount_ore: number;
          created_at: string;
          description: string;
          id: string;
          invoice_id: string | null;
          project_id: string | null;
          quantity: number;
          status: string;
          updated_at: string;
          video_project_id: string | null;
          workspace_id: string;
        };
        Insert: {
          amount_ore: number;
          created_at?: string;
          description: string;
          id: string;
          invoice_id?: string | null;
          project_id?: string | null;
          quantity?: number;
          status?: string;
          updated_at?: string;
          video_project_id?: string | null;
          workspace_id: string;
        };
        Update: {
          amount_ore?: number;
          created_at?: string;
          description?: string;
          id?: string;
          invoice_id?: string | null;
          project_id?: string | null;
          quantity?: number;
          status?: string;
          updated_at?: string;
          video_project_id?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_line_item_invoice_id_invoice_id_fk";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoice";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_line_item_project_id_project_id_fk";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "project";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_line_item_video_project_id_video_project_id_fk";
            columns: ["video_project_id"];
            isOneToOne: false;
            referencedRelation: "video_project";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_line_item_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      music_track: {
        Row: {
          artist: string | null;
          attribution: string | null;
          audio_url: string;
          bpm: number | null;
          category: string;
          created_at: string;
          duration_seconds: number;
          id: string;
          is_active: boolean;
          license_type: string;
          mood: string | null;
          name: string;
          preview_url: string | null;
          waveform_url: string | null;
        };
        Insert: {
          artist?: string | null;
          attribution?: string | null;
          audio_url: string;
          bpm?: number | null;
          category: string;
          created_at?: string;
          duration_seconds: number;
          id: string;
          is_active?: boolean;
          license_type?: string;
          mood?: string | null;
          name: string;
          preview_url?: string | null;
          waveform_url?: string | null;
        };
        Update: {
          artist?: string | null;
          attribution?: string | null;
          audio_url?: string;
          bpm?: number | null;
          category?: string;
          created_at?: string;
          duration_seconds?: number;
          id?: string;
          is_active?: boolean;
          license_type?: string;
          mood?: string | null;
          name?: string;
          preview_url?: string | null;
          waveform_url?: string | null;
        };
        Relationships: [];
      };
      project: {
        Row: {
          completed_count: number;
          created_at: string;
          id: string;
          image_count: number;
          name: string;
          room_type: string | null;
          status: string;
          style_template_id: string;
          thumbnail_url: string | null;
          updated_at: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          completed_count?: number;
          created_at?: string;
          id: string;
          image_count?: number;
          name: string;
          room_type?: string | null;
          status?: string;
          style_template_id: string;
          thumbnail_url?: string | null;
          updated_at?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          completed_count?: number;
          created_at?: string;
          id?: string;
          image_count?: number;
          name?: string;
          room_type?: string | null;
          status?: string;
          style_template_id?: string;
          thumbnail_url?: string | null;
          updated_at?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      project_payment: {
        Row: {
          amount_cents: number;
          created_at: string;
          currency: string;
          id: string;
          invoice_line_item_id: string | null;
          paid_at: string | null;
          payment_method: string;
          project_id: string;
          status: string;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          amount_cents: number;
          created_at?: string;
          currency: string;
          id: string;
          invoice_line_item_id?: string | null;
          paid_at?: string | null;
          payment_method: string;
          project_id: string;
          status?: string;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          currency?: string;
          id?: string;
          invoice_line_item_id?: string | null;
          paid_at?: string | null;
          payment_method?: string;
          project_id?: string;
          status?: string;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_payment_invoice_line_item_id_invoice_line_item_id_fk";
            columns: ["invoice_line_item_id"];
            isOneToOne: false;
            referencedRelation: "invoice_line_item";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_payment_project_id_project_id_fk";
            columns: ["project_id"];
            isOneToOne: true;
            referencedRelation: "project";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_payment_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      session: {
        Row: {
          created_at: string;
          expires_at: string;
          id: string;
          impersonated_by: string | null;
          ip_address: string | null;
          token: string;
          updated_at: string;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at: string;
          id: string;
          impersonated_by?: string | null;
          ip_address?: string | null;
          token: string;
          updated_at?: string;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string;
          id?: string;
          impersonated_by?: string | null;
          ip_address?: string | null;
          token?: string;
          updated_at?: string;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_impersonated_by_user_id_fk";
            columns: ["impersonated_by"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      stripe_customer: {
        Row: {
          created_at: string;
          id: string;
          stripe_customer_id: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          stripe_customer_id: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          stripe_customer_id?: string;
          updated_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stripe_customer_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: true;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      user: {
        Row: {
          ban_expires: string | null;
          ban_reason: string | null;
          banned: boolean;
          created_at: string;
          email: string;
          email_verified: boolean;
          id: string;
          image: string | null;
          is_system_admin: boolean;
          name: string;
          role: string;
          updated_at: string;
          workspace_id: string | null;
        };
        Insert: {
          ban_expires?: string | null;
          ban_reason?: string | null;
          banned?: boolean;
          created_at?: string;
          email: string;
          email_verified?: boolean;
          id: string;
          image?: string | null;
          is_system_admin?: boolean;
          name: string;
          role?: string;
          updated_at?: string;
          workspace_id?: string | null;
        };
        Update: {
          ban_expires?: string | null;
          ban_reason?: string | null;
          banned?: boolean;
          created_at?: string;
          email?: string;
          email_verified?: boolean;
          id?: string;
          image?: string | null;
          is_system_admin?: boolean;
          name?: string;
          role?: string;
          updated_at?: string;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      verification: {
        Row: {
          created_at: string;
          expires_at: string;
          id: string;
          identifier: string;
          updated_at: string;
          value: string;
        };
        Insert: {
          created_at?: string;
          expires_at: string;
          id: string;
          identifier: string;
          updated_at?: string;
          value: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string;
          id?: string;
          identifier?: string;
          updated_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      video_clip: {
        Row: {
          clip_url: string | null;
          created_at: string;
          duration_seconds: number;
          end_image_generation_id: string | null;
          end_image_url: string | null;
          error_message: string | null;
          id: string;
          image_generation_id: string | null;
          metadata: Json | null;
          motion_prompt: string | null;
          room_label: string | null;
          room_type: string;
          sequence_order: number;
          source_image_url: string;
          status: string;
          transition_clip_url: string | null;
          transition_type: string;
          updated_at: string;
          video_project_id: string;
        };
        Insert: {
          clip_url?: string | null;
          created_at?: string;
          duration_seconds?: number;
          end_image_generation_id?: string | null;
          end_image_url?: string | null;
          error_message?: string | null;
          id: string;
          image_generation_id?: string | null;
          metadata?: Json | null;
          motion_prompt?: string | null;
          room_label?: string | null;
          room_type: string;
          sequence_order: number;
          source_image_url: string;
          status?: string;
          transition_clip_url?: string | null;
          transition_type?: string;
          updated_at?: string;
          video_project_id: string;
        };
        Update: {
          clip_url?: string | null;
          created_at?: string;
          duration_seconds?: number;
          end_image_generation_id?: string | null;
          end_image_url?: string | null;
          error_message?: string | null;
          id?: string;
          image_generation_id?: string | null;
          metadata?: Json | null;
          motion_prompt?: string | null;
          room_label?: string | null;
          room_type?: string;
          sequence_order?: number;
          source_image_url?: string;
          status?: string;
          transition_clip_url?: string | null;
          transition_type?: string;
          updated_at?: string;
          video_project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_clip_end_image_generation_id_image_generation_id_fk";
            columns: ["end_image_generation_id"];
            isOneToOne: false;
            referencedRelation: "image_generation";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "video_clip_image_generation_id_image_generation_id_fk";
            columns: ["image_generation_id"];
            isOneToOne: false;
            referencedRelation: "image_generation";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "video_clip_video_project_id_video_project_id_fk";
            columns: ["video_project_id"];
            isOneToOne: false;
            referencedRelation: "video_project";
            referencedColumns: ["id"];
          },
        ];
      };
      video_project: {
        Row: {
          actual_cost: number | null;
          aspect_ratio: string;
          clip_count: number;
          completed_clip_count: number;
          created_at: string;
          description: string | null;
          duration_seconds: number | null;
          error_message: string | null;
          estimated_cost: number;
          final_video_url: string | null;
          generate_native_audio: boolean;
          id: string;
          metadata: Json | null;
          music_track_id: string | null;
          music_volume: number;
          name: string;
          status: string;
          thumbnail_url: string | null;
          trigger_access_token: string | null;
          trigger_run_id: string | null;
          updated_at: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          actual_cost?: number | null;
          aspect_ratio?: string;
          clip_count?: number;
          completed_clip_count?: number;
          created_at?: string;
          description?: string | null;
          duration_seconds?: number | null;
          error_message?: string | null;
          estimated_cost?: number;
          final_video_url?: string | null;
          generate_native_audio?: boolean;
          id: string;
          metadata?: Json | null;
          music_track_id?: string | null;
          music_volume?: number;
          name: string;
          status?: string;
          thumbnail_url?: string | null;
          trigger_access_token?: string | null;
          trigger_run_id?: string | null;
          updated_at?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          actual_cost?: number | null;
          aspect_ratio?: string;
          clip_count?: number;
          completed_clip_count?: number;
          created_at?: string;
          description?: string | null;
          duration_seconds?: number | null;
          error_message?: string | null;
          estimated_cost?: number;
          final_video_url?: string | null;
          generate_native_audio?: boolean;
          id?: string;
          metadata?: Json | null;
          music_track_id?: string | null;
          music_volume?: number;
          name?: string;
          status?: string;
          thumbnail_url?: string | null;
          trigger_access_token?: string | null;
          trigger_run_id?: string | null;
          updated_at?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_project_user_id_user_id_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "video_project_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      workspace: {
        Row: {
          contact_email: string | null;
          contact_person: string | null;
          created_at: string;
          id: string;
          invited_by_admin: boolean;
          invoice_eligible: boolean;
          invoice_eligible_at: string | null;
          logo: string | null;
          name: string;
          onboarding_completed: boolean;
          organization_number: string | null;
          plan: string;
          primary_color: string | null;
          secondary_color: string | null;
          slug: string;
          status: string;
          suspended_at: string | null;
          suspended_reason: string | null;
          updated_at: string;
        };
        Insert: {
          contact_email?: string | null;
          contact_person?: string | null;
          created_at?: string;
          id: string;
          invited_by_admin?: boolean;
          invoice_eligible?: boolean;
          invoice_eligible_at?: string | null;
          logo?: string | null;
          name: string;
          onboarding_completed?: boolean;
          organization_number?: string | null;
          plan?: string;
          primary_color?: string | null;
          secondary_color?: string | null;
          slug: string;
          status?: string;
          suspended_at?: string | null;
          suspended_reason?: string | null;
          updated_at?: string;
        };
        Update: {
          contact_email?: string | null;
          contact_person?: string | null;
          created_at?: string;
          id?: string;
          invited_by_admin?: boolean;
          invoice_eligible?: boolean;
          invoice_eligible_at?: string | null;
          logo?: string | null;
          name?: string;
          onboarding_completed?: boolean;
          organization_number?: string | null;
          plan?: string;
          primary_color?: string | null;
          secondary_color?: string | null;
          slug?: string;
          status?: string;
          suspended_at?: string | null;
          suspended_reason?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      workspace_pricing: {
        Row: {
          created_at: string;
          fiken_contact_id: number | null;
          id: string;
          image_project_price_ore: number | null;
          updated_at: string;
          video_project_price_ore: number | null;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          fiken_contact_id?: number | null;
          id: string;
          image_project_price_ore?: number | null;
          updated_at?: string;
          video_project_price_ore?: number | null;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          fiken_contact_id?: number | null;
          id?: string;
          image_project_price_ore?: number | null;
          updated_at?: string;
          video_project_price_ore?: number | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_pricing_workspace_id_workspace_id_fk";
            columns: ["workspace_id"];
            isOneToOne: true;
            referencedRelation: "workspace";
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
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

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
