'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api, getErrorMessage } from '@/lib/api'
import { Button, Input, Label, Alert } from '@/components/ui'

interface RegisterFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const registerMutation = useMutation({
    mutationFn: (data: {
      email: string
      password: string
      firstName: string
      lastName: string
      phoneNumber: string
      invitationCode: string
    }) => api.api.userRegisterCreate(data),
    onSuccess: () => {
      setSuccess('Registrering lykkedes! Du kan nu logge ind.')
      setError('')
      if (onSuccess) {
        onSuccess()
      }
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error) || 'Registrering mislykkedes. Kontroller venligst dine oplysninger og prøv igen.'
      setError(errorMessage)
      setSuccess('')
      if (onError) {
        onError(errorMessage)
      }
    },
  })

  const handleRegister = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    registerMutation.mutate({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      invitationCode,
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
          <Label htmlFor="invitationCode" required>
            Invitationskode
          </Label>
          <Input
            id="invitationCode"
            type="text"
            placeholder="Indtast invitationskode"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" required>
              Fornavn
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Fornavn"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" required>
              Efternavn
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Efternavn"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

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
          <Label htmlFor="phoneNumber">
            Telefonnummer
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Indtast dit telefonnummer"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
            onClick={handleRegister}
            disabled={registerMutation.isPending}
            fullWidth
            isLoading={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Opretter konto...' : 'Opret konto'}
          </Button>
        </div>
      </form>
    </>
  )
}
