{Blocks} = require 'collections/blocks'

class exports.Channel extends Backbone.Model

  url: ->
    "http://are.na/api/v1/channels/#{@get('slug')}.json?callback=?"

  maybeLoad: (slug, mode = 'grid', logo = false) ->
    if slug is @get('slug')
      return true
    else
      @clear()
      app.loading().start()
      @set 'slug', slug
      @set 'fetching', true
      @.fetch
        success: =>
          @set 'mode', mode
          @setupBlocks(logo)
          @set 'fetching', false
          app.loading().stop()
          return true
        error: (error) =>
          console.log "Error: #{error}"

  setupBlocks: (logo)->
    @contents = new Blocks()
    @contents.channel = this
    @contents.add(@get('blocks'))
    @contents.add(@get('channels'))
    @contents.cleanConnections() if logo
    @logo = @contents.shift() if logo
