import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { logout } from './actions'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
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
        <p className="mt-4">
          <a href="/malzemeler" className="text-blue-500 hover:underline">
            Malzemeleri Görüntüle
          </a>
        </p>
      </div>
    </main>
  )
}
