{BlockView}     = require 'views/block_view'

class exports.MenuView extends Backbone.View
  id: 'collection'

  initialize: -> @template = require "./templates/collection/menu"

  addAll: ->
    @collection.each @addOne
    
  addOne: (block) =>
    view = new BlockView
      mode        : 'list'
      model       : block
      collection  : @model.blocks
      channel     : @model

    @$('#blocks').append view.render().el

  render: ->
    @$el.html @template
      channel : @model.toJSON()
      blocks  : @collection.toJSON()

    @addAll()

    return this
