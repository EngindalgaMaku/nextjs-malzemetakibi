'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updateMaterial } from '../../actions'

// Malzeme tipi
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

type EditMaterialFormProps = {
  initialMaterial: Malzeme;
};

export default function EditMaterialForm({ initialMaterial }: EditMaterialFormProps) {
  const router = useRouter()
  const [material, setMaterial] = useState<Malzeme>(initialMaterial)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setIsSaving(true)
    formData.append('id', material.id)

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

  return (
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
  )
} 