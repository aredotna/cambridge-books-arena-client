class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this
      Backbone.history.start()

  initialize: ->
    null

  loading: ->
    start: -> $('#container').html('').addClass 'loading'
    stop:  -> $('#container').removeClass 'loading'