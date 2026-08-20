type LogLevel = 'info' | 'error'

type LogFields = Record<string, boolean | number | string | undefined>

export function writeLog(level: LogLevel, event: string, fields: LogFields = {}) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...fields,
  })

  if (level === 'error') console.error(entry)
  else console.info(entry)
}
