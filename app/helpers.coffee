class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this

  initialize: ->
    null

  loading: ->
    start: ->
      $('#container').addClass('loading')
    stop: ->
      $('#container').removeClass('loading')
