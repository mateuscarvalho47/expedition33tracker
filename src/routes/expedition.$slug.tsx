import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPublicProfileFn } from '~/features/profile/profile.functions'
import { TrackerPage } from '~/features/progress/components/TrackerPage'

export const Route = createFileRoute('/expedition/$slug')({
  loader: async ({ params }) => {
    const profile = await getPublicProfileFn({ data: { slug: params.slug } })
    if (!profile) throw notFound()
    return profile
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.displayName} — Expedition 33`
          : 'Expedição não encontrada',
      },
      {
        name: 'description',
        content: 'Progresso público de colecionáveis em Clair Obscur: Expedition 33.',
      },
    ],
  }),
  component: PublicProfileRoute,
})

function PublicProfileRoute() {
  const profile = Route.useLoaderData()

  return (
    <TrackerPage
      viewer={{ displayName: profile.displayName }}
      completedIds={profile.completedIds}
      pendingIds={new Set()}
      bulkPending={false}
      saveStatus="idle"
      mode="public"
      profileSlug={profile.profileSlug}
      onUpdate={() => undefined}
      onBulkUpdate={() => undefined}
    />
  )
}
