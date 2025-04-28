'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation' // Gerekirse yönlendirme için

export async function deleteMaterial(formData: FormData): Promise<{ error?: string }> {
  const cookieStore = cookies()
  const supabase = createClient()

  const id = formData.get('id') as string

  if (!id) {
    return { error: 'Silinecek malzeme ID bilgisi eksik.' }
  }

  // Silme işlemi için RLS politikası gerekli!
  // Henüz eklemediysek, SQL Editor'da şunu çalıştırın:
  /*
  CREATE POLICY "Allow logged-in users to delete materials"
  ON public.malzemeler
  FOR DELETE
  USING (auth.role() = 'authenticated');
  */

  const { error } = await supabase
    .from('malzemeler')
    .delete()
    .match({ id: id })

  if (error) {
    console.error('Supabase malzeme silme hatası:', error)
    return { error: 'Malzeme silinirken bir hata oluştu: ' + error.message }
  }

  // Başarılı silme sonrası:
  // Malzeme listesi sayfasının cache'ini temizle
  revalidatePath('/malzemeler')

  // Genellikle silme sonrası yönlendirme gerekmez,
  // sayfa zaten revalidate ile güncellenecektir.
  // İsterseniz bir başarı mesajıyla yönlendirme yapabilirsiniz:
  // redirect('/malzemeler?message=Malzeme başarıyla silindi!')

  return {}
}

// ADD MATERIAL ACTION
export async function addMaterial(formData: FormData): Promise<{ error?: string }> {
  const cookieStore = cookies()
  const supabase = createClient()

  // Form verilerini al
  const ad = formData.get('ad') as string
  const kategori = formData.get('kategori') as string || null
  const adet = parseInt(formData.get('adet') as string || '0', 10)
  const sorumlu_ogretmen = formData.get('sorumlu_ogretmen') as string || null
  const alinma_tarihi_raw = formData.get('alinma_tarihi') as string
  const alinma_tarihi = alinma_tarihi_raw ? alinma_tarihi_raw : null
  const aciklama = formData.get('aciklama') as string || null

  if (!ad) {
    return { error: 'Malzeme adı gereklidir.' }
  }
  if (isNaN(adet) || adet < 0) {
    return { error: 'Adet geçerli bir sayı olmalıdır.' }
  }

  const { error } = await supabase
    .from('malzemeler')
    .insert([
      {
        ad,
        kategori,
        adet,
        sorumlu_ogretmen,
        alinma_tarihi,
        aciklama,
      },
    ])

  if (error) {
    console.error('Supabase malzeme ekleme hatası:', error)
    return { error: 'Malzeme eklenirken bir hata oluştu: ' + error.message }
  }

  revalidatePath('/malzemeler')
  return {} // Başarılı
}

// UPDATE MATERIAL ACTION
export async function updateMaterial(formData: FormData): Promise<{ error?: string }> {
  const cookieStore = cookies()
  const supabase = createClient()

  // Form verilerini ve ID'yi al
  const id = formData.get('id') as string
  const ad = formData.get('ad') as string
  const kategori = formData.get('kategori') as string || null
  const adet = parseInt(formData.get('adet') as string || '0', 10)
  const sorumlu_ogretmen = formData.get('sorumlu_ogretmen') as string || null
  const alinma_tarihi_raw = formData.get('alinma_tarihi') as string
  const alinma_tarihi = alinma_tarihi_raw ? alinma_tarihi_raw : null
  const aciklama = formData.get('aciklama') as string || null

  if (!id) {
    return { error: 'Güncellenecek malzeme ID bilgisi eksik.' }
  }
  if (!ad) {
    return { error: 'Malzeme adı gereklidir.' }
  }
  if (isNaN(adet) || adet < 0) {
    return { error: 'Adet geçerli bir sayı olmalıdır.' }
  }

  const { error } = await supabase
    .from('malzemeler')
    .update({
      ad,
      kategori,
      adet,
      sorumlu_ogretmen,
      alinma_tarihi,
      aciklama,
    })
    .match({ id: id })

  if (error) {
    console.error('Supabase malzeme güncelleme hatası:', error)
    return { error: 'Malzeme güncellenirken bir hata oluştu: ' + error.message }
  }

  revalidatePath('/malzemeler')
  revalidatePath(`/malzemeler/duzenle/${id}`)
  return {}
} 