import { createServerFn } from '@tanstack/react-start'

import { authMiddleware } from '~/features/auth/auth.functions'

import { profileSlugSchema, updateProfileVisibilitySchema } from './profile.schemas'
import { findPublicProfile, updateProfileVisibility } from './profile.server'

export const getPublicProfileFn = createServerFn({ method: 'GET' })
  .validator(profileSlugSchema)
  .handler(({ data }) => findPublicProfile(data.slug))

export const updateProfileVisibilityFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(updateProfileVisibilitySchema)
  .handler(({ context, data }) => updateProfileVisibility(context.user.id, data.isPublic))
