'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api, getErrorMessage } from '@/lib/api'
import { Button, Input, Label, Alert } from '@/components/ui'

interface LoginFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.api.userLoginCreate(data),
    onSuccess: () => {
      localStorage.setItem('currentUser', JSON.stringify({ email }))
      setSuccess('Login lykkedes! Du vil blive omdirigeret...')
      setError('')
      if (onSuccess) {
        onSuccess()
      }
      setTimeout(() => {
        router.push('/')
      }, 500)
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error) || 'Login mislykkedes. Kontroller venligst din e-mail og adgangskode.'
      setError(errorMessage)
      setSuccess('')
      if (onError) {
        onError(errorMessage)
      }
    },
  })

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    loginMutation.mutate({
      email,
      password,
    })
  }

  return (
    <>
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}

      <form className="space-y-4">
        <div>
          <Label htmlFor="email" required>
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Indtast din e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password" required>
            Adgangskode
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Indtast din adgangskode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            fullWidth
            isLoading={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logger ind...' : 'Log ind'}
          </Button>
        </div>
      </form>
    </>
  )
}
