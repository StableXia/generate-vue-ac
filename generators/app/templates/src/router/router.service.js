import localforage from 'localforage'

function interceptRoute(router) {
  router.beforeEach((to, from, next) => {
    // Determine if you need to log in.
    if (to.matched.some(res => res.meta.requireAuth)) {
      // Judge whether or not to log in.
      localforage.getItem('loginInfo', (err, value) => {
        // TODO: Here are some logic.
        if (value) {
          next()
        } else {
          // If you don't log in, you jump to the login interface.
          next({
            path: '/login'
          })
        }
      })
    } else {
      next()
    }
  })
}

export { interceptRoute }
