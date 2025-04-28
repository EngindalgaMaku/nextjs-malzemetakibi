'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateMaterial } from '../../actions' // İki üst dizindeki actions dosyasından
import Link from 'next/link' // Link import edildi

// Malzeme tipini tekrar tanımlayalım veya import edelim
type Malzeme = {
  id: string;
  created_at: string;
  ad: string;
  aciklama: string | null;
  adet: number;
  kategori: string | null;
  alinma_tarihi: string | null;
  sorumlu_ogretmen: string | null;
};

// EditPageProps tipini kaldırıyoruz
/*
type EditPageProps = {
  params: {
    id: string;
  };
};
*/

// Tipi doğrudan fonksiyon imzasına yazıyoruz
export default function EditMaterialPage({
  params,
  searchParams // searchParams eklendi
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined }; // searchParams tipi eklendi
}) {
  const router = useRouter()
  const supabase = createClient()
  const materialId = params.id // URL'den ID'yi al

  const [material, setMaterial] = useState<Partial<Malzeme>>({}) // Başlangıçta boş obje
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Malzeme verisini çekme fonksiyonu
  const fetchMaterial = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('malzemeler')
      .select('*')
      .eq('id', materialId)
      .single() // Tek bir kayıt bekliyoruz

    if (error || !data) {
      console.error('Malzeme çekme hatası:', error)
      setError('Malzeme bilgileri yüklenemedi veya bulunamadı.')
      // Belki 404 sayfasına yönlendirme yapılabilir
    } else {
      // Tarih formatını YYYY-MM-DD'ye çevirelim (input[type=date] için)
      if (data.alinma_tarihi) {
        try {
            data.alinma_tarihi = new Date(data.alinma_tarihi).toISOString().split('T')[0];
        } catch (e) {
            console.warn("Tarih formatı ayrıştırılamadı:", data.alinma_tarihi);
            data.alinma_tarihi = null; // Hatalıysa temizle
        }
      }
      setMaterial(data)
    }
    setIsLoading(false)
  }, [supabase, materialId])

  // Oturum kontrolü ve veri çekme
  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?message=Malzeme düzenlemek için giriş yapmalısınız.')
      } else {
        await fetchMaterial()
      }
    }
    checkSessionAndFetch()
  }, [supabase, router, fetchMaterial])

  // Form gönderimini ele alma
  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setIsSaving(true)
    // ID'yi de formData'ya ekleyelim (Server Action içinde de alınabilir ama burada daha açık)
    formData.append('id', materialId)

    const result = await updateMaterial(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      // Başarılı güncelleme sonrası listeye yönlendir
      router.push('/malzemeler?message=Malzeme başarıyla güncellendi!')
    }
    setIsSaving(false)
  }

  // Form alanlarındaki değişiklikleri state'e yansıtma
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMaterial(prev => ({ ...prev, [name]: value }));
  };

  // Input type="date" için özel handle
 const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // value boş string olabilir, bu durumda null olarak state'e yazalım.
    setMaterial(prev => ({ ...prev, [name]: value === '' ? null : value }));
 };


  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Yükleniyor...</p>
      </main>
    )
  }

  if (error && !material.id) { // Hata varsa ve malzeme hiç yüklenemediyse
     return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="text-red-500">{error}</p>
        <Link href="/malzemeler" className="text-blue-500 mt-4">Malzeme Listesine Dön</Link>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-16">
      <h1 className="text-4xl font-bold mb-8">Malzeme Düzenle</h1>
      <form action={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        {/* Form alanları, state'deki 'material' verisiyle doldurulacak */}
        <label htmlFor="ad">Malzeme Adı:</label>
        <input id="ad" name="ad" type="text" required value={material.ad || ''} onChange={handleChange} className="border p-2 rounded text-black" />

        <label htmlFor="kategori">Kategori:</label>
        <input id="kategori" name="kategori" type="text" value={material.kategori || ''} onChange={handleChange} className="border p-2 rounded text-black" />

        <label htmlFor="adet">Adet:</label>
        <input id="adet" name="adet" type="number" required value={material.adet || 0} onChange={handleChange} className="border p-2 rounded text-black" />

        <label htmlFor="sorumlu_ogretmen">Sorumlu Öğretmen:</label>
        <input id="sorumlu_ogretmen" name="sorumlu_ogretmen" type="text" value={material.sorumlu_ogretmen || ''} onChange={handleChange} className="border p-2 rounded text-black" />

        <label htmlFor="alinma_tarihi">Alınma Tarihi:</label>
        <input id="alinma_tarihi" name="alinma_tarihi" type="date" value={material.alinma_tarihi || ''} onChange={handleDateChange} className="border p-2 rounded text-black" />

        <label htmlFor="aciklama">Açıklama:</label>
        <textarea id="aciklama" name="aciklama" rows={3} value={material.aciklama || ''} onChange={handleChange} className="border p-2 rounded text-black"></textarea>

        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
        {error && <p className="text-red-500 mt-4">Hata: {error}</p>}
         <Link href="/malzemeler" className="text-center text-gray-600 mt-4 hover:underline">İptal</Link>
      </form>
    </main>
  )
} 