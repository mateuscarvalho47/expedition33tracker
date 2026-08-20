import { createFileRoute } from '@tanstack/react-router'

import { TrackerPage } from '~/features/progress/components/TrackerPage'

const demoCompletedIds = [
  'childrenoflumiere',
  'goblu',
  'lune',
  'alicia',
  'endlesslight',
  'j-e35',
  'j-e49',
  'j-e57',
  'j-e68',
  'j-e84',
]

export const Route = createFileRoute('/demo')({
  component: DemoRoute,
})

function DemoRoute() {
  return (
    <TrackerPage
      viewer={{ displayName: 'Expedição de demonstração' }}
      completedIds={demoCompletedIds}
      pendingIds={new Set()}
      bulkPending={false}
      saveStatus="idle"
      mode="demo"
      onUpdate={() => undefined}
      onBulkUpdate={() => undefined}
    />
  )
}
