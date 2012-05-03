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

  collection: (slug, mode = 'list') ->
    window.scroll(0,0)
    
    if slug?
      $.when(@channel.maybeLoad slug, mode, true).then =>
        @collectionView = new CollectionView
          logo        : @channel.logo
          model       : @channel
          collection  : @channel.contents.bySelection().byNewest()
          mode        : mode
        $('#container')
          .attr('class', 'collection')
          .html @collectionView.render().el

  single: (slug, id) ->
    window.scroll(0,0)

    $.when(@channel.maybeLoad slug, 'list', true).then =>

      @singleView = new SingleView
        logo        : @channel.logo
        model       : @channel.contents.get id
        collection  : @channel.contents
        channel     : @channel
      $('#container')
        .attr('class', 'single')
        .html @singleView.render().el