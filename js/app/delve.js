/// <reference path="Rooms.ts" />
/// <reference path="player.ts" />
/// <reference path="Parser.ts" />
/// <reference path="Utils.ts" />
/// <reference path="Modal.ts" />
/// <reference path="DelveMap.ts" />

var Engine = (function () {
    function Engine(o) {
        this._mappings = {
            '0001': 'haunted_mansion'
        };
        this._version = '0.0.1';
        var t = this._mappings[o.world || '0001'];
        this._player = new Player();

        // this._modal = new Modal();
        this._roomManager = new Rooms(this, t);
        this._map = new DelveMap();
        this._parser = new Parser(this);
        this._player.dumpStats();

        this.registerEvents();

        new Modal({ title: 'Welcome to Delve!', msg: 'Welcome, be with you shortly...' });
    }
    // Private Methods
    Engine.prototype.registerEvents = function () {
        var that = this;
        $('#command').on('keypress', function (e) {
            if (e.which === 13) {
                var val = $(this).val();
                $(this).val('> ');
                that._parser.execute(val);
            }
        });
        $('#command').on('focus', function () {
            $(this).val('> ');
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

    Engine.prototype.displayHelp = function () {
    };
    return Engine;
})();
