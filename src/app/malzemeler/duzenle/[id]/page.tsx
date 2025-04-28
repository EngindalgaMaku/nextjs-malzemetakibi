import { createClient } from '@/lib/supabase/server'
import EditMaterialForm from './EditMaterialForm'
import { notFound } from 'next/navigation'

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

// Added new props type definition
type EditMaterialPageProps = {
  params: { id: string };
  // Optional: Add searchParams if you might use them
  // searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function EditMaterialPage({ params }: EditMaterialPageProps) {
  const supabase = createClient()
  
  // Server-side veri çekme
  const { data: material, error } = await supabase
    .from('malzemeler')
    .select('*')
    .eq('id', params.id)
    .single()
  
  // Eğer malzeme bulunamazsa 404 sayfası göster
  if (error || !material) {
    notFound()
  }
  
  // Tarih formatını düzenle
  if (material.alinma_tarihi) {
    try {
      material.alinma_tarihi = new Date(material.alinma_tarihi).toISOString().split('T')[0]
    } catch (e) {
      console.warn("Tarih formatı ayrıştırılamadı:", material.alinma_tarihi)
      material.alinma_tarihi = null
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-16">
      <h1 className="text-4xl font-bold mb-8">Malzeme Düzenle</h1>
      <EditMaterialForm initialMaterial={material} />
    </main>
  )
} 