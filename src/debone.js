var DeBone = {};

(function (win, factory) {
  'use strict';
  win.DeBone = factory(win, {});
}(this, function (root, DeBone) {
  'use strict';
  DeBone.VERSION = '0.0.2';
  var guid = 0;
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
  DeBone.extend = _extend;
  var bind = function (method, context) {
    return (function () {
      return method.apply(context, arguments);
    })
  };
  var generateID = function (){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();
  };

  /**
    *
    * DeBone Events
    *
    **/
  var Events = DeBone.Events = {
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
  
  _extend(DeBone, Events);

  /**
    *
    * DeBone Controller
    *
    **/
  var Controller = DeBone.Controller = function (model) {
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
    * DeBone Model
    *
    **/
  var Model = DeBone.Model = function (attributes) {
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

  /**
    *
    * DeBone View
    *
    **/
  var View = DeBone.View = function (options) {
    this.uid = generateID();
    options = options || {};
    this.validateElement();

    this.initialize.apply(this, arguments);
    this.delegateEvents();
  }

  _extend(View.prototype, Events, {
    tagName: 'div',
    render: function () {},
    $: function(selector) {
      return this.$el.querySelectorAll(selector);
    },
    validateElement: function() {
      if(!this.el) {
        var attrs = _extend({}, this.attributes);
        if (this.id) attrs.id = this.id;
        if (this.class) attrs.class = this.class;
        var $el = document.createElement(this.tagName);
        for (var name in attrs) {
            $el.setAttribute(name, attrs[name]);
        }
        this.setElement($el, false);
      } else {
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
        eventName += '.delegateEvents' + this.model.get('uid');
        if (selector === '') {
          this.el.on(eventName, method);
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
  
  var _extend = function () {
    var o = arguments[0];
    for (var i=1; i<arguments.length; i++) {
      for (var key in arguments[i]) {
        if(arguments[i].hasOwnProperty(key)) {
          o[key] = arguments[i][key];
        }
      }
    }
  }


  /**
   *
   * Utility FUnctions
   * 
   */
  var Utils = function() {

  }

  _extend(Utils.prototype, {
    // Not sure this belongs here but what the hell...
    removeClass: function(el,className) {
      console.log('el: ', el);
      if (el.classList)
        el.classList.remove(className);
      else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    },
    addClass: function(el, className) {
      if (el.classList)
        el.classList.add(className);
      else
        el.className += ' ' + className;
    }
  })

  DeBone.Utils = new Utils();
  

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
  
  Model.extend = View.extend = Controller.extend = extend;
  
  return DeBone;
  
}));

