'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateMaterial } from '../../actions'
import Link from 'next/link'

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

// Prop tipi
type EditMaterialPageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Bileşeni React.FC ile tanımla
const EditMaterialPage: React.FC<EditMaterialPageProps> = ({ params, searchParams }) => {
  const router = useRouter()
  const supabase = createClient()
  const materialId = params.id // ID'yi al

  const [material, setMaterial] = useState<Partial<Malzeme>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMaterial = useCallback(async () => {
    setIsLoading(true)
    const { data, error: fetchError } = await supabase
      .from('malzemeler')
      .select('*')
      .eq('id', materialId)
      .single()

    if (fetchError || !data) {
      console.error('Malzeme çekme hatası:', fetchError)
      setError('Malzeme bilgileri yüklenemedi veya bulunamadı.')
    } else {
      if (data.alinma_tarihi) {
        try {
          data.alinma_tarihi = new Date(data.alinma_tarihi).toISOString().split('T')[0]
        } catch (e) {
          console.warn("Tarih formatı ayrıştırılamadı:", data.alinma_tarihi)
          data.alinma_tarihi = null
        }
      }
      setMaterial(data)
    }
    setIsLoading(false)
  }, [supabase, materialId])

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

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setIsSaving(true)
    formData.append('id', materialId)

    const result = await updateMaterial(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/malzemeler?message=Malzeme başarıyla güncellendi!')
    }
    setIsSaving(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMaterial(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMaterial(prev => ({ ...prev, [name]: value === '' ? null : value }))
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Yükleniyor...</p>
      </main>
    )
  }

  if (error && !material.id) {
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

export default EditMaterialPage 