import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser/public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Registration type definition
export interface Registration {
  id?: string;
  created_at?: string;
  
  // Personal Info
  full_name: string;
  date_of_birth: string;
  mobile_number: string;
  email: string;
  city_suburb: string;
  state: string;
  country: string;
  
  // Dietary & Medical
  dietary_requirements: string;
  dietary_other?: string;
  medical_conditions: string;
  medical_details?: string;
  
  // Emergency Contact
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  
  // Faith & Background
  vocation_status?: string;
  is_catholic?: string;
  parish?: string;
  first_ymg_event?: string;
  how_heard?: string;
  how_heard_other?: string;
  
  // Consent
  confirms_18_or_older: boolean;
  agrees_to_code_of_conduct: boolean;
  photo_consent: boolean;
  marketing_consent: boolean;
  
  // Payment
  registration_type: string;
  amount_paid: number;
  paid: boolean;
  stripe_session_id?: string;
  discount_code?: string;
  power_talk?: string | null;
  power_talk_assigned_at?: string | null;
}
