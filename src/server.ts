import { randomUUID } from 'node:crypto'

import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

import { writeLog } from '~/server/logger.server'

export default createServerEntry({
  async fetch(request) {
    const startedAt = performance.now()
    const requestId = request.headers.get('x-request-id') ?? randomUUID()

    try {
      const response = await handler.fetch(request)
      response.headers.set('x-request-id', requestId)
      response.headers.set('x-content-type-options', 'nosniff')
      response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
      response.headers.set('x-frame-options', 'DENY')

      writeLog('info', 'http_request', {
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        status: response.status,
        durationMs: Math.round(performance.now() - startedAt),
      })
      return response
    } catch (error) {
      writeLog('error', 'http_request_failed', {
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        durationMs: Math.round(performance.now() - startedAt),
        error: error instanceof Error ? error.name : 'UnknownError',
      })
      throw error
    }
  },
})
