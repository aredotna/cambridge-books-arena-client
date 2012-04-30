{BlockView}      = require 'views/block_view'
{SingleView}     = require 'views/single_view'
{MenuView}       = require 'views/menu_view'
{CollectionView} = require 'views/collection_view'
{Channel}        = require 'models/channel'

class exports.MainRouter extends Backbone.Router
  routes:
    ''                  : 'collection'
    ':slug'            : 'collection'
    ':slug/mode::mode' : 'collection'
    ':slug/show::id'   : 'single'

  initialize: ->
    @channel = new Channel()
    @menu = new Channel()

    $.when(@menu.maybeLoad "cambridge-book").then =>
      menuView = new MenuView
        model       : @menu
        collection  : @menu.contents.bySelection()

      $('#menu').html menuView.render().el

  collection: (slug, mode = 'grid') ->
    if slug?
      $.when(@channel.maybeLoad slug, mode).then =>
        @collectionView = new CollectionView
          logo        : @channel.logo
          model       : @channel
          collection  : @channel.contents.byNewest()
          mode        : mode
        $('#container')
          .attr('class', 'collection')
          .html @collectionView.render().el

  single: (slug, id) ->
    $.when(@channel.maybeLoad slug).then =>
      @singleView = new SingleView
        model       : @channel.contents.get id
        collection  : @channel.contents
        channel     : @channel
      $('#container')
        .attr('class', 'single')
        .html @singleView.render().el