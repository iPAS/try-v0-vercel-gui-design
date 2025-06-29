import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          pay_tag: string
          phone: string | null
          avatar_url: string | null
          balance: number
          pin_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          pay_tag: string
          phone?: string | null
          avatar_url?: string | null
          balance?: number
          pin_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          pay_tag?: string
          phone?: string | null
          avatar_url?: string | null
          balance?: number
          pin_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          amount: number
          memo: string | null
          status: "pending" | "completed" | "failed"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          amount: number
          memo?: string | null
          status?: "pending" | "completed" | "failed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          amount?: number
          memo?: string | null
          status?: "pending" | "completed" | "failed"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
