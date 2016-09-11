import rest from './restful.js'
import { apiServer, apis } from '../config.js'

function apiGen (apis) {
  return apis.reduce(
    (o, api) => Object.defineProperty(o, api.name, {
      value: rest[api.method].bind(null, apiServer + api.uri)
    }), {})
}

export default apiGen(apis)
