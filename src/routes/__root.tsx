import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import type { RouterContext } from '~/router'

import appCss from '../styles/app.css?url'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Colecionáveis — Expedition 33' },
      {
        name: 'description',
        content: 'Checklist de discos e diários de Clair Obscur: Expedition 33.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <main className="message-page">
      <p className="eyebrow">Expedição perdida</p>
      <h1>Página não encontrada</h1>
      <a href="/">Voltar ao checklist</a>
    </main>
  ),
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script src="/theme-init.js" />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
