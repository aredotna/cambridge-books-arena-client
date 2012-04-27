class exports.Block extends Backbone.Model
  initialize: ->
    @checkIfMissingImage()
    @channelConnection()
    
  checkIfMissingImage: ->
    # Check if the image actually is missing
    # Will have to fix this in the actual API response
    missing = '/assets/interface/missing.png'
    @set('image_thumb', null) if @get('image_thumb') is missing

  channelConnection: =>
    @set('channel_connection', _.find(@get('connections'), (connection) =>
      connection.channel_id is app.router.channel.id)
    )