import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AuthCard } from './AuthCard'

describe('AuthCard', () => {
  it('valida o formulário antes de chamar o servidor', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn()

    render(<AuthCard onLogin={onLogin} onRegister={vi.fn()} onAuthenticated={vi.fn()} />)

    await user.type(screen.getByLabelText('E-mail'), 'email-invalido')
    await user.type(screen.getByLabelText('Senha'), '123')
    await user.click(screen.getByRole('button', { name: 'Continuar a expedição' }))

    expect(await screen.findByText('Informe um e-mail válido.')).toBeInTheDocument()
    expect(
      screen.getByText('A senha precisa ter ao menos 8 caracteres.'),
    ).toBeInTheDocument()
    expect(onLogin).not.toHaveBeenCalled()
  })

  it('envia credenciais válidas e conclui o acesso', async () => {
    const user = userEvent.setup()
    const onAuthenticated = vi.fn()
    const onLogin = vi.fn().mockResolvedValue({
      ok: true,
      user: {
        id: '0198fdf0-35b6-7000-8000-000000000001',
        email: 'lune@example.com',
        displayName: 'Lune',
        profileSlug: 'lune-12345678',
        isPublic: false,
      },
    })

    render(
      <AuthCard
        onLogin={onLogin}
        onRegister={vi.fn()}
        onAuthenticated={onAuthenticated}
      />,
    )

    await user.type(screen.getByLabelText('E-mail'), 'LUNE@example.com')
    await user.type(screen.getByLabelText('Senha'), 'painted-world')
    await user.click(screen.getByRole('button', { name: 'Continuar a expedição' }))

    expect(onLogin).toHaveBeenCalledWith({
      email: 'lune@example.com',
      password: 'painted-world',
    })
    expect(onAuthenticated).toHaveBeenCalledOnce()
  })

  it('alterna para criação de conta', async () => {
    const user = userEvent.setup()
    render(<AuthCard onLogin={vi.fn()} onRegister={vi.fn()} onAuthenticated={vi.fn()} />)

    await user.click(screen.getByRole('tab', { name: 'Criar conta' }))

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar expedição' })).toBeInTheDocument()
  })

  it('mostra e volta a ocultar a senha sem alterar seu valor', async () => {
    const user = userEvent.setup()
    render(<AuthCard onLogin={vi.fn()} onRegister={vi.fn()} onAuthenticated={vi.fn()} />)
    const password = screen.getByLabelText('Senha')

    await user.type(password, 'painted-world')
    expect(password).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(password).toHaveAttribute('type', 'text')
    expect(password).toHaveValue('painted-world')

    await user.click(screen.getByRole('button', { name: 'Ocultar senha' }))
    expect(password).toHaveAttribute('type', 'password')
  })

  it('completa o e-mail com domínios comuns', async () => {
    const user = userEvent.setup()
    render(<AuthCard onLogin={vi.fn()} onRegister={vi.fn()} onAuthenticated={vi.fn()} />)
    const email = screen.getByLabelText('E-mail')

    await user.type(email, 'lune@hot')
    await user.click(screen.getByRole('option', { name: 'lune@hotmail.com' }))

    expect(email).toHaveValue('lune@hotmail.com')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('permite escolher a sugestão de e-mail pelo teclado', async () => {
    const user = userEvent.setup()
    render(<AuthCard onLogin={vi.fn()} onRegister={vi.fn()} onAuthenticated={vi.fn()} />)
    const email = screen.getByLabelText('E-mail')

    await user.type(email, 'maelle')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(email).toHaveValue('maelle@gmail.com')
  })

  it('oferece a demonstração sem exigir cadastro', async () => {
    const user = userEvent.setup()
    const onExploreDemo = vi.fn()
    render(
      <AuthCard
        onLogin={vi.fn()}
        onRegister={vi.fn()}
        onAuthenticated={vi.fn()}
        onExploreDemo={onExploreDemo}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Explorar demonstração' }))

    expect(onExploreDemo).toHaveBeenCalledOnce()
  })
})
