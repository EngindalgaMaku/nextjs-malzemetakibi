import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { logout } from './actions'

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Malzeme Takip Paneli</h1>
      {
        user ? (
          <div className="text-center">
            <p className="mb-4">Hoş geldiniz, {user.email}!</p>
            <form action={logout}>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Çıkış Yap
              </button>
            </form>
            <p className="mt-4">Panel içeriği burada görüntülenecek.</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Lütfen devam etmek için giriş yapın.</p>
            <a href="/login" className="text-blue-500 hover:underline">Giriş Yap</a>
          </div>
        )
      }
    </main>
  )
}
