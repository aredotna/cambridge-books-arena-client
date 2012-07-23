{Channel}        = require 'models/channel'
{BlockView}      = require 'views/block_view'
{SingleView}     = require 'views/single_view'
{MenuView}       = require 'views/menu_view'
{CollectionView} = require 'views/collection_view'
{SubnavView}    = require 'views/subnav_view'

class exports.MainRouter extends Backbone.Router
  routes:
    ''                 : 'index'
    'show::id'         : 'menuSingle'
    ':slug'            : 'collection'
    ':slug/mode::mode' : 'collection'
    ':slug/show::id'   : 'single'

  initialize: ->
    @channel = new Channel()
    @subnavView = new SubnavView()

  index: ->
    $('#container').html require 'views/templates/front'

  collection: (slug, mode) ->
    window.scroll(0,0)
    @subnavView.close()
    
    app.mode = mode if app.mode isnt mode and mode?
    if slug?

      $.when(@channel.maybeLoad slug, true).then =>
        
        if @channel.containsChannels()
          _.extend @subnavView, 
            model: @channel
            collection: @channel.contents
          @subnavView.open()
          app.loading().stop()

        else
          @collectionView = new CollectionView
            logo        : @channel.logo
            model       : @channel
            collection  : @channel.contents.bySelection()
            mode        : app.mode

          $('#container')
            .attr('class', 'collection')
            .html @collectionView.render().el

  single: (slug, id) ->
    window.scroll(0,0)
    $.when(@channel.maybeLoad slug, true).then =>

      @singleView = new SingleView
        logo        : @channel.logo
        model       : @channel.contents.get id
        collection  : @channel.contents
        channel     : @channel

      $('#container')
        .attr('class', 'single')
        .html @singleView.render().el

  menuSingle: (id) -> @single('cambridge-book', id)