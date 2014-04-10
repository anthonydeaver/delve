/// <reference path="Rooms.ts" />
/// <reference path="player.ts" />
/// <reference path="Parser.ts" />
/// <reference path="Utils.ts" />
/// <reference path="DelveMap.ts" />

var Engine = (function () {
    function Engine(o) {
        this._mappings = {
            '0001': 'haunted_mansion'
        };
        this._version = '0.0.1';
        this._player = new Player();
        this._roomManager = new Rooms(this, o.world);
        this._map = new DelveMap();
        this._parser = new Parser(this);
        this._player.dumpStats();

        this.registerEvents();
    }
    // Private Methods
    Engine.prototype.registerEvents = function () {
        var that = this;
        $('#command').on('keypress', function (e) {
            if (e.which === 13) {
                var val = $(this).val();
                $(this).val('');
                that._parser.execute(val);
            }
        });
    };

    // Public Methods
    Engine.prototype.throwError = function (msg) {
        throw ('>>> Error: ', msg);
    };

    Engine.prototype.getRoomManager = function () {
        return this._roomManager;
    };

    Engine.prototype.getFile = function (filename) {
    };
    return Engine;
})();
