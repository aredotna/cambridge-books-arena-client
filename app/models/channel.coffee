{Blocks} = require 'collections/blocks'

class exports.Channel extends Backbone.Model

  initialize: ->
    console.log('the channel', @)

  url: ->
    "http://are.na/api/v1/channels/#{@get('slug')}.json?callback=?"

  maybeLoad: (slug) ->
    if slug is @get('slug')
      return true
    else
      @clear()
      app.loading().start()
      @set 'slug', slug
      @set 'fetching', true
      @.fetch
        success: =>
          @setupBlocks()
          @set 'fetching', false
          app.loading().stop()
          return true
        error: (error) =>
          console.log "Error: #{error}"

  setupBlocks: ->
    @contents = new Blocks(@get('blocks'))
    @contents.add(@get('channels'))