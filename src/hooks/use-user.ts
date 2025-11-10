'use client'
import { useState, useEffect } from 'react'

interface User {
  email: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
  }

  return { user, loading, logout, setUser }
}
