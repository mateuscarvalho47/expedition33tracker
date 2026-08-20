try {
  const savedTheme = window.localStorage.getItem('expedition33-theme')
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  const theme =
    savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : prefersLight
        ? 'light'
        : 'dark'

  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
} catch {
  document.documentElement.dataset.theme = 'dark'
}
