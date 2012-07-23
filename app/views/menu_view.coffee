{BlockView}     = require 'views/block_view'
{SubnavView}    = require 'views/subnav_view'
{Channel}       = require 'models/channel'

class exports.MenuView extends Backbone.View
  id: 'collection'

  initialize: -> 
    @template = require "./templates/collection/menu"


  events:
    'click .logo' : 'toggleMenu'
    #'click .channelLink' : 'openSubnav' 

  toggleMenu: ->
    @$('#menu-contents').toggleClass 'hide'

  openSubnav: (e)->
    @subnavChannel ||= new Channel
    @subnavView ||= new SubnavView(el:$('#subnav'))

    @subnavView.close()
    $.when(@subnavChannel.maybeLoad $(e.target).data('slug'), false).then =>
      @subnavView.model = @subnavChannel
      @subnavView.collection = @subnavChannel.contents
      @subnavView.open()

    false

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

    @subnavView?.render()
    @addAll()

    return this
