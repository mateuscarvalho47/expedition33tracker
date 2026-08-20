import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'expedition33-theme'

function getDocumentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setTheme(getDocumentTheme())
  }, [])

  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const accessibleLabel = `Ativar tema ${nextTheme === 'light' ? 'claro' : 'escuro'}`

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={accessibleLabel}
      aria-pressed={theme === 'light'}
      title={accessibleLabel}
      onClick={() => {
        applyTheme(nextTheme)
        setTheme(nextTheme)
      }}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {nextTheme === 'light' ? '☀' : '☾'}
      </span>
      <span className="theme-toggle-label">
        Tema {nextTheme === 'light' ? 'claro' : 'escuro'}
      </span>
    </button>
  )
}
