import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { ThemeToggle } from '~/components/ThemeToggle'

import { loginFormSchema, loginSchema, registerSchema } from '../auth.schemas'
import type { AuthResult } from '../auth.types'

type AuthMode = 'login' | 'register'

const EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com.br',
  'icloud.com',
] as const

type AuthCardProps = {
  onLogin: (input: { email: string; password: string }) => Promise<AuthResult>
  onRegister: (input: {
    displayName: string
    email: string
    password: string
  }) => Promise<AuthResult>
  onAuthenticated: () => void | Promise<void>
  onExploreDemo?: () => void | Promise<void>
}

export function AuthCard({
  onLogin,
  onRegister,
  onAuthenticated,
  onExploreDemo,
}: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [serverError, setServerError] = useState<string>()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: mode === 'login' ? loginFormSchema : registerSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(undefined)

      try {
        const result =
          mode === 'login'
            ? await onLogin(loginSchema.parse(value))
            : await onRegister(registerSchema.parse(value))

        if (!result.ok) {
          setServerError(result.error)
          return
        }

        await onAuthenticated()
      } catch {
        setServerError('Não foi possível acessar sua conta. Tente novamente.')
      }
    },
  })

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setServerError(undefined)
    setShowPassword(false)
    form.reset()
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-card-topline">
          <div className="auth-ornament" aria-hidden="true">
            ✦
          </div>
          <ThemeToggle />
        </div>
        <p className="eyebrow">Clair Obscur · Expedition 33</p>
        <h1 id="auth-title">Colecionáveis</h1>
        <p className="subtitle">Seu progresso para a platina, salvo entre expedições</p>

        <div className="auth-switch" role="tablist" aria-label="Acesso à conta">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'active' : ''}
            onClick={() => changeMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={mode === 'register' ? 'active' : ''}
            onClick={() => changeMode('register')}
          >
            Criar conta
          </button>
        </div>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
          noValidate
        >
          {mode === 'register' ? (
            <form.Field name="displayName">
              {(field) => {
                const error = firstError(field.state.meta.errors)
                return (
                  <FormField label="Nome" name={field.name} error={error}>
                    <input
                      id={field.name}
                      name={field.name}
                      autoComplete="name"
                      placeholder="Como devemos chamar você?"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${field.name}-error` : undefined}
                    />
                  </FormField>
                )
              }}
            </form.Field>
          ) : null}

          <form.Field name="email">
            {(field) => {
              const error = firstError(field.state.meta.errors)
              return (
                <FormField
                  label="E-mail"
                  name={field.name}
                  error={error}
                  hint="Digite seu usuário e escolha um domínio sugerido."
                >
                  <EmailAutocomplete
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    invalid={Boolean(error)}
                    describedBy={descriptionIds(field.name, error, true)}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                </FormField>
              )
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const error = firstError(field.state.meta.errors)
              return (
                <FormField
                  label="Senha"
                  name={field.name}
                  error={error}
                  hint={mode === 'register' ? 'Use pelo menos 8 caracteres.' : undefined}
                >
                  <div className="password-control">
                    <input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={
                        mode === 'login' ? 'current-password' : 'new-password'
                      }
                      placeholder={
                        mode === 'login' ? 'Digite sua senha' : 'Crie uma senha segura'
                      }
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={Boolean(error)}
                      aria-describedby={descriptionIds(
                        field.name,
                        error,
                        mode === 'register',
                      )}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      aria-controls={field.name}
                      aria-pressed={showPassword}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      <span aria-hidden="true">{showPassword ? '◉' : '◎'}</span>
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </FormField>
              )
            }}
          </form.Field>

          {serverError ? (
            <p className="form-error form-error-summary" role="alert">
              {serverError}
            </p>
          ) : null}

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Aguarde…'
                  : mode === 'login'
                    ? 'Continuar a expedição'
                    : 'Iniciar expedição'}
              </button>
            )}
          </form.Subscribe>
        </form>

        {onExploreDemo ? (
          <div className="demo-access">
            <span>ou</span>
            <button type="button" onClick={() => void onExploreDemo()}>
              Explorar demonstração
            </button>
          </div>
        ) : null}
      </section>
    </main>
  )
}

type FormFieldProps = {
  label: string
  name: string
  error?: string
  hint?: string
  children: React.ReactNode
}

function FormField({ label, name, error, hint, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      {children}
      {hint ? (
        <span className="form-hint" id={`${name}-hint`}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="form-error" id={`${name}-error`}>
          {error}
        </span>
      ) : null}
    </div>
  )
}

type EmailAutocompleteProps = {
  id: string
  name: string
  value: string
  invalid: boolean
  describedBy?: string
  onBlur: () => void
  onChange: (value: string) => void
}

function EmailAutocomplete({
  id,
  name,
  value,
  invalid,
  describedBy,
  onBlur,
  onChange,
}: EmailAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const suggestions = getEmailSuggestions(value)
  const showSuggestions = isOpen && suggestions.length > 0
  const listId = `${id}-suggestions`

  function selectSuggestion(suggestion: string) {
    onChange(suggestion)
    setActiveIndex(-1)
    setIsOpen(false)
  }

  return (
    <div className="email-autocomplete">
      <input
        id={id}
        name={name}
        type="email"
        role="combobox"
        autoComplete="email"
        placeholder="seu.nome@exemplo.com"
        value={value}
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={listId}
        aria-activedescendant={
          showSuggestions && activeIndex >= 0
            ? `${listId}-option-${activeIndex}`
            : undefined
        }
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setIsOpen(false)
          setActiveIndex(-1)
          onBlur()
        }}
        onChange={(event) => {
          onChange(event.target.value)
          setActiveIndex(-1)
          setIsOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false)
            setActiveIndex(-1)
            return
          }

          if (suggestions.length === 0) return

          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setIsOpen(true)
            setActiveIndex((current) => (current + 1) % suggestions.length)
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault()
            setIsOpen(true)
            setActiveIndex((current) =>
              current <= 0 ? suggestions.length - 1 : current - 1,
            )
          }

          if (event.key === 'Enter' && showSuggestions && activeIndex >= 0) {
            event.preventDefault()
            selectSuggestion(suggestions[activeIndex])
          }
        }}
      />

      {showSuggestions ? (
        <div className="email-suggestions" id={listId} role="listbox">
          {suggestions.map((suggestion, index) => (
            <button
              type="button"
              id={`${listId}-option-${index}`}
              key={suggestion}
              role="option"
              tabIndex={-1}
              aria-selected={activeIndex === index}
              className={activeIndex === index ? 'active' : undefined}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function getEmailSuggestions(value: string): string[] {
  const trimmedValue = value.trim()
  if (!trimmedValue || /\s/.test(trimmedValue)) return []

  const parts = trimmedValue.split('@')
  if (parts.length > 2 || !parts[0]) return []

  const [localPart, typedDomain = ''] = parts
  const normalizedDomain = typedDomain.toLowerCase()

  return EMAIL_DOMAINS.filter(
    (domain) => domain.startsWith(normalizedDomain) && domain !== normalizedDomain,
  ).map((domain) => `${localPart}@${domain}`)
}

function descriptionIds(name: string, error: string | undefined, hasHint: boolean) {
  const ids = [hasHint ? `${name}-hint` : undefined, error ? `${name}-error` : undefined]
  return ids.filter(Boolean).join(' ') || undefined
}

function firstError(errors: readonly unknown[]): string | undefined {
  const error = errors[0]
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return undefined
}
