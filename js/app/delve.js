/// <reference path="Rooms.ts" />
/// <reference path="player.ts" />
/// <reference path="Parser.ts" />
/// <reference path="Utils.ts" />
/// <reference path="Modal.ts" />
/// <reference path="DelveMap.ts" />

var Engine = (function () {
    function Engine(o) {
        var _this = this;
        this._mappings = {
            '0001': 'haunted_mansion'
        };
        this._version = '0.0.1';
        this._onShowHelp = function (e) {
            return _this.onShowHelp(e);
        };
        var t = this._mappings[o.world || '0001'];
        this._player = new Player();
        this._roomManager = new Rooms(this, t);
        this._map = new DelveMap();
        this._parser = new Parser(this);
        this._player.dumpStats();

        this.registerEvents();
        // new Modal({title: 'Welcome to Delve!', msg: 'Welcome, be with you shortly...'});
    }
    // Private Methods
    Engine.prototype.registerEvents = function () {
        var that = this;
        $event.bind('displayHelp', this._onShowHelp);
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

        // temp
        $('#temp').on('click', this._onShowHelp);
    };

    Engine.prototype.onShowHelp = function (e) {
        console.log('showing help');
        new Modal({
            title: 'Delve Help', msg: "" + "It's simple really, you just enter commands into the command bar (the black bar at the bottom of the screen) and things happen." + "Currently there are # supported commands:<br />" + "<ul>" + "<li><i>GO</i> {direction} - where direction is any of the exits listed for the current room (north, south, etc...)</li>" + "<li><i>HELP</i> (obviously)</li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "</ul>"
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
