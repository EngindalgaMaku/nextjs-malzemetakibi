import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteMaterial } from './actions' // Bu ./actions.ts dosyasından gelecek

// Malzeme verisinin tipini tanımlayalım (isteğe bağlı ama önerilir)
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

export default async function MalzemelerPage() {
  const cookieStore = cookies()
  const supabase = createClient()

  // Oturum kontrolü
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Giriş yapmamış kullanıcıyı login sayfasına yönlendir
    redirect('/login?message=Malzemeleri görmek için giriş yapmalısınız.')
  }

  // Malzemeleri veritabanından çek
  const { data: malzemeler, error } = await supabase
    .from('malzemeler')
    .select('*') // Tüm sütunları seç
    .order('created_at', { ascending: false }); // Oluşturma tarihine göre sırala (en yeni üstte)

  if (error) {
    console.error('Malzeme çekme hatası:', error);
    // Kullanıcıya bir hata mesajı gösterebiliriz
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="text-red-500">Malzemeler yüklenirken bir hata oluştu.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-16">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Malzeme Listesi</h1>
        <Link href="/malzemeler/ekle">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Yeni Malzeme Ekle
          </button>
        </Link>
      </div>

      {malzemeler && malzemeler.length > 0 ? (
        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Ad</th>
                <th className="py-2 px-4 border-b text-left">Kategori</th>
                <th className="py-2 px-4 border-b text-right">Adet</th>
                <th className="py-2 px-4 border-b text-left">Sorumlu</th>
                <th className="py-2 px-4 border-b text-left">Açıklama</th>
                <th className="py-2 px-4 border-b text-left">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {malzemeler.map((malzeme: Malzeme) => (
                <tr key={malzeme.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{malzeme.ad}</td>
                  <td className="py-2 px-4 border-b">{malzeme.kategori ?? '-'}</td>
                  <td className="py-2 px-4 border-b text-right">{malzeme.adet}</td>
                  <td className="py-2 px-4 border-b">{malzeme.sorumlu_ogretmen ?? '-'}</td>
                  <td className="py-2 px-4 border-b">{malzeme.aciklama ?? '-'}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/malzemeler/duzenle/${malzeme.id}`} className="mr-2">
                      <button className="bg-yellow-500 hover:bg-yellow-700 text-white text-xs font-bold py-1 px-2 rounded">
                        Düzenle
                      </button>
                    </Link>
                    <form action={deleteMaterial} className="inline-block">
                      <input type="hidden" name="id" value={malzeme.id} />
                      <button
                        type="submit"
                        className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded"
                      >
                        Sil
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Gösterilecek malzeme bulunamadı.</p>
      )}
    </main>
  );
} 