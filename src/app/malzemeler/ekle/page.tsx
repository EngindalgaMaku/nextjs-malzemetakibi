'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // Yönlendirme için
import { createClient } from '@/lib/supabase/client' // İstemci istemcisini kullanacağız (oturum kontrolü için)
import { addMaterial } from '../actions' // Bir üst dizindeki actions dosyasından

export default function AddMaterialPage() {
  const router = useRouter()
  const supabase = createClient() // İstemci tarafı Supabase istemcisi
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Oturum kontrolü (Client-side)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?message=Yeni malzeme eklemek için giriş yapmalısınız.')
      } else {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [supabase, router])

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    const result = await addMaterial(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      // Başarılı ekleme sonrası malzeme listesine yönlendir
      // Server Action'dan redirect() kullanmak daha iyi olabilir,
      // ama burada da yapılabilir.
      router.push('/malzemeler?message=Malzeme başarıyla eklendi!')
      // Veya router.refresh() ile mevcut sayfayı yenileyip listeyi güncelleyebiliriz.
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Yükleniyor...</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-16">
      <h1 className="text-4xl font-bold mb-8">Yeni Malzeme Ekle</h1>
      <form action={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        {
          // Form Alanları
        }
        <label htmlFor="ad">Malzeme Adı:</label>
        <input id="ad" name="ad" type="text" required className="border p-2 rounded text-black" />

        <label htmlFor="kategori">Kategori:</label>
        <input id="kategori" name="kategori" type="text" className="border p-2 rounded text-black" />

        <label htmlFor="adet">Adet:</label>
        <input id="adet" name="adet" type="number" defaultValue="1" required className="border p-2 rounded text-black" />

        <label htmlFor="sorumlu_ogretmen">Sorumlu Öğretmen:</label>
        <input id="sorumlu_ogretmen" name="sorumlu_ogretmen" type="text" className="border p-2 rounded text-black" />

        <label htmlFor="alinma_tarihi">Alınma Tarihi:</label>
        <input id="alinma_tarihi" name="alinma_tarihi" type="date" className="border p-2 rounded text-black" />

        <label htmlFor="aciklama">Açıklama:</label>
        <textarea id="aciklama" name="aciklama" rows={3} className="border p-2 rounded text-black"></textarea>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Malzemeyi Kaydet
        </button>
        {error && <p className="text-red-500 mt-4">Hata: {error}</p>}
      </form>
    </main>
  )
} 