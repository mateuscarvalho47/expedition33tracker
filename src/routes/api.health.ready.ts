import { createFileRoute } from '@tanstack/react-router'

import { checkDatabaseConnection } from '~/db/client.server'

export const Route = createFileRoute('/api/health/ready')({
  server: {
    handlers: {
      GET: async () => {
        try {
          await checkDatabaseConnection()
          return Response.json(
            { status: 'ready', database: 'connected' },
            { headers: { 'cache-control': 'no-store' } },
          )
        } catch {
          return Response.json(
            { status: 'unavailable', database: 'disconnected' },
            { status: 503, headers: { 'cache-control': 'no-store' } },
          )
        }
      },
    },
  },
})
