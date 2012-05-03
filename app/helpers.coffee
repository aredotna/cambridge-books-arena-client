class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this

  initialize: ->
    null

  loading: ->
    start: -> $('#container').html('').addClass 'loading'
    stop:  -> $('#container').removeClass 'loading'