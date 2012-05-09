(function(/*! Brunch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    };
    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
}).call(this);(this.require.define({
  "views/menu_view": function(exports, require, module) {
    (function() {
  var BlockView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BlockView = require('views/block_view').BlockView;

  exports.MenuView = (function(_super) {

    __extends(MenuView, _super);

    function MenuView() {
      this.addOne = __bind(this.addOne, this);
      MenuView.__super__.constructor.apply(this, arguments);
    }

    MenuView.prototype.id = 'collection';

    MenuView.prototype.initialize = function() {
      return this.template = require("./templates/collection/menu");
    };

    MenuView.prototype.events = {
      'click .logo': 'toggleMenu'
    };

    MenuView.prototype.toggleMenu = function() {
      return this.$('#menu-contents').toggleClass('hide');
    };

    MenuView.prototype.addAll = function() {
      return this.collection.each(this.addOne);
    };

    MenuView.prototype.addOne = function(block) {
      var view;
      view = new BlockView({
        mode: 'list',
        model: block,
        collection: this.model.blocks,
        channel: this.model
      });
      return this.$('#blocks').append(view.render().el);
    };

    MenuView.prototype.render = function() {
      this.logo = this.collection.shift();
      this.$el.html(this.template({
        channel: this.model.toJSON(),
        logo: this.logo.toJSON(),
        blocks: this.collection.toJSON()
      }));
      this.addAll();
      return this;
    };

    return MenuView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "helpers": function(exports, require, module) {
    (function() {

  exports.BrunchApplication = (function() {

    function BrunchApplication() {
      var _this = this;
      $(function() {
        return _this.initialize(_this);
      });
    }

    BrunchApplication.prototype.initialize = function() {
      return null;
    };

    BrunchApplication.prototype.loading = function() {
      return {
        start: function() {
          return $('#container').html('').addClass('loading');
        },
        stop: function() {
          return $('#container').removeClass('loading');
        }
      };
    };

    return BrunchApplication;

  })();

}).call(this);

  }
}));
(this.require.define({
  "collections/blocks": function(exports, require, module) {
    (function() {
  var Block,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Block = require("models/block").Block;

  exports.Blocks = (function(_super) {

    __extends(Blocks, _super);

    function Blocks() {
      Blocks.__super__.constructor.apply(this, arguments);
    }

    Blocks.prototype.model = Block;

    Blocks.prototype.initialize = function() {};

    Blocks.prototype.comparator = function(model) {
      var date;
      if (model.channelConnection() != null) {
        return model.channelConnection().position;
      } else {
        date = new Date(this.get('created_at'));
        return -date.valueOf();
      }
    };

    Blocks.prototype.filtered = function(criteria) {
      return new exports.Blocks(this.select(criteria));
    };

    Blocks.prototype.bySelection = function(selection) {
      return this.filtered(function(block) {
        if (selection === 'selected') {
          return block.get('arrangement') === false;
        } else {
          return block.get('arrangement') === true;
        }
      });
    };

    Blocks.prototype.sortedBy = function(comparator) {
      var sortedCollection;
      sortedCollection = new exports.Blocks(this.models);
      sortedCollection.comparator = comparator;
      sortedCollection.sort();
      return sortedCollection;
    };

    Blocks.prototype.byNewest = function() {
      return this.sortedBy(function(block) {
        var date;
        date = block.channelConnection() != null ? new Date(block.channelConnection().created_at) : block.get('created_at');
        return -date.valueOf();
      });
    };

    Blocks.prototype.next = function(model) {
      var i;
      i = this.at(this.indexOf(model));
      if (undefined === i || i < 0) return false;
      return this.at(this.indexOf(model) + 1);
    };

    Blocks.prototype.prev = function(model) {
      var i;
      i = this.at(this.indexOf(model));
      if (undefined === i || i < 1) return false;
      return this.at(this.indexOf(model) - 1);
    };

    Blocks.prototype.cleanConnections = function() {
      var menu_channels;
      menu_channels = app.menu.contents.where({
        type: 'Channel'
      }).map(function(model) {
        return model.id;
      });
      return this.each(function(model) {
        var connections;
        connections = _.filter(model.get('connections'), function(connection) {
          return _.include(menu_channels, connection.channel.id);
        });
        return model.set('connections', connections);
      });
    };

    return Blocks;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/block": function(exports, require, module) {
    (function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.Block = (function(_super) {

    __extends(Block, _super);

    function Block() {
      this.channelConnection = __bind(this.channelConnection, this);
      Block.__super__.constructor.apply(this, arguments);
    }

    Block.prototype.initialize = function() {
      this.checkIfMissingImage();
      return this.setArrangementPosition();
    };

    Block.prototype.checkIfMissingImage = function() {
      var missing;
      missing = '/assets/interface/missing.png';
      if (this.get('image_thumb') === missing) {
        return this.set('image_thumb', null);
      }
    };

    Block.prototype.channelConnection = function() {
      var _this = this;
      return _.find(this.get('connections'), function(connection) {
        return connection.channel_id === _this.collection.channel.id;
      });
    };

    Block.prototype.setArrangementPosition = function() {
      if (this.isinArrangement()) {
        return this.set({
          position: this.channelConnection().position
        });
      }
    };

    Block.prototype.isinArrangement = function() {
      if (this.channelConnection().connection_type === 'Arrangement') {
        this.set({
          arrangement: true
        });
        return true;
      } else {
        this.set({
          arrangement: false
        });
        return false;
      }
    };

    return Block;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "models/channel": function(exports, require, module) {
    (function() {
  var Blocks,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Blocks = require('collections/blocks').Blocks;

  exports.Channel = (function(_super) {

    __extends(Channel, _super);

    function Channel() {
      Channel.__super__.constructor.apply(this, arguments);
    }

    Channel.prototype.url = function() {
      return "http://are.na/api/v1/channels/" + (this.get('slug')) + ".json?callback=?";
    };

    Channel.prototype.maybeLoad = function(slug, logo) {
      var _this = this;
      if (logo == null) logo = false;
      if (slug === this.get('slug')) {
        return true;
      } else {
        this.clear();
        app.loading().start();
        this.set('slug', slug);
        return this.fetch({
          success: function() {
            _this.setupBlocks(logo);
            app.loading().stop();
            return true;
          },
          error: function(error) {
            return console.log("Error: " + error);
          }
        });
      }
    };

    Channel.prototype.setupBlocks = function(logo) {
      this.contents = new Blocks();
      this.contents.channel = this;
      this.contents.add(this.get('blocks'));
      this.contents.add(this.get('channels'));
      if (logo) this.contents.cleanConnections();
      if (logo) return this.logo = this.contents.shift();
    };

    return Channel;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "routers/main_router": function(exports, require, module) {
    (function() {
  var BlockView, Channel, CollectionView, MenuView, SingleView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BlockView = require('views/block_view').BlockView;

  SingleView = require('views/single_view').SingleView;

  MenuView = require('views/menu_view').MenuView;

  CollectionView = require('views/collection_view').CollectionView;

  Channel = require('models/channel').Channel;

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      '': 'index',
      'show::id': 'menuSingle',
      ':slug': 'collection',
      ':slug/mode::mode': 'collection',
      ':slug/show::id': 'single'
    };

    MainRouter.prototype.initialize = function() {
      return this.channel = new Channel();
    };

    MainRouter.prototype.index = function() {
      console.log('here');
      return $('#container').html(require('views/templates/front'));
    };

    MainRouter.prototype.collection = function(slug, mode) {
      var _this = this;
      window.scroll(0, 0);
      if (app.mode !== mode && (mode != null)) app.mode = mode;
      if (slug != null) {
        return $.when(this.channel.maybeLoad(slug, true)).then(function() {
          _this.collectionView = new CollectionView({
            logo: _this.channel.logo,
            model: _this.channel,
            collection: _this.channel.contents.bySelection().byNewest(),
            mode: app.mode
          });
          return $('#container').attr('class', 'collection').html(_this.collectionView.render().el);
        });
      }
    };

    MainRouter.prototype.single = function(slug, id) {
      var _this = this;
      window.scroll(0, 0);
      return $.when(this.channel.maybeLoad(slug, true)).then(function() {
        console.log('here', _this.channel);
        console.log('thing', _this.channel.contents.get(id));
        _this.singleView = new SingleView({
          logo: _this.channel.logo,
          model: _this.channel.contents.get(id),
          collection: _this.channel.contents,
          channel: _this.channel
        });
        return $('#container').attr('class', 'single').html(_this.singleView.render().el);
      });
    };

    MainRouter.prototype.menuSingle = function(id) {
      return this.single('cambridge-book', id);
    };

    return MainRouter;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "views/block_view": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.BlockView = (function(_super) {

    __extends(BlockView, _super);

    function BlockView() {
      BlockView.__super__.constructor.apply(this, arguments);
    }

    BlockView.prototype.className = "block full";

    BlockView.prototype.initialize = function() {
      return this.template = require("./templates/single/" + this.options.mode);
    };

    BlockView.prototype.render = function() {
      this.$el.html(this.template({
        mode: this.options.mode,
        channel: this.options.channel.toJSON(),
        block: this.model.toJSON()
      }));
      return this;
    };

    return BlockView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/collection_view": function(exports, require, module) {
    (function() {
  var BlockView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BlockView = require('views/block_view').BlockView;

  exports.CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      this.addOne = __bind(this.addOne, this);
      CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.id = 'collection';

    CollectionView.prototype.initialize = function() {
      document.title = "Cambridge Book / " + (this.model.get('title'));
      this.logo = require("./templates/logo");
      return this.template = require("./templates/collection/" + this.options.mode);
    };

    CollectionView.prototype.events = {
      'click .toggle': 'toggleInfo'
    };

    CollectionView.prototype.randomXToY = function(minVal, maxVal, floatVal) {
      return minVal + (Math.random() * (maxVal - minVal));
    };

    CollectionView.prototype.toggleInfo = function(e) {
      e.preventDefault();
      return this.$('#channel-info').toggleClass('hide');
    };

    CollectionView.prototype.addAll = function() {
      return this.collection.each(this.addOne);
    };

    CollectionView.prototype.addOne = function(block) {
      var view;
      view = new BlockView({
        mode: this.options.mode,
        model: block,
        collection: this.model.blocks,
        channel: this.model
      });
      return this.$('#blocks').append(view.render().el);
    };

    CollectionView.prototype.render = function() {
      this.$el.html(this.logo({
        logo: this.options.logo.toJSON(),
        channel: this.model.toJSON()
      }));
      this.$el.append(this.template({
        channel: this.model.toJSON(),
        blocks: this.collection.toJSON()
      }));
      this.addAll();
      return this;
    };

    return CollectionView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var BrunchApplication, Channel, MainRouter, MenuView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('helpers').BrunchApplication;

  MainRouter = require('routers/main_router').MainRouter;

  Channel = require('models/channel').Channel;

  MenuView = require('views/menu_view').MenuView;

  exports.Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      var _this = this;
      this.loading().start();
      this.mode = 'list';
      this.menu = new Channel();
      return $.when(this.menu.maybeLoad("cambridge-book", false)).then(function() {
        var menuView;
        menuView = new MenuView({
          model: _this.menu,
          collection: _this.menu.contents.bySelection()
        });
        $('#menu').html(menuView.render().el);
        _this.router = new MainRouter;
        return Backbone.history.start();
      });
    };

    return Application;

  })(BrunchApplication);

  window.app = new exports.Application;

}).call(this);

  }
}));
(this.require.define({
  "views/single_view": function(exports, require, module) {
    (function() {
  var BlockView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('./templates/single/list');

  BlockView = require('views/block_view').BlockView;

  exports.SingleView = (function(_super) {

    __extends(SingleView, _super);

    function SingleView() {
      SingleView.__super__.constructor.apply(this, arguments);
    }

    SingleView.prototype.id = 'single';

    SingleView.prototype.className = 'block';

    SingleView.prototype.initialize = function() {
      return document.title = this.model.get('title') ? "" + (this.options.channel.get('title')) + ": " + (this.model.get('title')) : this.options.channel.get('title');
    };

    SingleView.prototype.render = function(id) {
      this.$el.html(template({
        channel: this.options.channel.toJSON(),
        block: this.model.toJSON(),
        blocks: this.collection.toJSON(),
        next: this.collection.next(this.model),
        prev: this.collection.prev(this.model)
      }));
      return this;
    };

    return SingleView;

  })(BlockView);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/logo": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var _ref;
    
      console.log('block', this.logo);
    
      __out.push('\n\n\n');
    
      if ((_ref = this.logo.image) != null ? _ref.thumb : void 0) {
        __out.push('\n  <div id="info" style="background: transparent url(\'');
        __out.push(__sanitize(this.logo.image.thumb));
        __out.push('\') no-repeat center center;">\n  </div>\n');
      } else {
        __out.push('\n  <div id="info">\n    <h1>\n      <span>');
        __out.push(__sanitize(this.logo.content));
        __out.push('</span>\n    </h1>\n  </div>\n');
      }
    
      __out.push('\n\n');
    
      if ((this.logo.description != null) && this.logo.description !== "") {
        __out.push('\n  <div id="channel-info" class="hide">\n    <div class="description">\n      ');
        __out.push(this.logo.description);
        __out.push('\n    </div>\n  </div>\n');
      }
    
      __out.push('\n\n<nav id="mode">\n  ');
    
      if ((this.logo.description != null) && this.logo.description !== "") {
        __out.push('\n    <a href="#" class="toggle">Info</a><br>\n  ');
      }
    
      __out.push('\n  <a href="#/');
    
      __out.push(__sanitize(this.channel.slug));
    
      __out.push('/mode:grid">Grid</a>\n  <a href="#/');
    
      __out.push(__sanitize(this.channel.slug));
    
      __out.push('/mode:list">List</a>\n  \n</nav>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/collection/grid": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div id="modal" class="hide"></div>\n<div id="blocks" class="grid"></div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/collection/menu": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var block, _i, _len, _ref;
    
      __out.push('\n<div class="logo" style="background: transparent url(\'');
    
      __out.push(__sanitize(this.logo.image.display));
    
      __out.push('\') no-repeat left center;">\n</div>\n\n<div id="menu-contents" class="hide">\n  ');
    
      _ref = this.blocks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        __out.push('\n    <div class="block ');
        __out.push(block.block_type);
        __out.push('">\n      ');
        if (block.block_type === 'Image') {
          __out.push('\n        <!-- IMAGE -->\n        <img src="');
          __out.push(__sanitize(block.image.display));
          __out.push('" alt="');
          __out.push(__sanitize(block.title));
          __out.push('" />\n      ');
        } else if (block.block_type === 'Link') {
          __out.push('\n        <!-- LINK -->\n        ');
          if (block.image.display) {
            __out.push('\n          <a href="');
            __out.push(__sanitize(block.link_url));
            __out.push('" class="external" target="_blank">\n            <img src="');
            __out.push(__sanitize(block.image.display));
            __out.push('" alt="');
            __out.push(__sanitize(block.title));
            __out.push('" />\n          </a>\n        ');
          } else {
            __out.push('\n          <p>\n            <a href="');
            __out.push(__sanitize(block.link_url));
            __out.push('" class="external url" target="_blank">');
            __out.push(__sanitize(block.link_url));
            __out.push('</a>\n          </p>\n        ');
          }
          __out.push('\n      ');
        } else if (block.block_type === 'Text') {
          __out.push('\n        <!-- TEXT -->\n        <div class="content">\n          ');
          __out.push(block.content);
          __out.push('\n        </div>\n      ');
        } else if (block.block_type === 'Channel') {
          __out.push('\n        <!-- TEXT -->\n          ');
          if (block.published === true) {
            __out.push('\n            <a href="#/');
            __out.push(__sanitize(block.slug));
            __out.push('">');
            __out.push(block.title);
            __out.push('</a>\n          ');
          }
          __out.push('\n      ');
        }
        __out.push('\n    </div>\n  ');
      }
    
      __out.push('\n</div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/collection/list": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div id="modal" class="hide"></div>\n<div id="blocks" class="list"></div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/single/grid": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div class="thumb">\n  ');
    
      if (this.block.image.thumb) {
        __out.push('\n    <div class="image">\n      <a href="#/');
        __out.push(__sanitize(this.channel.slug));
        __out.push('/show:');
        __out.push(__sanitize(this.block.id));
        __out.push('">\n        <img src="');
        __out.push(__sanitize(this.block.image.thumb));
        __out.push('" alt="');
        __out.push(__sanitize(this.block.title));
        __out.push('" />\n      </a>\n    </div>\n  ');
      } else if (this.block.title) {
        __out.push('\n    <a href="#/');
        __out.push(__sanitize(this.channel.slug));
        __out.push('/show:');
        __out.push(__sanitize(this.block.id));
        __out.push('">\n      ');
        __out.push(__sanitize(_.str.prune(this.block.title, 30)));
        __out.push('\n    </a>\n  ');
      } else {
        __out.push('\n    <a href="#/');
        __out.push(__sanitize(this.channel.slug));
        __out.push('/show:');
        __out.push(__sanitize(this.block.id));
        __out.push('">\n      Untitled\n    </a>\n  ');
      }
    
      __out.push('\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/single/list": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var connection, _i, _len, _ref;
    
      if (this.prev || this.next) {
        __out.push('\n  <nav class="pagination">\n    <a href="#/');
        __out.push(__sanitize(this.channel.slug));
        __out.push('" class="up">Back</a>\n  </nav>\n');
      }
    
      __out.push('\n\n<article>\n  ');
    
      if (this.block.block_type === 'Media') {
        __out.push('\n    <!-- MEDIA -->\n    <div class="embed">\n      ');
        if (this.block.embed_html) {
          __out.push('\n        ');
          __out.push(this.block.embed_html);
          __out.push('\n      ');
        } else {
          __out.push('\n        <a href="');
          __out.push(__sanitize(this.block.embed_source_url));
          __out.push('" class="url external">\n          ');
          __out.push(__sanitize(this.block.embed_source_url));
          __out.push('\n        </a>\n      ');
        }
        __out.push('\n    </div>\n  ');
      } else if (this.block.block_type === 'Image') {
        __out.push('\n    <!-- IMAGE -->\n\n    <a href="');
        __out.push(__sanitize(this.block.image.original));
        __out.push('" class="enlarge">\n      <img src="');
        __out.push(__sanitize(this.block.image.display));
        __out.push('" alt="');
        __out.push(__sanitize(this.block.title));
        __out.push('" />\n    </a>\n  ');
      } else if (this.block.block_type === 'Link') {
        __out.push('\n    <!-- LINK -->\n    ');
        if (this.block.image_display) {
          __out.push('\n      <a href="');
          __out.push(__sanitize(this.block.link_url));
          __out.push('" class="external" target="_blank">\n        <img src="');
          __out.push(__sanitize(this.block.image.display));
          __out.push('" alt="');
          __out.push(__sanitize(this.block.title));
          __out.push('" />\n      </a>\n    ');
        } else {
          __out.push('\n      <p>\n        <a href="');
          __out.push(__sanitize(this.block.link_url));
          __out.push('" class="external url" target="_blank">');
          __out.push(__sanitize(this.block.link_url));
          __out.push('</a>\n      </p>\n    ');
        }
        __out.push('\n  ');
      } else if (this.block.block_type === 'Text') {
        __out.push('\n    <!-- TEXT -->\n    <div class="content">\n      ');
        __out.push(this.block.content);
        __out.push('\n    </div>\n  ');
      } else if (this.block.block_type === 'Channel') {
        __out.push('\n    <!-- CHANNEL -->\n      <a href="#/');
        __out.push(__sanitize(this.block.slug));
        __out.push('">');
        __out.push(this.block.title);
        __out.push('</a>\n  ');
      }
    
      __out.push('\n</article>\n\n<aside>\n  <!-- METADATA -->\n  ');
    
      if (this.block.title != null) {
        __out.push('\n    <h4><a href="#/');
        __out.push(__sanitize(this.channel.slug));
        __out.push('/show:');
        __out.push(__sanitize(this.block.id));
        __out.push('">');
        __out.push(this.block.title);
        __out.push('</a></h4>\n  ');
      }
    
      __out.push('\n  ');
    
      if (!(this.block.block_type === 'Text' || !this.block.description)) {
        __out.push('\n    <div class="description">\n      ');
        __out.push(this.block.description);
        __out.push('\n    </div>\n  ');
      }
    
      __out.push('\n\n  ');
    
      if (this.block.block_type === 'Link') {
        __out.push('\n    <p>\n      <a href="');
        __out.push(__sanitize(this.block.link_url));
        __out.push('" class="external url" target="_blank">');
        __out.push(__sanitize(this.block.link_url));
        __out.push('</a>\n    </p>\n  ');
      }
    
      __out.push('\n\n  <!-- CONNECTIONS -->\n  <div class="connections">\n    ');
    
      if (this.block.connections.length > 1) {
        __out.push('\n      <h4>Also used in</h4>\n      <ul>\n      ');
        _ref = this.block.connections;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          connection = _ref[_i];
          __out.push('\n        ');
          if (connection.channel_id !== this.channel.id && connection.channel.published !== false) {
            __out.push('\n          <li><a href="#/');
            __out.push(__sanitize(connection.channel.slug));
            __out.push('">');
            __out.push(__sanitize(connection.connection_title));
            __out.push('</a></li>\n        ');
          }
          __out.push('\n      ');
        }
        __out.push('\n      <ul>\n    ');
      }
    
      __out.push('\n  </div>\n</aside>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/front": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('meow');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
