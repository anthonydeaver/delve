var DelveMap = (function () {
    function DelveMap() {
        this._map = $('#map article div');
        this.registerEvents();
    }
    DelveMap.prototype.registerEvents = function () {
        $event.emit('log', 'registering map events');
        var toggle = function () {
            $('#map').toggle();
            $(this).html($('#map').is(':visible') ? 'Close Map' : 'Open Map');
        };

        $event.bind('togglemap', toggle);
        $('#BTN_MAP_TOGGLE').on('click', toggle);
    };
    DelveMap.prototype.setStartPoint = function (rm) {
        var xPos = 1080;
        var yPos = 1500;
        var sp = $('<span />').attr('id', rm.id).html(rm.name).css('top', yPos + 'px').css('left', xPos + 'px');
        $(this._map).append(sp);
        this.addExits(yPos, xPos, rm);
    };
    DelveMap.prototype.addRoom = function (rm, direction, target) {
        var t = $('#' + target);
        var txt;
        var xPos = parseInt($(t).css('left'), 10);
        var yPos = parseInt($(t).css('top'), 10);
        console.log('target: ', yPos);
        switch (direction) {
            case 'north':
                yPos -= 40;
                break;
            case 'east':
                xPos += 120;
                break;
            case 'south':
                yPos += 40;
                break;
            case 'west':
                xPos -= 120;
                break;
        }
        var name = (rm.name.length > 8) ? this.shorten(rm.name) : rm.name;
        var sp = $('<span />').attr('id', rm.id).html(name).css('top', yPos + 'px').css('left', xPos + 'px');
        $(this._map).append(sp);

        // Add in the direction markers
        this.addExits(yPos, xPos, rm);
    };

    DelveMap.prototype.addExits = function (yPos, xPos, rm) {
        var txt;
        for (var x = 0; x < rm.exits.length; x++) {
            var top = yPos, left = xPos;
            var marker = $('<span />').addClass('direction ' + rm.exits[x]).css('border', 'none');
            if (rm.exits[x] === 'north') {
                top = yPos - 20;
                txt = '|';
            }
            if (rm.exits[x] === 'south') {
                top = yPos + 20;
                txt = '|';
            }
            marker.css('top', top);
            if (rm.exits[x] === 'west') {
                left = xPos - 59;
                txt = '&mdash;';
            }
            if (rm.exits[x] === 'east') {
                left = xPos + 61;
                txt = '&mdash;';
            }
            marker.css('left', left);
            marker.html(txt);
            $(this._map).append(marker);
        }

        // Atempt to keep the current location centered in the map
        // $(this._map)[0].scrollTop = $(this._map)[0].scrollheight;
        var w = $('#map article').width();
        var h = $('#map article').height();
        console.log('scrollLeft: ', (xPos - 50) - (w / 2));
        console.log('scrollTop: ', (yPos) - (h / 2));
        $('#map article')[0].scrollLeft = (xPos + 50) - (w / 2);
        $('#map article')[0].scrollTop = (yPos) - (h / 2);
    };

    DelveMap.prototype.shorten = function (name) {
        var arr = name.split(' ');
        var ret = arr[0][0] + '.' + arr[1];
        return ret;
    };
    return DelveMap;
})();
;var Events = (function () {
    function Events() {
        this._callbacks = {};
    }
    Events.prototype.bind = function (name, callback, context) {
        if (!this._callbacks[name]) {
            this._callbacks[name] = [];
        }

        // this._callbacks[name].push({'cb':callback, context:context});
        this._callbacks[name].push(callback);
    };

    Events.prototype.unbind = function (name, callback) {
        for (var i = 0; i < this._callbacks[name]; i++) {
            if (this._callbacks[name][i] == callback) {
                this._callbacks[name].splice(i, 1);
                return;
            }
        }
    };

    Events.prototype.emit = function (name, args) {
        if (this._callbacks[name]) {
            for (var i = 0; i < this._callbacks[name].length; i++) {
                this._callbacks[name][i](args);
            }
        }
    };
    return Events;
})();
;var Modal = (function () {
    function Modal(obj) {
        this._modalPanel = $('<div>').attr('id', 'modal').addClass('eventPanel').css('opacity', '0');
        this.container = $('<div />').addClass('modal');
        this.title = $('<h3 />');
        this.msg = $('<div />');
        this.close = $('<button />').html('Close');
        this.closeModal = function () {
            console.log('closing');

            // _modalPanel = _modalPanel;
            this._modalPanel.animate({ opacity: 0 }, 200, 'linear');
            this._modalPanel.remove();
            // _modalPanel = null;
        };
        this.button = function (button) {
            var func = function () {
                console.log("click");
            };

            if (typeof (button.click) != 'undefined') {
                func = button.click;
            }

            var btn = $('<div>').attr('id', typeof (button.id) != 'undefined' ? button.id : "BTN_1234").addClass('button').text(typeof (button.label) != 'undefined' ? button.label : "button").click(function () {
                $(this).data("handler")($(this));
            }).data("handler", func);

            if (button.options) {
                var ops = button.options;
                for (var id in ops) {
                    btn.data(id, ops[id]);
                }
            }
            return btn;
        };
        var that = this;

        $('<div>').addClass('title').appendTo(this._modalPanel);
        $('<div>').attr('id', 'message').appendTo(this._modalPanel);
        $('<div>').attr('id', 'buttons').appendTo(this._modalPanel);

        var title = $('.title', this._modalPanel), desc = $('#message', this._modalPanel), btns = $('#buttons', this._modalPanel), buttons, i;

        console.log('title: ', title);

        $('<h2>').text(obj.title).appendTo(title);
        $('<p>').attr('id', 'banner').html(obj.msg).appendTo(desc);

        this._modalPanel.animate({ opacity: 1 }, 200, 'linear');

        if (obj.buttons) {
            buttons = obj.buttons;
            for (i in buttons) {
                if (buttons.hasOwnProperty(i)) {
                    this.button(buttons[i]).appendTo(btns);
                }
            }
        } else {
            this.button({ label: 'OK', click: function () {
                    console.log('close');
                    that.closeModal();
                } }).appendTo(btns);
        }

        // $(this.title).html(obj.title);
        // $(this.msg).html(obj.msg);
        // $(this.container).append(this.title).append(this.msg).append(this.close);
        $('body').append(this._modalPanel);

        this.registerEvents();
        /*
        <div id="help" class="modal" style="
        width: 300px;
        height: auto;
        border:  1px solid black;
        position: absolute;
        top: 100px;
        left: 269px;
        background-color: white;
        padding: 10px;
        ">
        Commands:<br>
        <ul>
        <li>Go [direction]</li>
        <li>help</li>
        </ul>
        </div>
        */
    }
    Modal.prototype.registerEvents = function () {
        var modal = $('.modal');
        $('.modal button').on('click', function () {
            $(modal).remove();
        });
    };
    return Modal;
})();
;/// <reference path="Utils.ts" />
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
;/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />
/// <reference path="DelveMap.ts" />
var Rooms = (function () {
    function Rooms(locale) {
        var _this = this;
        this._rooms = [];
        this._activeRoom = null;
        this._currentpositionSet = [0, 0];
        this._mapGrid = [];
        this._gotoRoom = function (e) {
            _this.onDirectionSelected(e);
        };
        this._onDataDump = function (e) {
            _this.onDataDump();
        };
        this._map = new DelveMap();
        var that = this;
        var data1;
        $.getJSON('/environs/' + locale + '/rooms.json', function (data) {
            that._deck = data.rooms;

            // Find the starting point of the delve
            that.getStart();

            that.registerEvents();
        });
    }
    Rooms.prototype.onDataDump = function () {
        var len = this._mapGrid.length;
        console.log('+++++++++++++++++++++++++++++++++');
        console.log('Map Grid:');
        for (var i = 0; i < len; i++) {
            console.log('arr[' + i + ']: ', this._mapGrid[i].toString());
        }
        console.log('+++++++++++++++++++++++++++++++++');
    };

    Rooms.prototype.getStart = function () {
        var len = 0, offset = 0;
        for (var i in this._deck) {
            if (this._deck[i].start) {
                this._activeRoom = this._deck[i];

                // Remove the starting point from the room so
                // we never encounter it again.
                delete this._deck[i];
            } else {
                this._rooms.push(i);
            }
        }

        // In case I forgot to set an starting room.
        if (this._activeRoom === null) {
            var t = this._rooms.pop();
            this._activeRoom = this._deck[t];
            delete this._deck[t];
        }

        // add 1 to the length to accoount for the starting room.
        len = this._rooms.length + 1;
        offset = Math.floor(len / 2);
        this._mapGrid = this.generateGrid(len);
        console.log('');
        this._mapGrid[offset][offset] = this._activeRoom.id;

        this._rooms = Utils.shuffle(this._rooms);

        // insert into map
        this._map.setStartPoint(this._activeRoom);

        // Starting spot is always 0,0,0 per Sheldon Cooper (RE: removed time index. For now ;) )
        this._activeRoom.position = this._currentpositionSet;
        this.renderRoom(this._activeRoom);
    };

    // creates an x by x grid for the map where 'x' is the number of rooms/cards in the deck
    Rooms.prototype.generateGrid = function (size) {
        var arr = new Array(size);
        for (var x = 0; x < size; x++) {
            arr[x] = new Array(size);
        }

        return arr;
    };

    Rooms.prototype.getPolar = function (dir) {
        var polar = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };
        return polar[dir];
    };

    Rooms.prototype.onDirectionSelected = function (dot) {
        console.log('direction: ', dot);
        console.log('active room: ', this._activeRoom[dot]);

        // Make sure the active room has that exit available
        if (this._activeRoom.exits.indexOf(dot) === -1) {
            $event.emit('nojoy', "You can't go that way.");
            return;
        }
        var rm;

        //First, check the current room for active connections for the selected direction
        if (this._activeRoom.links[dot]) {
            // already have a connection
            this.renderRoom(this._activeRoom.links[dot]);
        } else {
            if (!this._rooms.length) {
                $event.emit('nojoy', 'That exit is sealed by some unknown force.');
            }
            rm = this.drawRoom(dot);
            if (!rm) {
                $event.emit('error', 'Failed to load new room!');
            }
            this._activeRoom.links[dot] = rm;
            console.log('links: ', rm);
            rm.links[this.getPolar(dot)] = this._activeRoom;

            /* draw on the map */
            this._map.addRoom(rm, dot, this._activeRoom.id);

            switch (dot) {
                case 'north':
                    this._currentpositionSet[1]++;
                    break;
                case 'south':
                    this._currentpositionSet[1]--;
                    break;
                case 'east':
                    this._currentpositionSet[0]++;
                    break;
                case 'west':
                    this._currentpositionSet[0]--;
                    break;
            }

            rm.position = this._currentpositionSet;

            this.renderRoom(rm);
        }
    };

    /*
    TODO:
    - update active room to have connections to the new room, vice-versa for new room.
    - trigger map update
    - possible fire a new room event and let the engine handle this?
    */
    Rooms.prototype.renderRoom = function (rm) {
        $('#exits ul').html('');
        $('[data-dir]').each(function () {
            $(this).removeClass();
            $(this).addClass('disabled');
        });
        $('#display header').html(rm.name);
        $('#display #desc').html(rm.desc);

        for (var x = 0; x < rm.exits.length; x++) {
            // $('[data-dir="' + rm.exits[x] + '"]').removeClass('disabled');
            $('#exits ul').append($('<li />').html(rm.exits[x]));
        }

        this._activeRoom = rm;
    };

    Rooms.prototype.checkExits = function (rm, e) {
        var entrance = this.getPolar(e);
        for (var x = 0; x < rm.exits.length; x++) {
            if (rm.exits[x] === entrance) {
                return true;
            }
        }
        return false;
    };

    /*
    This rotates the rooms exits clockwise. North becomes East, East becomes South, etc...
    */
    Rooms.prototype.rotateRoomExits = function (rm) {
        console.log('rotating');
        for (var i = 0; i < rm.exits.length; i++) {
            console.log('loop: ', rm.exits[i]);
            switch (rm.exits[i]) {
                case 'north':
                    rm.exits[i] = 'east';
                    break;
                case 'east':
                    rm.exits[i] = 'south';
                    break;
                case 'south':
                    rm.exits[i] = 'west';
                    break;
                case 'west':
                    rm.exits[i] = 'north';
                    break;
            }
        }
        return rm;
    };

    // Public Methods
    /*
    'draw' as in draw from a deck...
    
    - get room from top of 'deck'
    - if no matching entrance / exit, rotate
    - no match: Error. !! Should never happen !!
    */
    Rooms.prototype.drawRoom = function (e) {
        if (!this._rooms.length) {
            $event.emit('error', 'no more rooms');
        }
        var r = this._rooms.pop();
        var rm = this._deck[r];

        if (this.checkExits(rm, e)) {
            return rm;
        }
        var that = this;
        var cnt = 0;

        function memoizer(rm) {
            var recur = function (d) {
                rm = that.rotateRoomExits(rm);

                // var result = that.checkExits(rm, d);
                if (!that.checkExits(rm, d)) {
                    rm = recur(d);
                }
                return rm;
            };
            return recur;
        }

        var test = memoizer(rm);
        return test(e);
    };

    Rooms.prototype.registerEvents = function () {
        // var that = this;
        // $('#nav button').on('click', function(evt) {
        //     if($(this).hasClass('disabled')) {
        //         return;
        //     }
        //     var dot = $(this).data('dir'); // dot = 'direction of travel'
        //     that.onDirectionSelected(dot);
        // });
        $event.bind('gotoRoom', this._gotoRoom);
        $event.bind('dump', this._onDataDump);
    };
    return Rooms;
})();
;/// <reference path="Rooms.ts" />
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
                right: parseInt($nav.css('right'), 10) === 0 ? -325 : 0
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
        $('body').css('background', 'url(/environs/' + this._world + '/assets/background.jpg) no-repeat');
        $('body').css('background-size', 'cover');
    };
    return Engine;
})();
;var Player = (function () {
    function Player() {
        var _this = this;
        // Stats
        this._hp = 0;
        this._gold = 0;
        this._skills = [];
        this._treasure = [];
        this._onDumpStats = function (e) {
            return _this.dumpStats();
        };
        this._hp = 20;
        this._gold = 5;
        this._skills = [];
        this._treasure = [];

        this.registerEvents();
    }
    Player.prototype.getDirection = function () {
        return this._direction;
    };
    Player.prototype.dumpStats = function () {
        console.log('>>>>>>>');
        console.log('Player stats:');
        console.log('HP      : ', this._hp);
        console.log('GOLD    : ', this._gold);
        console.log('SKILLS  : ', this._skills);
        console.log('TREASURE: ', this._treasure);
        console.log('>>>>>>>');
    };

    Player.prototype.registerEvents = function () {
        $event.bind('dump', this._onDumpStats);
    };

    Player.prototype.move = function (d) {
        this._direction = d;
    };
    return Player;
})();
;// declare var $;
// declare var rooms;
var Utils = (function () {
    function Utils() {
        this.that = 'that';
        this.test = 'test';
        this.test2 = 'test2';
    }
    Utils.shuffle = function (o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
        return o;
    };
    Utils.loadFile = function (fn, callback) {
    };
    Utils.resetForm = function ($form) {
        $form.find('input:text, input:password, input:file, select, textarea').val('');
        $form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    };

    Utils.proURIDecoder = function (val) {
        val = val.replace(/\+/g, '%20');
        var str = val.split("%");
        var cval = str[0];
        for (var i = 1; i < str.length; i++) {
            cval += String.fromCharCode(parseInt(str[i].substring(0, 2), 16)) + str[i].substring(2);
        }

        return cval;
    };
    return Utils;
})();
