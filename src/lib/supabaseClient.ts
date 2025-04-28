import { createClient } from '@supabase/supabase-js'

// Ortam değişkenlerinden Supabase URL ve anon anahtarını al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// URL ve anahtarın tanımlı olup olmadığını kontrol et
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve anon anahtarı ortam değişkenlerinde tanımlanmamış!')
}

// Supabase istemcisini oluştur ve dışa aktar
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 