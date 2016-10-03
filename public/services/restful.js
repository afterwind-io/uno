import request from 'superagent'

export default {
  post (uri, data, sc, fc) {
    request.post(uri)
      .set({
        'Content-Type': 'application/json'
      })
      .withCredentials()
      .timeout(1000 * 30)
      .send(data)
      .end((err, res) => {
        if (err) {
          if (fc) fc(err)
        } else {
          if (sc) sc(res.body)
        }
      })
  }
}
