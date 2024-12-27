// middleware/normalizeDisplayName.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  const displayName = to.params.displayName as string
  if (displayName && displayName !== displayName.toLowerCase()) {
    const lowercased = displayName.toLowerCase()
    return navigateTo(`/raider/${lowercased}`)
  }
})
