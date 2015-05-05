var Engine = {};

(function (win, factory) {
  'use strict';
  win.Engine = factory(win, {});
}(this, function (root, Engine) {
  'use strict';
  Engine.VERSION = '0.0.5';
  var _handlers = [];
  var checkHandlers = function(target, event, namespace) {
      for(var i = 0; i < _handlers.length; i++) {
          var handler = _handlers[i];
          if (namespace === handler.namespace) {
              handler.handler(target, event);
          }
      }
  };
  var blender = function (undef) {
    return function (obj) {
      var len = arguments.length;
      for (var i = 1; i < len; i++) {
        var source = arguments[i];
        var keys = Object.keys(source),
            len2 = keys.length;
        for (var x = 0; x < len2; x++) {
          var key = keys[x];
          if(!undef || obj[key] === undefined) {
            obj[key] = source[key];
          }
        }
      }
      return obj;
    }
  }
  var eventSplitter = /^(\w+)\s*(.*)$/;
  var clone = blender();
  var merge = blender(true);
  var _extend = blender();
  Engine.extend = _extend;
  var bind = function (method, context) {
    return (function () {
      return method.apply(context, arguments);
    })
  };
  var generateID = function (){
    return 'xxxxxxxxxxxx4xxx'.replace(/[xy]/g, function (c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
  };

  /**
    *
    * Engine Events
    *
    **/
  var Events = Engine.Events = {
    _callbacks: {},
    on: function (ev, callback, context) {
      var evs   = ev.split(" ");
      var calls = this._callbacks || (this._callbacks = {});
      for (var i=0; i < evs.length; i++)
        (this._callbacks[evs[i]] || (this._callbacks[evs[i]] = [])).push({callback: callback, context: context});
      return this;
    },
    once: function(name, callback, context) {
      var self = this;
      var once = (function() {
        this.off(name, once);
        callback.apply(context, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },
    off: function(name, callback,context) {
      var events, i, save, ev;
        events = this._callbacks[name];
      if(events = this._callbacks[name]) {
        this._callbacks[name] = save = [];
        if(callback || context) {
          for(i = 0; i < events.length; i++) {
            ev = events[i];
            if((callback && callback !== ev.callback) || (context && context !== ev.context)) {
              save.push(ev);
            }
          }
        }
        if(!save.length) delete this._callbacks[name];
      }
    },
    trigger: function () {
      var args = Array.prototype.slice.call(arguments);
      var ev   = args.shift();
      var list, calls, i, l;
      if (!(calls = this._callbacks)) return this;
      if (!(list  = this._callbacks[ev])) return this;
      for (i = 0, l = list.length; i < l; i++) {
        if (list[i].callback.apply(list[i].context, args) === false)
          return false;
      }
      return this;
    }
  };
  
  _extend(Engine, Events);

  /**
    *
    * Engine Controller
    *
    **/
  var Controller = Engine.Controller = function (model) {
    this.uid = generateID();
    this.model = model;
    this.initialize.apply(this, arguments);
  };

  _extend(Controller.prototype, Events, {
    model: {},
    initialize: function () {},
  });


  /**
    *
    * Engine Model
    *
    *
  var Model = Engine.Model = function (attributes) {
    var attrs = attributes || {};
    this.uid = generateID();
    attrs = merge({}, attrs, (this.defaults || {}));
    this.set(attrs, {silent: true});
    this.changed = {};
    this.initialize.apply(this, arguments);
  };
  
  _extend(Model.prototype, Events, {
    initialize: function () {},
    set: function (key, val, options) {
      var attr, attrs, current,
          changed = [],
          unset,
          silent;
      if (key === null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = (options || {});
      current = this.attributes;
      unset = options.unset;
      silent = options.silent;

      this.changed = {};

      for (var entry in attrs) {
        val = attrs[entry];
        if(current[entry] !== val) {
          changed.push(entry);
          this.changed[entry] = val;
        }
        unset ? delete current[attr] : current[entry] = val;
      }

      if(!silent) {
        for (var i = 0; i < changed.length; i++) {
          this.trigger('change::' + changed[i]);
        }
      }

      if(!silent) this.trigger('change');
    },
    get: function(key) {
      if (this.attributes[key]) return this.attributes[key];
      else if (this[key]) return this[key];
      else return null;
    },
    has: function(attr) {
      return this.get(attr) != null;
    },
    hasChanged: function(attr) {
      if(attr == null) return (Object.keys(this.changed).length > 0);
      return  this._has(this.changed, attr);
    },
    unset: function (key) {
      this.set(key, null, {unset: true});
    },

    clear: function () {
      this.attributes = {};
    },

    toJSON: function () {
      return clone({}, this.attributes);
    },
    _has: function(obj, key) {
      return obj != null && hasOwnProperty.call(obj, key);
    }
  });
*/
  /**
    *
    * Engine View
    *
    **/
  var UI = Engine.UI = function (options) {
    this.uid = generateID();
    options = options || {};
    this.validateElement();

    this.initialize.apply(this, arguments);
    this.delegateEvents();
  }

  _extend(UI.prototype, Events, {
    tagName: 'div',
    render: function () {},
    $: function(selector) {
      return this.$el.querySelectorAll(selector);
    },
    validateElement: function() {
      if(!this.el) {
        this._el = this.tagname;
        var attrs = _extend({}, this.attributes);
        if (this.id) attrs.id = this.id;
        if (this.class) attrs.class = this.class;
        var $el = document.createElement(this.tagName);
        for (var name in attrs) {
            $el.setAttribute(name, attrs[name]);
        }
        this.setElement($el, false);
      } else {
        this._el = this.el;
        this.setElement(this.el, false);
      }
    },
    setElement: function(ele, reset) {
      if (this.$el) this.undelegateEvents();
      if (typeof ele === 'string') {
        this.$el = document.querySelectorAll(ele);
        this.el = this.$el[0];
      } else {
        this.el = this.$el = ele;
      }
      this.el.bind = function (evt,callback) {
        this.addEventListener(evt, callback);
      }
      this.el.on = function(evt, sel, fn) {
        var tmp = evt.split('.');
        var type = tmp[0];
        var namespace = tmp[1];
        
        if (fn == null) {
            fn = sel;
        }
        
        var handleObj = {
            type: type,
            namespace: namespace,
            guid: guid++,
            selector: sel,
            handler: fn
        };

        
        _handlers.push(handleObj);

        var parent = this;
        this.setAttribute('data-wxNamespace', namespace);
        this.addEventListener(type, function(e) {
            for (var target=e.target; target && target!=this; target=target.parentNode) {
              // loop parent nodes from the target to the delegation node
                if (target.matches(sel)) {
                    var ns = parent.getAttribute('data-wxnamespace');
                    if(namespace === ns)
                      checkHandlers(target, e, ns)
                    break;
                }
              }
        }, false);
      };
      this.el.off = function(evt) {
        for(var i = 0; i < _handlers.length; i++) {
          var handler = _handlers[i];
          if( handler.namespace === evt) {
            _handlers.splice(i, 1);
            return true;
          }
        }
        return false;
      }
      if (reset !== false) {
        this.delegateEvents();
      }
      return this;
    },
    delegateEvents: function () {
      var events = this.events;
      for (var key in events) {
        var method = events[key];
        if(typeof method !== 'function')  { method = this[events[key]]; }
        if (!method) continue;

        var match = key.match(eventSplitter);
        var eventName = match[1], selector = match[2];
        method = bind(method, this);
        eventName += '.delegateEvents' + this.uid;
        if (selector === '') {
          this.el.bind(eventName, method);
        } else {
          this.el.on(eventName, selector, method);
        }
      }
    },
    undelegateEvents: function() {
      this.el.off('delegateEvents' + this.model.get('uid'));
      return this;
    },
  })
  
  var Room = Engine.Room = function Room (config) {
    this.position = {};
    this.attributes = {};

    this.set(config);
  }

  _extend(Room.prototype,{
  set: function (key, val, options) {
    var attr, attrs, current;
    if (key === null) return this;

    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (typeof key === 'object') {
      attrs = key;
      options = val;
    } else {
      (attrs = {})[key] = val;
    }
      current = this.attributes;

      for (var entry in attrs) {
        current[entry] = attrs[entry];
      }
    },

    get: function (prop) {
        if(this.attributes[prop]) return this.attributes[prop];
        return false
    },

    hasExit: function (exit) {
      var exits = this.get('exits');
      console.log('exits:', exits);
        for ( var i = 0; i < exits.length; i++) {
            if(exits[i] === exit) { return true; }
        }
        return false;
    },
    
    render: function () {
        $('#map span[type="room"]').removeClass('current');
        $('#exits ul').html('');
        $('[data-dir]').each(function(){
            $(this).removeClass();
            $(this).addClass('disabled');
        });
        $('#display header').html(this.get('name'));
        $('#display #desc').html(this.get('desc'));

      var exits = this.get('exits');
        for (var x = 0; x < exits.length; x++ ) {
            var name = exits[x];
            if(this.links[name]) {
                name += " <span>(" + this.links[name].name + ")</span>";
            }
            $('#exits ul').append($('<li />').html(name));
        }

        $('#map span[type="room"]#' + this.id).addClass('current');
    },

    rotateExits: function (rm) {
      var exits = this.get('exits');
        for (var i = 0; i < exits.length; i++ ) {
            switch(exits[i]) {
                case 'north':
                    exits[i] = 'east';
                    break;
                case 'east':
                    exits[i] = 'south';
                    break;
                case 'south':
                    exits[i] = 'west';
                    break;
                case 'west':
                    exits[i] = 'north';
                    break;
            }
        }
    }        
  })


  /**
   *
   * Utility Functions
   * 
   */
  Engine.has = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  Engine.isString = function(obj) {
    return typeof obj === "string";
  };

  Engine.isNumber = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
  };

  Engine.isFunction = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  };

  Engine.isObject = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  Engine.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  Engine.normalizeArray = function(arg) {
    if(Engine.isString(arg)) {
      arg = arg.replace(/\s+/g,'').split(",");
    }
    if(!Engine.isArray(arg)) {
      arg = [ arg ];
    }
    return arg;
  };

  var guid = 0;
  Engine.uniqueId = function() {
    return guid++;
  };

  Engine.shuffle = function (o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
    return o;
  }

  /**
   * 
   * Helpers
   * 
   */
  var extend = function (proto, staticProps) {
    var parent = this;
    var child;
    
    child = function () { return parent.apply(this, arguments); }
    
    if(staticProps) _extend(child, parent, staticProps) ;
    
    var Ctor = function () { this.constructor = child; };
    Ctor.prototype = parent.prototype;
    child.prototype = new Ctor;
    
    if(proto) _extend(child.prototype, proto);
    
    return child;
  }
  
  /*Model.extend = */UI.extend = Controller.extend = Room.extend = extend;
  
  return Engine;
  
}));

