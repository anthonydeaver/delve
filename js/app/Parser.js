/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />

var Parser = (function () {
    function Parser(engine) {
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
                "{%s} isn't open.",
                "Try again, you can't go that way.",
                "Seriously, you have a map..."
            ],
            'look': [
                'Nothing special about the {%s}.'
            ]
        };
        this._engine = engine;
        this._console = $('#console');
    }
    // Private methods
    Parser.prototype.declareCantDo = function (cmd, args) {
        this.cantDo[cmd] = Utils.shuffle(this.cantDo[cmd]);
        var str = this.cantDo.go[0].replace(/{%s}/g, args);
        var txt = $(this._console).val();
        txt += '\r' + str;
        $(this._console).val(txt);
    };
    Parser.prototype.declareNoJoy = function () {
        this.nojoy = Utils.shuffle(this.nojoy);

        //var txt = $(this._console).val();
        // txt += '\r' + this.nojoy[0];
        // var txt = '>>> ' + this.nojoy[0];
        // $(this._console).html(txt);
        $event.emit('error', this.nojoy[0]);
        //		this._engine.throwError(this.nojoy[0]);
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
        var validDirections = ['north', 'south', 'east', 'west'];
        var dot = args[0];
        if (validDirections.indexOf(dot) === -1) {
            this.declareCantDo(cmd, dot);
        } else {
            $event.emit('gotoRoom', dot);
        }
    };
    Parser.prototype.execute = function (val) {
        $event.emit('log', 'parsing command');
        var args = val.split(' ');
        args.shift(); // removes the > character
        this._commandBuffer.push(args.join(' '));
        var cmd = args.shift().toLowerCase();

        switch (cmd) {
            case 'go':
                this.handleGoCommand(args, cmd);
                break;
            case 'help':
                $event.emit('displayHelp');
                break;
            case 'dump':
                console.log('####################');
                console.log('Command Buffer:');
                console.log(this._commandBuffer);
                console.log('####################');
                $event.emit('dump');
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
