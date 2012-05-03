{BrunchApplication} = require 'helpers'
{MainRouter}        = require 'routers/main_router'
{Channel}           = require 'models/channel'
{MenuView}          = require 'views/menu_view'

class exports.Application extends BrunchApplication
  initialize: ->
    @loading().start()
    @menu = new Channel()
    
    # load initial menu and then start loading channels

    $.when(@menu.maybeLoad "cambridge-book", 'grid', false).then =>
      menuView = new MenuView
        model       : @menu
        collection  : @menu.contents.bySelection()

      $('#menu').html menuView.render().el
      @router = new MainRouter
      Backbone.history.start()
    

window.app = new exports.Application
