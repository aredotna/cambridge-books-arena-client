{BlockView}     = require 'views/block_view'
{SubnavView}    = require 'views/subnav_view'
{Channel}       = require 'models/channel'

class exports.MenuView extends Backbone.View
  id: 'collection'

  initialize: -> 
    @template = require "./templates/collection/menu"

  events:
    'click .logo' : 'toggleMenu'

  toggleMenu: ->
    @$('#menu-contents').toggleClass 'hide'

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
    @logo = @collection.bySelection().at(0)

    @$el.html @template
      channel : @model.toJSON()
      logo    : @logo.toJSON()
      blocks  : @collection.toJSON()

    @addAll()

    return this
