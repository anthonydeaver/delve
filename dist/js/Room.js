// Adds the 'Room' component to the Engine.
// Could be part of the engine core (and may be one day) but .... meh.
(function () {
    var Room = Backbone.View.extend({
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
})();
