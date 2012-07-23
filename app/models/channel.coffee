{Blocks} = require 'collections/blocks'

class exports.Channel extends Backbone.Model

  url: ->
    "http://arena-cedar.herokuapp.com/api/v1/channels/#{@get('slug')}.json?callback=?"

  maybeLoad: (slug, logo = false) ->
    if slug is @get('slug')
      return true
    else
      #app.loading().start()
      @set 'slug', slug
      @.fetch
        success: =>
          @setupBlocks(logo)
          app.loading().stop()
          @clear()
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

  containsChannels: ->
    @contents.where(block_type:"Channel").length != 0