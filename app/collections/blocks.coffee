{Block} = require "models/block"

class exports.Blocks extends Backbone.Collection
  model: Block

  initialize: ->
  
  comparator: (model) -> 
    if model.channelConnection()?
      model.channelConnection().position
    else
      date = new Date(@get('created_at'))
      - date.valueOf()

  filtered: (criteria) ->
    new exports.Blocks(@select(criteria))

  bySelection: (selection) ->
    @filtered (block) ->
      if selection is 'selected'
        block.get('arrangement') is false
      else
        block.get('arrangement') is true

  sortedBy: (comparator) ->
    sortedCollection = new exports.Blocks(@models)
    sortedCollection.comparator = comparator
    sortedCollection.sort()
    return sortedCollection

  byNewest: ->
    @sortedBy (block) ->
      date = if block.channelConnection()? then new Date(block.channelConnection().created_at) else block.get('created_at')
      - date.valueOf()

  next: (model) ->
    i = @at @indexOf(model)
    return false if `undefined` is i or i < 0
    @at @indexOf(model) + 1

  prev: (model) ->
    i = @at @indexOf(model)
    return false if `undefined` is i or i < 1
    @at @indexOf(model) - 1

  cleanConnections: ->
    menu_channels = app.menu.contents.where({type:'Channel'}).map((model)-> model.id)

    @each (model)->
      connections = _.filter model.get('connections'), (connection)-> 

        included = _.include menu_channels, connection.channel.id
        published = connection.channel.published
        
        return (included and published)

      model.set('connections', connections)

      