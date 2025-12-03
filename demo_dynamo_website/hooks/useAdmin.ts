import { useState, useEffect } from 'react'
import { Admin } from '@/lib/type'

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL

export function useAdmin() {
    const [data, setData] = useState<Admin[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAdmins = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await fetch(`${urlLink}/api/admin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            setData(result)
        } catch (err) {
            console.error('Error fetching admin data:', err)
            setError(err instanceof Error ? err.message : 'An unknown error occurred')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

    const refetch = () => {
        fetchAdmins()
    }

    return { data, loading, error, refetch }
}