export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $supabase } = useNuxtApp();

  // Fetch the current session
  const { data: session, error } = await $supabase.auth.getSession();

  // Handle errors (optional, but good for debugging)
  if (error) {
    console.error('Error fetching session:', error.message);
  }

  const user = session?.user;

  // Allow access to the registration and login pages
  if (to.name === 'register' || to.name === 'login') {
    return;
  }

  // Redirect unauthenticated users
  if (!user) {
    return navigateTo('/login');
  }
});
