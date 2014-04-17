/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />

var Parser = (function () {
    function Parser(engine) {
        var _this = this;
        this._commandBuffer = [];
        this._commands = ['go', 'look', 'examine', 'take', 'use', 'help'];
        this.nojoy = [
            "I have no idea what your are asking.",
            "What'chu talking 'bout Willis?",
            "What we have here is, a failure to communicate.",
            "The cake is a lie. "
        ];
        this.cantDo = {
            'go': [
                "You can't go in that direction",
                "That's impossible.",
                "'{%s}'' isn't a valid exit.",
                "Try again, you can't go that way.",
                "Seriously, you have a map..."
            ],
            'look': [
                'Nothing special about the {%s}.'
            ]
        };
        this._onDataDump = function () {
            _this.onDataDump();
        };
        this._engine = engine;
        this.registerEvents();
    }
    // Private methods
    Parser.prototype.declareCantDo = function (cmd, args) {
        var arr = Utils.shuffle(this.cantDo[cmd]);
        var str = arr[0].replace(/{%s}/g, args);
        this.updateConsole(str);
    };
    Parser.prototype.declareNoJoy = function () {
        this.nojoy = Utils.shuffle(this.nojoy);
        this.updateConsole(this.nojoy[0]);
    };

    Parser.prototype.updateConsole = function (msg) {
        var _console = $('#feedback');
        $(_console).append('<br /><span>' + msg + '</span>');
        $(_console)[0].scrollTop = $(_console)[0].scrollHeight;
    };

    Parser.prototype.handleShowCommand = function (args) {
    };

    Parser.prototype.handleToggleCommand = function (args) {
        var objects = ['map', 'controls', 'help'];
        var toggle = args[0];
        console.log('toggle: ', toggle);
        if (objects.indexOf(toggle) === -1) {
            this.declareNoJoy();
        } else {
            $event.emit('toggle' + toggle, args);
        }
    };

    Parser.prototype.handleGoCommand = function (args, cmd) {
        var validDirections = ['north', 'south', 'east', 'west', 'up', 'down'];
        if (!args.length) {
            this.updateConsole('Where would you like to go?');
            return;
        }
        var dot = args[0];
        if (validDirections.indexOf(dot) === -1) {
            this.declareCantDo(cmd, dot);
        } else {
            console.log('going: ', dot);
            $event.emit('gotoRoom', dot);
        }
    };

    Parser.prototype.onDataDump = function () {
        console.log('####################');
        console.log('Command Buffer:');
        console.log(this._commandBuffer);
        console.log('####################');
    };

    Parser.prototype.registerEvents = function () {
        $event.bind('nojoy', this.updateConsole);
        $event.bind('dump', this._onDataDump);
    };

    Parser.prototype.execute = function (val) {
        $event.emit('log', 'parsing command');
        this._commandBuffer.push(val);
        var args = val.split(' ');
        var cmd = args.shift().toLowerCase();
        switch (cmd) {
            case 'go':
                this.handleGoCommand(args, cmd);
                break;
            case 'help':
                $event.emit('displayHelp');
                break;
            case 'show':
                this.handleShowCommand(args);
                break;
            case 'toggle':
                this.handleToggleCommand(args);
                break;
            default:
                this.declareNoJoy();
                break;
        }
    };
    return Parser;
})();
