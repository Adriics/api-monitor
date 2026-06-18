'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await api.post('/auth/register', { email, password })
            router.push('/login')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-white">api-monitor</h1>
                    <p className="text-zinc-400 mt-2 text-sm">Crea tu cuenta</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-1.5">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-zinc-900 font-medium text-sm rounded-lg py-2 hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="text-center text-zinc-500 text-sm mt-4">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="text-zinc-300 hover:text-white transition-colors">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    )
}