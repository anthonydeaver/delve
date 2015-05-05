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
          this.uid = E.uniqueId();
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
  
  return E

}))
