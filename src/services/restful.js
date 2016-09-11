import $ from 'jquery'

$.ajaxSetup({
  contentType: 'application/json; charset=utf-8'
})

export default {
  post (uri, data, sc, fc) {
    $.post(uri, JSON.stringify(data))
      .done((res) => { if (sc) sc(res) })
      .fail((res) => { if (fc) fc(res) })
  }
}
