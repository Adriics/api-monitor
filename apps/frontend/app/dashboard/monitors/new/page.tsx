'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewMonitorPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        url: '',
        intervalMins: 5,
        alertEmail: '',
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const token = localStorage.getItem('token')

        await fetch('http://localhost:3001/monitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...form,
                intervalMins: Number(form.intervalMins),
            }),
        })

        setLoading(false)
        router.push('/dashboard')
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Nuevo monitor</h1>
                <p style={styles.subtitle}>
                    Añade una URL para empezar a monitorizarla
                </p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        name="name"
                        placeholder="Nombre del servicio"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <input
                        name="url"
                        placeholder="https://api.tuapp.com"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <input
                        name="intervalMins"
                        type="number"
                        placeholder="Intervalo (min)"
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <input
                        name="alertEmail"
                        placeholder="Email de alertas (opcional)"
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Creando...' : 'Crear monitor'}
                    </button>
                </form>
            </div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        padding: 20,
    },

    card: {
        width: '100%',
        maxWidth: 420,
        background: '#111827',
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        border: '1px solid #1f2937',
    },

    title: {
        color: 'white',
        marginBottom: 6,
    },

    subtitle: {
        color: '#9ca3af',
        fontSize: 14,
        marginBottom: 20,
    },

    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },

    input: {
        padding: 12,
        borderRadius: 8,
        border: '1px solid #374151',
        background: '#0b1220',
        color: 'white',
        outline: 'none',
    },

    button: {
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
        border: 'none',
        background: '#3b82f6',
        color: 'white',
        fontWeight: 600,
    },
}