class exports.BrunchApplication
  constructor: ->
    $ =>
      @initialize this
      Backbone.history.start()

  initialize: ->
    null

  loading: ->
    start: ->
      $('body').addClass('loading')
      $('#container').html('')
    stop: ->
      $('body').removeClass('loading')