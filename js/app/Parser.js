/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />

var Parser = (function () {
    function Parser(engine) {
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
        var txt = $(this._console).val();
        txt += '\r' + this.nojoy[0];
        $(this._console).val(txt);
    };

    Parser.prototype.displayHelp = function () {
    };

    Parser.prototype.processGo = function (args, cmd) {
        var validDirections = ['north', 'south', 'east', 'west'];
        var dot = args[0];
        if (validDirections.indexOf(dot) === -1) {
            //this.declareNoGo(dot);
            this.declareCantDo(cmd, dot);
        } else {
            this._engine.getRoomManager().go(dot);
        }
    };
    Parser.prototype.execute = function (val) {
        var args = val.split(' ');
        args.shift(); // removes the > character
        var cmd = args.shift().toLowerCase();
        console.log('cmd: ', cmd);
        if (this._commands.indexOf(cmd) === -1) {
            this.declareNoJoy();
            return;
        }
        switch (cmd) {
            case 'go':
                this.processGo(args, cmd);
                break;
            case 'help':
                this.displayHelp();
                break;
        }
    };
    return Parser;
})();
