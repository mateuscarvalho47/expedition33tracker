import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { progressQueryKey } from '../progress.queries'
import { ProgressTracker } from './ProgressTracker'

const viewer = {
  id: '0198fdf0-35b6-7000-8000-000000000001',
  email: 'maelle@example.com',
  displayName: 'Maelle',
  profileSlug: 'maelle-12345678',
  isPublic: false,
}

type RenderOptions = {
  initialCompletedIds?: string[]
  updateProgress?: React.ComponentProps<typeof ProgressTracker>['updateProgress']
  bulkProgress?: React.ComponentProps<typeof ProgressTracker>['bulkProgress']
}

function renderTracker(options: RenderOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  queryClient.setQueryData(progressQueryKey, options.initialCompletedIds ?? [])
  const props: React.ComponentProps<typeof ProgressTracker> = {
    viewer,
    updateProgress: options.updateProgress ?? vi.fn().mockResolvedValue({ ok: true }),
    bulkProgress: options.bulkProgress ?? vi.fn().mockResolvedValue({ ok: true }),
    onLogout: vi.fn().mockResolvedValue(undefined),
  }

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <ProgressTracker {...props} />
      </QueryClientProvider>,
    ),
    props,
    queryClient,
  }
}

describe('ProgressTracker', () => {
  it('renderiza o progresso inicial vindo do cache SSR', () => {
    renderTracker({ initialCompletedIds: ['childrenoflumiere', 'goblu'] })

    expect(screen.getByRole('tab', { name: /Discos Musicais/ })).toHaveTextContent('2/33')
    expect(
      screen.getByRole('progressbar', { name: 'discos encontrados' }),
    ).toHaveAttribute('aria-valuenow', '2')
  })

  it('atualiza o cache otimisticamente e persiste um item', async () => {
    const user = userEvent.setup()
    let finishRequest: (() => void) | undefined
    const updateProgress = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishRequest = resolve
        }),
    )
    renderTracker({ updateProgress })
    const checkbox = screen.getByRole('checkbox', { name: /Children of Lumière/ })

    await user.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(screen.getByRole('tab', { name: /Discos Musicais/ })).toHaveTextContent('1/33')
    expect(updateProgress).toHaveBeenCalledWith({
      collectibleId: 'childrenoflumiere',
      completed: true,
    })

    finishRequest?.()
    expect(await screen.findByText('salvo ✓')).toBeInTheDocument()
  })

  it('reverte o cache otimista quando a persistência falha', async () => {
    const user = userEvent.setup()
    renderTracker({
      updateProgress: vi.fn().mockRejectedValue(new Error('offline')),
    })
    const checkbox = screen.getByRole('checkbox', { name: /Children of Lumière/ })

    await user.click(checkbox)

    await waitFor(() => expect(checkbox).not.toBeChecked())
    expect(screen.getByText('erro ao salvar')).toBeInTheDocument()
  })

  it('troca de aba preservando a identidade visual e os totais', async () => {
    const user = userEvent.setup()
    renderTracker()

    await user.click(screen.getByRole('tab', { name: /Diários de Expedição/ }))

    expect(screen.getByRole('tabpanel', { name: /Diários de Expedição/ })).toBeVisible()
    expect(
      screen.getByRole('progressbar', { name: 'diários encontrados' }),
    ).toHaveAttribute('aria-valuemax', '49')
  })

  it('combina busca e filtros sem alterar o progresso', async () => {
    const user = userEvent.setup()
    renderTracker({ initialCompletedIds: ['childrenoflumiere'] })

    await user.click(screen.getByRole('button', { name: 'Pendentes' }))
    expect(
      screen.queryByRole('checkbox', { name: /Children of Lumière/ }),
    ).not.toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: 'Buscar' }), 'gestral')
    expect(screen.getByRole('checkbox', { name: /Linen and Cotton/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Discos Musicais/ })).toHaveTextContent('1/33')
  })
})
