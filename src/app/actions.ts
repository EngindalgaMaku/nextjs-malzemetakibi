'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  const cookieStore = cookies()
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Supabase logout hatası:', error)
    // İsteğe bağlı: Kullanıcıya bir hata mesajı göstermek için
    // login sayfasında olduğu gibi bir mekanizma eklenebilir,
    // ancak genellikle logout sonrası sadece yönlendirme yapılır.
    // return { error: 'Çıkış yapılamadı.' };
  }

  // Başarılı çıkış sonrası ana sayfaya yönlendir
  redirect('/')
} 