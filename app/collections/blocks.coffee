{Block} = require "models/block"

class exports.Blocks extends Backbone.Collection
  model: Block

  initialize: ->
  
  comparator: (model) -> 
    if not model.isNew() 
      model.channelConnection().position

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
      date = new Date(block.channelConnection().created_at)
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
      connections = _.filter model.get('connections'), (connection)-> _.include menu_channels, connection.channel.id
      model.set('connections', connections)

      