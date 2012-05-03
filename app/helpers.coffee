class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this

  initialize: ->
    null

  loading: ->
    start: ->
      $('body').addClass('loading')
      $('#container').html('')
    stop: ->
      $('body').removeClass('loading')
