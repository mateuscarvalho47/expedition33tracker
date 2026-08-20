import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { ThemeToggle } from './ThemeToggle'

afterEach(() => {
  window.localStorage.clear()
  document.documentElement.dataset.theme = 'dark'
  document.documentElement.style.colorScheme = ''
})

describe('ThemeToggle', () => {
  it('alterna o tema e persiste a preferência', async () => {
    const user = userEvent.setup()
    document.documentElement.dataset.theme = 'dark'

    render(<ThemeToggle />)
    await user.click(screen.getByRole('button', { name: 'Ativar tema claro' }))

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(window.localStorage.getItem('expedition33-theme')).toBe('light')
    expect(screen.getByRole('button', { name: 'Ativar tema escuro' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('respeita o tema que foi aplicado antes da hidratação', async () => {
    document.documentElement.dataset.theme = 'light'

    render(<ThemeToggle />)

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Ativar tema escuro' })).toBeVisible(),
    )
  })
})
