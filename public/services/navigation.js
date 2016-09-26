import router from '../routes.js'

export default {
  go (name) {
    router.push({ name })
  }
}
