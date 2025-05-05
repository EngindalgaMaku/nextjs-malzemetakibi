import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { logout } from './actions'
import LoginPage from './login/page'

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {
        user ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">Malzeme Takip Paneli</h1>
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
          <LoginPage />
        )
      }
    </main>
  )
}
