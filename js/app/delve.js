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
        this._log = function (m) {
            return _this.onLog(m);
        };
        this.onLog('this is a test');

        // this._world = this._mappings[o.world || '0001'];
        // this._player = new Player();
        // this._parser = new Parser(this);
        // this._roomManager = new Rooms(this, this._world);
        this._world = this._mappings[o.world || '0001'];
        new Player();
        this._parser = new Parser(this);
        new Rooms(this._world);

        this.registerEvents();

        this.setupUI();
        // new Modal({title: 'Welcome to Delve!', msg: 'Welcome, be with you shortly...'});
    }
    // Private Methods
    Engine.prototype.registerEvents = function () {
        var that = this;
        $event.bind('error', this.throwError);
        $event.bind('log', this._log);
        $event.bind('displayHelp', this._onShowHelp);
        $('#command input').on('keypress', function (e) {
            if (e.which === 13) {
                var val = $(this).val();
                $(this).val('');
                that._parser.execute(val);
            }
        });
        $('#command input').on('focus', function () {
            $(this).val('');
        });

        $('#temp').on('click', this._onShowHelp);
        $('#nav header').on('click', function () {
            var $nav = $(this).parent();
            $nav.animate({
                right: parseInt($nav.css('right'), 10) == 0 ? -325 : 0
            });
        });
    };
    Engine.prototype.onLog = function (msg) {
        console.log('msg:: ', msg);
        var val = $('feedback').val();
        console.log('val: ', val);
        val = val + '\r' + msg;
        // $('#feedback').val(val);
        // $('#feedback').scrollTop($('#feedback')[0].scrollHeight);
    };

    Engine.prototype.onShowHelp = function (e) {
        console.log('showing help');
        new Modal({
            title: 'Delve Help', msg: "" + "It's simple really, you just enter commands into the command bar (the black bar at the bottom of the screen) and things happen." + "Currently there are # supported commands:<br />" + "<ul>" + "<li><i>GO</i> {direction} - where direction is any of the exits listed for the current room (north, south, etc...)</li>" + "<li><i>HELP</i> (obviously)</li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "</ul>"
        });
    };

    // Public Methods
    Engine.prototype.throwError = function (msg) {
        var txt = '>>> ' + msg;

        throw ('>>> Error: ', msg);
    };

    Engine.prototype.getRoomManager = function () {
        return this._roomManager;
    };

    Engine.prototype.getFile = function (filename) {
    };

    Engine.prototype.setupUI = function () {
        $('body').css('background', 'url(/' + this._world + '/assets/background.jpg) no-repeat');
        $('body').css('background-size', 'cover');
    };
    return Engine;
})();
