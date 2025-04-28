import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { logout } from '@/app/actions' // Kök dizindeki logout action'ı

export default async function Navbar() {
  const cookieStore = cookies()
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-bold hover:text-gray-300">
          Anasayfa
        </Link>
        {user && (
          <Link href="/malzemeler" className="hover:text-gray-300">
            Malzemeler
          </Link>
        )}
        {/* Başka linkler buraya eklenebilir */}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm">{user.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded"
              >
                Çıkış Yap
              </button>
            </form>
          </>
        ) : (
          <Link href="/login">
            <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded">
              Giriş Yap
            </button>
          </Link>
        )}
      </div>
    </nav>
  )
} 