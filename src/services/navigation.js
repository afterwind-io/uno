import routes from './routes.js'

export default {
  go (name) {
    // window.history.pushState(
    //   null,
    //   name,
    //   routes.GetUriByName(name)
    // )
    window.location.replace(
      window.location.href.replace(
        /#.+/,
        routes.GetUriByName(name)
      )
    )
  }
}
