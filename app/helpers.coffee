class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this
      Backbone.history.start()

  initialize: ->
    null

  loading: ->
    start: -> $('body').addClass    'loading'
    stop:  -> $('body').removeClass 'loading'