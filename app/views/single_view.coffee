template    = require './templates/single/list'
{BlockView} = require 'views/block_view'

class exports.SingleView extends BlockView
  id: 'single'
  className: 'block'

  initialize: ->
    # Set the page title
    document.title = 
      if @model.get 'title'
        "#{@options.channel.get 'title'}: #{@model.get 'title'}"
      else
        @options.channel.get 'title'

  render: (id) ->
    @$el.html template
      channel : @options.channel.toJSON()
      block   : @model.toJSON()
      blocks  : @collection.toJSON()
      next    : @collection.next(@model)
      prev    : @collection.prev(@model)
    
    return this
