'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData): Promise<{ error: string | null }> {
  const cookieStore = cookies()
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-posta ve şifre gereklidir.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Supabase login hatası:', error)
    // Kullanıcıya daha genel bir hata mesajı gösterebiliriz
    return { error: 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.' }
  }

  // Başarılı giriş sonrası ana sayfaya yönlendir
  // Server Action'dan redirect kullanmak için `next/navigation` import edilir.
  redirect('/')

  // redirect() sonrası bu kod çalışmaz ama fonksiyonun bir şey döndürmesi gerekir.
  // Aslında redirect bir istisna (exception) fırlattığı için buraya hiç gelinmez.
  // return { error: null }; // Bu satıra gerek yok
} 