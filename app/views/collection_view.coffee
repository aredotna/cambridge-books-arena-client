{BlockView}     = require 'views/block_view'

class exports.CollectionView extends Backbone.View
  id: 'collection'

  initialize: ->
    # Set the page title
    document.title =  "Cambridge Book / #{@model.get 'title'}"

    @logo = require "./templates/logo"
    @template = require "./templates/collection/#{@options.mode}"

  events:
    'click .toggle' : 'toggleInfo'

  randomXToY: (minVal, maxVal, floatVal) ->
    minVal + (Math.random() * (maxVal - minVal))

  toggleInfo: (e) ->
    e.preventDefault()
    @$('#channel-info').toggleClass('hide')

  addAll: ->
    @collection.each @addOne
    
  addOne: (block) =>
    view = new BlockView
      mode        : @options.mode
      model       : block
      collection  : @model.blocks
      channel     : @model

    @$('#blocks').append view.render().el

  render: ->
    @$el.html @logo
      logo    : @options.logo.toJSON()
      channel : @model.toJSON()

    @$el.append @template
      channel : @model.toJSON()
      blocks  : @collection.toJSON()

    @addAll()

    return this
