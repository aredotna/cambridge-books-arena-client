{Block} = require "models/block"

class exports.Blocks extends Backbone.Collection
  model: Block
  
  comparator: (model) -> model.get('channel_connection').position

  next: (model) ->
    i = @at @indexOf(model)
    return false if `undefined` is i or i < 0
    @at @indexOf(model) + 1

  prev: (model) ->
    i = @at @indexOf(model)
    return false if `undefined` is i or i < 1
    @at @indexOf(model) - 1