import { useMemo, useState } from 'react'

import { ThemeToggle } from '~/components/ThemeToggle'
import type { Viewer } from '~/features/auth/auth.types'

import { getCollectibles, TRACKERS, type TrackerKey } from '../collectibles'
import type {
  BulkProgressInput,
  ReplaceProgressInput,
  UpdateProgressInput,
} from '../progress.schemas'
import { createProgressExport, parseProgressImport } from '../progress-transfer'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
type TrackerMode = 'authenticated' | 'demo' | 'public'
type ItemFilter = 'all' | 'pending' | 'completed' | 'missable'

type TrackerPageProps = {
  viewer: Pick<Viewer, 'displayName'>
  completedIds: readonly string[]
  pendingIds: ReadonlySet<string>
  bulkPending: boolean
  saveStatus: SaveStatus
  mode?: TrackerMode
  profileSlug?: string
  isPublic?: boolean
  onUpdate: (input: UpdateProgressInput) => void
  onBulkUpdate: (input: BulkProgressInput) => void
  onReplaceProgress?: (input: ReplaceProgressInput) => Promise<void>
  onToggleVisibility?: (isPublic: boolean) => void
  onLogout?: () => Promise<void>
}

export function TrackerPage({
  viewer,
  completedIds: completedIdList,
  pendingIds,
  bulkPending,
  saveStatus,
  mode = 'authenticated',
  profileSlug,
  isPublic = false,
  onUpdate,
  onBulkUpdate,
  onReplaceProgress,
  onToggleVisibility,
  onLogout,
}: TrackerPageProps) {
  const [activeTracker, setActiveTracker] = useState<TrackerKey>('records')
  const [itemFilter, setItemFilter] = useState<ItemFilter>('all')
  const [search, setSearch] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const [transferMessage, setTransferMessage] = useState<string>()
  const completedIds = useMemo(() => new Set(completedIdList), [completedIdList])
  const readOnly = mode !== 'authenticated'
  const counts = useMemo(
    () =>
      (Object.keys(TRACKERS) as TrackerKey[]).reduce(
        (result, key) => {
          const items = getCollectibles(key)
          result[key] = {
            done: items.filter((item) => completedIds.has(item.id)).length,
            total: items.length,
          }
          return result
        },
        {} as Record<TrackerKey, { done: number; total: number }>,
      ),
    [completedIds],
  )
  const overall = Object.values(counts).reduce(
    (result, count) => ({
      done: result.done + count.done,
      total: result.total + count.total,
    }),
    { done: 0, total: 0 },
  )

  function setAll(tracker: TrackerKey, completed: boolean) {
    if (!completed && !window.confirm('Desmarcar tudo nesta aba?')) return
    onBulkUpdate({ tracker, completed })
  }

  async function handleLogout() {
    if (!onLogout) return
    setLoggingOut(true)
    try {
      await onLogout()
    } finally {
      setLoggingOut(false)
    }
  }

  function exportProgress() {
    const contents = createProgressExport(completedIdList)
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(contents, null, 2)], { type: 'application/json' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'expedition-33-progresso.json'
    link.click()
    URL.revokeObjectURL(url)
    setTransferMessage('Progresso exportado.')
  }

  async function importProgress(file: File) {
    if (!onReplaceProgress) return

    try {
      const parsed = parseProgressImport(await file.text())
      if (!window.confirm('Substituir o progresso atual pelo conteúdo deste arquivo?'))
        return
      await onReplaceProgress({ completedIds: parsed.completedIds })
      setTransferMessage('Progresso importado com sucesso.')
    } catch {
      setTransferMessage('Arquivo de progresso inválido.')
    }
  }

  return (
    <main className="page-shell">
      <div className="account-bar">
        <span className="account-identity">
          <span className="account-spark" aria-hidden="true">
            ✦
          </span>{' '}
          {viewer.displayName}
        </span>

        <div className="account-actions">
          {mode === 'authenticated' ? (
            <>
              <button
                type="button"
                onClick={() => onToggleVisibility?.(!isPublic)}
                aria-pressed={isPublic}
              >
                {isPublic ? 'Perfil público' : 'Perfil privado'}
              </button>
              {isPublic && profileSlug ? (
                <a href={`/expedition/${profileSlug}`}>Ver perfil</a>
              ) : null}
              <button type="button" onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? 'Saindo…' : 'Sair'}
              </button>
            </>
          ) : (
            <a href="/login">
              {mode === 'demo' ? 'Criar minha expedição' : 'Minha expedição'}
            </a>
          )}
          <ThemeToggle />
        </div>
      </div>

      <div className="wrap">
        <header className="masthead">
          <p className="eyebrow">Clair Obscur · Expedition 33</p>
          <h1>Colecionáveis</h1>
          <p className="subtitle">
            {mode === 'public'
              ? `Expedição compartilhada por ${viewer.displayName}`
              : mode === 'demo'
                ? 'Demonstração interativa do checklist'
                : 'Checklist de progresso para a platina'}
          </p>
          <p className="overall-progress">
            <strong>{overall.done}</strong> de {overall.total} itens encontrados no total
          </p>

          <div className="discovery-tools">
            <label className="search-field">
              <span>Buscar</span>
              <input
                type="search"
                value={search}
                placeholder="Nome ou localização"
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <fieldset className="filter-group">
              <legend>Filtrar itens</legend>
              {(
                [
                  ['all', 'Todos'],
                  ['pending', 'Pendentes'],
                  ['completed', 'Concluídos'],
                  ['missable', 'Perdíveis'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={itemFilter === value ? 'active' : undefined}
                  aria-pressed={itemFilter === value}
                  onClick={() => setItemFilter(value)}
                >
                  {label}
                </button>
              ))}
            </fieldset>
          </div>

          <div className="tabs" role="tablist" aria-label="Tipos de colecionáveis">
            {(Object.keys(TRACKERS) as TrackerKey[]).map((key) => (
              <button
                key={key}
                id={`tab-${key}`}
                type="button"
                role="tab"
                aria-selected={activeTracker === key}
                aria-controls={`panel-${key}`}
                className={`tab${activeTracker === key ? ' active' : ''}`}
                onClick={() => setActiveTracker(key)}
              >
                {TRACKERS[key].title}{' '}
                <span className="tab-count">
                  {counts[key].done}/{counts[key].total}
                </span>
              </button>
            ))}
          </div>
        </header>

        <div className="panel-body">
          {mode === 'authenticated' ? (
            <div className="data-toolbar">
              <button className="btn" type="button" onClick={exportProgress}>
                Exportar progresso
              </button>
              <label className="btn import-button">
                Importar progresso
                <input
                  type="file"
                  accept="application/json,.json"
                  aria-label="Importar arquivo de progresso"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void importProgress(file)
                    event.target.value = ''
                  }}
                />
              </label>
              {transferMessage ? <span role="status">{transferMessage}</span> : null}
            </div>
          ) : null}

          {(Object.keys(TRACKERS) as TrackerKey[]).map((key) => (
            <TrackerPanel
              key={key}
              trackerKey={key}
              active={activeTracker === key}
              completedIds={completedIds}
              pendingIds={pendingIds}
              bulkPending={bulkPending}
              count={counts[key]}
              search={search}
              itemFilter={itemFilter}
              readOnly={readOnly}
              onToggle={(collectibleId, completed) =>
                onUpdate({ collectibleId, completed })
              }
              onSetAll={setAll}
            />
          ))}
        </div>
      </div>

      <div
        className={`status-toast${saveStatus !== 'idle' ? ' show' : ''}`}
        role="status"
        aria-live="polite"
      >
        {saveStatus === 'saving'
          ? 'salvando…'
          : saveStatus === 'saved'
            ? 'salvo ✓'
            : saveStatus === 'error'
              ? 'erro ao salvar'
              : ''}
      </div>
    </main>
  )
}

