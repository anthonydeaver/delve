var Room = (function () {
    function Room(config) {
        this._exits = [];
        this._links = {};
        this._start = false;
        this._position = {};
        this._name = config.name;
        this._id = config.id;
        this._desc = config.desc;
        this._exits = config.exits;
        this._links = config.links;
        this._hasMonster = config.hasMonster;
        this._hasItem = config.hasItem;
        this._start = config.start;
    }
    
    Room.prototype.get = function (prop) {
        var id = '_' + prop;
        if (this[id])
            return this[id];
        return false;
    };
    Room.prototype.hasExit = function (exit) {
        for (var i = 0; i < this._exits.length; i++) {
            if (this._exits[i] === exit) {
                return true;
            }
        }
        return false;
    };
    Room.prototype.render = function () {
        $('#map span[type="room"]').removeClass('current');
        $('#exits ul').html('');
        $('[data-dir]').each(function () {
            $(this).removeClass();
            $(this).addClass('disabled');
        });
        $('#display header').html(this._name);
        $('#display #desc').html(this._desc);
        for (var x = 0; x < this._exits.length; x++) {
            var name = this._exits[x];
            if (this._links[name]) {
                name += " <span>(" + this._links[name].name + ")</span>";
            }
            $('#exits ul').append($('<li />').html(name));
        }
        $('#map span[type="room"]#' + this._id).addClass('current');
    };
    Room.prototype.rotateExits = function (rm) {
        for (var i = 0; i < this._exits.length; i++) {
            switch (this._exits[i]) {
                case 'north':
                    this._exits[i] = 'east';
                    break;
                case 'east':
                    this._exits[i] = 'south';
                    break;
                case 'south':
                    this._exits[i] = 'west';
                    break;
                case 'west':
                    this._exits[i] = 'north';
                    break;
            }
        }
    };
    return Room;
})();
