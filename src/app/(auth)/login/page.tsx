'use client'

import { useState } from 'react'
import Image from 'next/image' // Import Image component
import { login } from './actions' // Server Action'ı import edeceğiz (Corrected path)
import { FiLogIn } from "react-icons/fi"; // Import the icon

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
    // Styling is now handled by (auth)/layout.tsx
    <main className="flex min-h-screen items-center justify-center p-4">
      {/* Card container - increased max-width */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo.png" // Updated logo path
            alt="Okul Logosu" 
            width={80} // Adjust size as needed
            height={80} // Adjust size as needed
          />
        </div>

        {/* Titles */}
        <h2 className="text-xl font-semibold text-center text-gray-800">
          OLD TOWN COFFEE
        </h2>
        <p className="text-center text-blue-600 font-medium mb-6">
          Yönetici Girişi 
        </p>

        {/* Form */}
        <form action={handleLogin} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email adresiniz"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Şifreniz"
              className="border border-gray-300 p-2 rounded-md w-full text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center gap-2"
          >
            <FiLogIn className="h-5 w-5" />
            Giriş Yap
          </button>
          
          {error && <p className="text-red-500 text-sm mt-2 text-center">Hata: {error}</p>}
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Tüm hakları saklıdır
          </p>
        </div>
      </div>
    </main>
  )
} 