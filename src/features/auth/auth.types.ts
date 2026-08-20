export type Viewer = {
  id: string
  email: string
  displayName: string
  profileSlug: string
  isPublic: boolean
}

export type AuthResult =
  | { ok: true; user: Viewer }
  | { ok: false; error: string; field?: 'email' | 'password' }
