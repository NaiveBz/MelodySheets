/*jslint browser: true */
/*global _, jQuery, $, console, Backbone */

var library = {};

(function($){ //TODO: find out what this pattern does
	//TODO: find out what model and collection extend does
	library.Song = Backbone.Model.extend({});

	library.Songs = Backbone.Collection.extend({
		model:library.Song, 
		url: "mocks/dummy-library.json"
	});
	
	/* Creates an instance of the collection in memory, retrieve the data from the server, 
       and parse it into a collection of model.
       
       Call it whenever you want to load the data.
       
       It is synchronous - it will wait for data to be loaded.
     */
	library.initData = function() {
		library.songs = new library.Songs();
		library.songs.fetch({async: false}); //TODO: try this with true and do huge delay on load
	};
	
	//TODO: explore other options: Backbone views can be defined and set up numerous ways ...
	library.SongsListView = Backbone.View.extend({
		// All views have a DOM element at all times (`this.el` property), whether 
		// they've already been inserted into the page or not. Backbone will
		// `this.el` out of following properties:
		tagName: 'ul',
		id: 'songs-list',
		attributes: {"data-role": 'listview', "data-filter": 'true'}, //TODO: listview is jqm thing, no?
		
		// this method is called by backbone.js upon list view object initialization
		initialize: function() {
			// whenever something add an item into `this.collection`, `this.add` 
			// method will be called 
			this.collection.bind('add', this.add, this);
			// One liner to do following:
			// 1.) use jQuery to acquire songs-list-item-template from DOM,
			// 2.) compile template into function that renders items,
			// 3.) store compiled function.
			this.template = _.template($('#songs-list-item-template').html());
		},
		
		// this method is called by backbone.js to render items
		render: function() {
			/* create convenient shortcuts for objects found in options */ 
			
			// this.options is filled by backbone.js from 
			// parameters send to view constructor
			var container = this.options.viewContainer;
			// this.collection is pre-filled by backbone.js from this.options.collection
			var songs = this.collection;
			// convenient shortcut to template method created in `initialize`
			var template = this.template;
			// TODO: I guess that this is the same as this.$el
			var listView = $(this.el);

			listView.empty();
			// we assume that songs collection have been created by Backbone.Collection.extend
			songs.each(function(song){
				listView.append(template(song.toJSON()));
			});
			
			//TODO: what is container object supposed to be???
			container.html(listView);
			container.trigger('create');
			
			// recommended in backbone.js documentation 
			return this;
		},

		//TODO: add sorting using this: http://blog.chariotsolutions.com/2012/01/sorting-collections-with-backbonejs-and.html
		//TODO: do optimalized version
		add: function(item) {
			var container = this.options.viewContainer;
			//$(this.el) and $('#songs-list') are equivalent at this point
			//TODO: $el should be equivalent too, but it is undefined now. Why?
			var listView = $(this.el);
			// convenient shortcut to template method created in `initialize`
			var template = this.template;

			// add a new item
			listView.append(template(item.toJSON()));
			// jQuery will refresh list view - only newly added items are affected
			listView.listview('refresh');

			return this;
		}

	});
	
	
}(jQuery)); //TODO: find out what this pattern does

var bindLibraryPageEvents = function() {
  // load everything whenever the page is shown for the first time
  $('#library').on('pageinit', function(){
  	var listContainer = $('#library').find(":jqmData(role='content')");
  	library.initData();
  	var listView = new library.SongsListView({collection: library.songs, viewContainer: listContainer});
  	listView.render();
  });
  
  $('#new-button').on('click', function() {
	  //TODO: fill by real functionality
	  var id = library.songs.length + 1;
	  library.songs.add({
          "id":id,
          "name": "Newly Added " + id,
          "sheet": "tabstave notation=true tablature=false\nnotes 4-5-6/3 ## | 5-4-2/3 2/2\ntabstave notation=true tablature=false\nnotes 4-5-6/3 ## | 5-4-2/3 2/2"
      });
	  id=id+1;
  });
};