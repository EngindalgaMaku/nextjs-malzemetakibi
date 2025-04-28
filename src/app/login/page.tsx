'use client'

import { useState } from 'react'
import { login } from './actions' // Server Action'ı import edeceğiz

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (formData: FormData) => {
    setError(null) // Önceki hatayı temizle
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    }
    // Başarılı olursa Server Action zaten yönlendirme yapacak
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Giriş Yap</h1>
      <form action={handleLogin} className="flex flex-col gap-4 w-full max-w-xs">
        <label htmlFor="email">E-posta:</label>
        <input
          id="email"
          type="email"
          name="email" // Server Action için name gerekli
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded text-black"
        />
        <label htmlFor="password">Şifre:</label>
        <input
          id="password"
          type="password"
          name="password" // Server Action için name gerekli
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Giriş Yap
        </button>
        {error && <p className="text-red-500 mt-4">Hata: {error}</p>}
      </form>
      {/* Signup linki eklenebilir */}
      <p className="mt-4">
        Hesabınız yok mu? <a href="/signup" className="text-blue-500 hover:underline">Kayıt Ol</a>
      </p>
    </main>
  )
} 