type TrackerPanelProps = {
  trackerKey: TrackerKey
  active: boolean
  completedIds: ReadonlySet<string>
  pendingIds: ReadonlySet<string>
  bulkPending: boolean
  count: { done: number; total: number }
  search: string
  itemFilter: ItemFilter
  readOnly: boolean
  onToggle: (id: string, completed: boolean) => void
  onSetAll: (tracker: TrackerKey, completed: boolean) => void
}

function TrackerPanel({
  trackerKey,
  active,
  completedIds,
  pendingIds,
  bulkPending,
  count,
  search,
  itemFilter,
  readOnly,
  onToggle,
  onSetAll,
}: TrackerPanelProps) {
  const tracker = TRACKERS[trackerKey]
  const percentage = count.total === 0 ? 0 : (count.done / count.total) * 100
  const normalizedSearch = normalizeSearch(search)
  const visibleCategories = tracker.categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const done = completedIds.has(item.id)
        const matchesFilter =
          itemFilter === 'all' ||
          (itemFilter === 'pending' && !done) ||
          (itemFilter === 'completed' && done) ||
          (itemFilter === 'missable' && item.missable)
        const searchableText = normalizeSearch(`${item.title} ${item.location}`)
        return matchesFilter && searchableText.includes(normalizedSearch)
      }),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <section
      id={`panel-${trackerKey}`}
      role="tabpanel"
      aria-labelledby={`tab-${trackerKey}`}
      className={`panel${active ? ' active' : ''}`}
      hidden={!active}
    >
      <div className="progress-row">
        <div
          className="progress-track"
          role="progressbar"
          aria-label={tracker.unit}
          aria-valuemin={0}
          aria-valuemax={count.total}
          aria-valuenow={count.done}
        >
          <div
            className={`progress-fill ${tracker.tone}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="progress-label">
          {count.done}/{count.total}
          <small>{tracker.unit}</small>
        </div>
      </div>

      <div className="note">{tracker.note}</div>
      {!readOnly ? (
        <div className="toolbar">
          <button
            className="btn"
            type="button"
            disabled={bulkPending}
            onClick={() => onSetAll(trackerKey, true)}
          >
            Marcar tudo
          </button>
          <button
            className="btn"
            type="button"
            disabled={bulkPending}
            onClick={() => onSetAll(trackerKey, false)}
          >
            Desmarcar tudo
          </button>
        </div>
      ) : null}

      {visibleCategories.length === 0 ? (
        <p className="empty-results">Nenhum item encontrado com estes filtros.</p>
      ) : null}

      {visibleCategories.map((category) => {
        const categoryDone = category.items.filter((item) =>
          completedIds.has(item.id),
        ).length

        return (
          <section className="category" key={category.title}>
            <div className="cat-head">
              <h2 className="cat-title">{category.title}</h2>
              <span className="cat-count">
                {categoryDone}/{category.items.length}
              </span>
            </div>
            <div className={`grid${tracker.dense ? ' dense' : ''}`}>
              {category.items.map((item) => {
                const done = completedIds.has(item.id)
                return (
                  <label
                    className={`item${done ? ' done' : ''}${readOnly ? ' read-only' : ''}`}
                    key={item.id}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      disabled={readOnly || bulkPending || pendingIds.has(item.id)}
                      onChange={(event) => onToggle(item.id, event.target.checked)}
                    />
                    <span className="item-body">
                      <span className="item-title-row">
                        <span className="spark" aria-hidden="true">
                          ✦
                        </span>
                        <span className="item-title">{item.title}</span>
                        {item.missable ? <span className="badge">Perdível</span> : null}
                        {item.automatic ? (
                          <span className="badge">Automático</span>
                        ) : null}
                      </span>
                      <span className="item-loc">{item.location}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </section>
        )
      })}

      <footer>{tracker.footer}</footer>
    </section>
  )
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
