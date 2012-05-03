{BrunchApplication} = require 'helpers'
{MainRouter}        = require 'routers/main_router'
{Channel}           = require 'models/channel'
{MenuView}          = require 'views/menu_view'

class exports.Application extends BrunchApplication
  initialize: ->
    @loading().start()
    @menu = new Channel()
    
    $.when(@menu.maybeLoad "cambridge-book", 'grid', false).then =>
      console.log('menuy', @menu)
      menuView = new MenuView
        model       : @menu
        collection  : @menu.contents.bySelection()

      $('#menu').html menuView.render().el
      @router = new MainRouter
      Backbone.history.start()
    

window.app = new exports.Application
