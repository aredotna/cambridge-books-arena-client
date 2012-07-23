class exports.SubnavView extends Backbone.View

	initialize: ->
		@itemId = @options.itemId  
		@template = require "./templates/collection/subnav"

	events:{}

	open: ->
		@render()
		$('#subnav').slideDown()
			

	close: ()->
		$('#subnav').slideUp()

	render: ->
		$('#subnav').html @template(blocks:@collection.toJSON())