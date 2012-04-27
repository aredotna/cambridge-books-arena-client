{BlockView}      = require 'views/block_view'
{SingleView}     = require 'views/single_view'
{CollectionView} = require 'views/collection_view'
{Channel}        = require 'models/channel'

class exports.MainRouter extends Backbone.Router
  routes:
    ''                  : 'collection'
    '/:slug'            : 'collection'
    '/:slug/mode::mode' : 'collection'
    '/:slug/show::id'   : 'single'

  initialize: ->
    @channel = new Channel()

  collection: (slug, mode = 'list') ->
    # Save the current view mode in the channel
    slug ?= "mit-office-e14-140s"

    @channel.set {'mode', mode}

    $.when(@channel.maybeLoad slug).then =>
      @collectionView = new CollectionView
        model       : @channel
        collection  : @channel.contents
        mode        : mode
      $('body')
        .attr('class', 'collection')
        .html @collectionView.render().el

  single: (slug, id) ->
    $.when(@channel.maybeLoad slug).then =>
      @singleView = new SingleView
        model       : @channel.contents.get id
        collection  : @channel.contents
        channel     : @channel
      $('body')
        .attr('class', 'single')
        .html @singleView.render().el