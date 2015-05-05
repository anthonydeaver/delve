(function (win, factory) {
  'use strict';
  win.Engine = factory(win, {});
}(this, function (root, Engine) {
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

  var _extend = blender();
  var _merge = blender(true);

  /**
    *
    * Engine Events
    *
    **/
  var Events = {
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

  var E = function () {};



  /**
   *
   * Utility Functions
   * 
   */
  E.has = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  E.isString = function(obj) {
    return typeof obj === "string";
  };

  E.isNumber = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
  };

  E.isFunction = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  };

  E.isObject = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  E.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  E.normalizeArray = function(arg) {
    if(Engine.isString(arg)) {
      arg = arg.replace(/\s+/g,'').split(",");
    }
    if(!Engine.isArray(arg)) {
      arg = [ arg ];
    }
    return arg;
  };

  var guid = 0;
  E.uniqueId = function() {
    return guid++;
  };

  E.shuffle = function (o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
    return o;
  }


  (function () {
    var initializing = false,
        fnTest = /xyz/.test(function(){ var xyz;}) ? /\b_super\b/ : /.*/;
    E.Class = function(){};

    E.Class.extend = function(className, prop, classMethods) {
      // Put in a check so that we can't accidentally over-write existing 'classes'
      if (E[className]) { return; }
      var _super = this.prototype;

      /* Instantiate a base class (but only create the instance, */
      /* don't run the init constructor) */
      initializing = true;
      var prototype = new this();
      initializing = false;

      // Copy the properties over onto the new prototype
      for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" &&
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (function(name, fn){
            return function() {
              var tmp = this._super;
             
              // Add a new ._super() method that is the same method
              // but on the super-class
              this._super = _super[name];
             
              // The method only need to be bound temporarily, so we
              // remove it when we're done executing
              var ret = fn.apply(this, arguments);        
              this._super = tmp;
             
              return ret;
            };
          })(name, prop[name]) :
          prop[name];
      }

      /* The dummy class constructor */
      function Class() {
        /* All construction is actually done in the initialize method */
        if ( !initializing && this.initialize ) {
          this.initialize.apply(this, arguments);
        }
      }

      /* Populate our constructed prototype object */
      Class.prototype = prototype;

      /* Enforce the constructor to be what we expect */
      Class.prototype.constructor = Class;
      /* And make this class extendable */
      Class.extend = E.Class.extend;

      /* If there are class-level Methods, add them to the class */
      if(classMethods) {
        _extend(Class,classMethods);
      }

      if(className) {
        /* Save the class onto the Engine */
        E[className] = Class;

        /* Let the class know its name */
        Class.prototype.className = className;
        Class.className = className;
      }

      return Class;
    }
  })();

  E.Class.extend('Controller', {
    model: {},
    initialize: function () {
      console.log('init');
      this.uid = E.uniqueId();
    },
    test: function() {
      console.log('hump: ', this.uid );

    }
  });

  E.Class.extend('View', {
    initialize: function() {
      console.log('funky');
      this.uid = E.uniqueId();
      _extend(this,Events);
    },
    test: function() {
      console.log('View: ', this.uid );
    },
    tagName: 'div',
    render: function () {},
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
    }    
  });

  E.Class.extend('Room', {
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

  });

  E.Class.extend('Construct', {
    name: '',
    initialize: function() { console.log('Construct init'); }
  })

  return E;
}));