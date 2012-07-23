
class exports.Block extends Backbone.Model

  initialize: ->
    @checkIfMissingImage()
    @setArrangementPosition()
    
  checkIfMissingImage: ->
    # Check if the image actually is missing
    # Will have to fix this in the actual API response
    missing = '/assets/interface/missing.png'
    @set('image_thumb', null) if @get('image_thumb') is missing

  channelConnection: => 
    _.find @get('connections'), (connection) => connection.channel_id is @collection.channel.id

  setArrangementPosition: ->
    @set({position: @channelConnection().position}) if @isinArrangement()
      
  isinArrangement: ->
    if @channelConnection().connection_type is 'Arrangement'
      @set({arrangement: true})
      return true
    else
      @set({arrangement: false})
      return false


