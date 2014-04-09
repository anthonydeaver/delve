/// <reference path="Rooms.ts" />
/// <reference path="player.ts" />
/// <reference path="Utils.ts" />
/// <reference path="DelveMap.ts" />

var Engine = (function () {
    function Engine() {
        this._version = '0.0.1';
        this._player = new Player();
        this._roomManager = new Rooms(this);
        this._map = new DelveMap();
        this._player.dumpStats();

        this.registerEvents();
    }
    // Private Methods
    Engine.prototype.registerEvents = function () {
    };

    // Public Methods
    Engine.prototype.throwError = function (msg) {
        throw ('>>> Error: ', msg);
    };

    Engine.prototype.getFile = function (filename) {
    };
    return Engine;
})();
