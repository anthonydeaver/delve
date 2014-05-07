var DMap = (function () {
    function DMap() {
        var _this = this;
        this._level = 1;
        this._onGotoLevel = function (e) {
            _this.onGotoLevel(_this._level + 1);
        };
        this.onGotoLevel(this._level);
        this._map = $('#map article[level="1"] div');
        this.registerEvents();
    }
    DMap.prototype.registerEvents = function () {
        $event.emit('log', 'registering map events');
        var toggle = function () {
            $('#map').toggle();
            $(this).html($('#map').is(':visible') ? 'Close Map' : 'Open Map');
        };

        $event.bind('togglemap', toggle);
        $event.bind('gotoLevel', this._onGotoLevel);
        $('#BTN_MAP_TOGGLE').on('click', toggle);
    };

    DMap.prototype.onGotoLevel = function (lvl) {
        var g = $('#map article[level="' + lvl + '"] div');
        if (g.length == 0) {
            var map = $('#map');
            var art = $('<article />').attr('id', 'wrapper').attr('level', lvl);
            var cont = $('<div />');
            art.append(cont);
            $(map).append(art);
            g = $('#map article[level="' + lvl + '"] div');
        }
        this._map = g;
    };

    DMap.prototype.addRoom = function (rm, direction, target) {
        var t, xPos, yPos;
        var txt;
        if (target === null) {
            xPos = 1080;
            yPos = 1500;
        } else {
            t = $('#' + target);
            xPos = parseInt($(t).css('left'), 10);
            yPos = parseInt($(t).css('top'), 10);
        }
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
            default:
                break;
        }
        var name = (rm.name.length > 8) ? this.shorten(rm.name) : rm.name;
        var sp = $('<span />').attr('id', rm.id).attr('type', 'room').html(name).css('top', yPos + 'px').css('left', xPos + 'px');
        $(this._map).append(sp);

        this.addExits(yPos, xPos, rm);
    };

    DMap.prototype.addExits = function (yPos, xPos, rm) {
        var txt;
        for (var x = 0; x < rm.exits.length; x++) {
            var top = yPos, left = xPos;
            var marker = $('<span />').addClass(rm.exits[x]).attr('type', 'directional');
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
            if (rm.exits[x] === 'down') {
                top = yPos + 20;
                left = xPos - 59;
                txt = '/';
            }
            if (rm.exits[x] === 'up') {
                top = yPos - 20;
                left = xPos + 61;
                txt = '/';
            }
            marker.css('left', left);
            marker.css('top', top);
            marker.html(txt);
            $(this._map).append(marker);
        }

        $(this._map).css('top', -(yPos - 200));
        $(this._map).css('left', -(xPos - 200));
    };

    DMap.prototype.changeLevels = function (o, n) {
        $('#map article[level="' + o + '"]').fadeTo("slow", 0.1);
        $('#map article[level="' + n + '"]').fadeIn("slow");
    };

    DMap.prototype.shorten = function (name) {
        var arr = name.split(' ');
        var ret = arr[0][0] + '.' + arr[1];
        return ret;
    };
    return DMap;
})();
var Engine = (function () {
    function Engine(o) {
        var _this = this;
        this._mappings = {
            '0001': 'haunted_mansion'
        };
        this._version = '0.0.0.1';
        this._onShowHelp = function (e) {
            return _this.onShowHelp(e);
        };
        var world = this._mappings[o.world || '0001'];

        new Parser();
        new RoomManager('environs/' + world + '/rooms.json');

        this.injectUI(world);
    }
    Object.defineProperty(Engine.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });

    Engine.prototype.registerEvents = function () {
        $event.bind('error', this.throwError);

        $event.bind('displayHelp', this._onShowHelp);
    };

    Engine.prototype.onShowHelp = function (e) {
        console.log('showing help');
        new Modal({
            title: 'Delve Help', msg: "" + "It's simple really, you just enter commands into the command bar (the black bar at the bottom of the screen) and things happen." + "Currently there are # supported commands:<br />" + "<ul>" + "<li><i>GO</i> {direction} - where direction is any of the exits listed for the current room (north, south, etc...)</li>" + "<li><i>HELP</i> (obviously)</li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>" + "</ul>"
        });
    };

    Engine.prototype.onDataDump = function () {
    };

    Engine.prototype.throwError = function (msg) {
        throw new Error(msg);
    };

    Engine.prototype.injectUI = function (theme) {
        var head = document.getElementsByTagName("head")[0];
        var linkNode = document.createElement("link");
        var that = this;
        linkNode.setAttribute('rel', 'stylesheet');
        linkNode.type = "text/css";
        linkNode.href = '/environs/' + theme + '/assets/theme.css';

        head.insertBefore(linkNode, head.firstChild);
    };
    return Engine;
})();
var Events = (function () {
    function Events() {
        this._callbacks = {};
    }
    Events.prototype.bind = function (name, callback, context) {
        if (!this._callbacks[name]) {
            this._callbacks[name] = [];
        }

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
var Modal = (function () {
    function Modal(obj) {
        this._modalPanel = $('<div>').attr('id', 'modal').addClass('eventPanel').css('opacity', '0');
        this.container = $('<div />').attr('id', 'content');
        this.title = $('<h3 />');
        this.msg = $('<div />');
        this.close = $('<button />').html('Close');
        this.closeModal = function () {
            console.log('closing');

            this._modalPanel.animate({ opacity: 0 }, 200, 'linear');
            this._modalPanel.remove();
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

        $('<div>').addClass('title').appendTo(this.container);
        $('<div>').attr('id', 'message').appendTo(this.container);
        $('<div>').attr('id', 'buttons').appendTo(this.container);

        var title = $('.title', this.container), desc = $('#message', this.container), btns = $('#buttons', this.container), buttons, i;

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

        this._modalPanel.append(this.container);
        $('body').append(this._modalPanel);

        this.registerEvents();
    }
    Modal.prototype.registerEvents = function () {
        var modal = $('.modal');
        $('.modal button').on('click', function () {
            $(modal).remove();
        });
    };
    return Modal;
})();
var Parser = (function () {
    function Parser() {
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
                "'{%s}' isn't a valid exit.",
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
        this._execute = function (e) {
            _this.execute(e);
        };
        this._console = $('#feedback');
        console.log('console: ', this._console);
        this.registerEvents();
    }
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
        var console = $('#feedback');
        console.append('<br /><span>' + msg + '</span>');
        console[0].scrollTop = console.scrollHeight;
    };

    Parser.prototype.handleShowCommand = function (args) {
    };

    Parser.prototype.handleToggleCommand = function (args) {
        var objects = ['map', 'controls', 'help'];
        var toggle = args[0];

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
            $event.emit('gotoRoom', dot);
        }
    };

    Parser.prototype.registerEvents = function () {
        var that = this;
        $event.bind('nojoy', this.updateConsole);
        $event.bind('dump', this._onDataDump);

        $('#command input').on('keypress', function (e) {
            if (e.which === 13) {
                var val = $(this).val();
                $(this).val('');
                that._execute(val);
            }
        });
    };

    Parser.prototype.onDataDump = function () {
        console.log('####################');
        console.log('Command Buffer:');
        console.log(this._commandBuffer);
        console.log('####################');
    };

    Parser.prototype.execute = function (val) {
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
    Object.defineProperty(Room.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Room.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Room.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (o) {
            this._position = o;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Room.prototype, "exits", {
        get: function () {
            return this._exits;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Room.prototype, "links", {
        get: function () {
            return this._links;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Room.prototype, "start", {
        get: function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });

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
var RoomManager = (function () {
    function RoomManager(filename, handler) {
        var _this = this;
        this._deck = [];
        this._rooms = {};
        this._activeRoom = null;
        this._startRoom = null;
        this._gridCoord = { x: 0, y: 0, z: 0 };
        this._mapGrid = [];
        this._gotoRoom = function (e) {
            _this.onDirectionSelected(e);
        };
        this._onDataDump = function (e) {
            _this.onDataDump();
        };
        this._map = new DMap();
        var that = this;
        $.getJSON(filename, function (data) {
            var rooms = data.rooms;
            var cnt = 0;
            for (var idx in rooms) {
                that._rooms[idx] = new Room(rooms[idx]);
                cnt++;
            }

            that.setUp();

            that.registerEvents();
        }).done(function () {
            if (handler)
                handler();
        }).fail(function () {
            console.log('failed');
            if (handler)
                handler();
        });
    }
    RoomManager.prototype.onDataDump = function () {
        var len = this._mapGrid.length;
        console.log('+++++++++++++++++++++++++++++++++');
        console.log('Map Grid:');
        for (var i = 0; i < len; i++) {
            console.log('arr[' + i + ']: ', this._mapGrid[i].toString());
        }
        console.log('current grid coords: ', this._gridCoord);

        console.log('>>> Deck:', this._deck.toString());
        console.log('>>> Rooms:', this._rooms);
        console.log('+++++++++++++++++++++++++++++++++');
    };

    RoomManager.prototype.resetGame = function () {
        this._activeRoom = null;
        this._deck = [];
        this._mapGrid = null;
        for (var i in this._rooms) {
            this._deck.push(i);
        }
    };

    RoomManager.prototype.setStartingRoom = function () {
        for (var i in this._rooms) {
            if (this._rooms[i].start) {
                this._startRoom = this._rooms[i];
            }
        }
        if (this._startRoom === null) {
            $event.emit('error', 'Failed to set start room');
        }
    };

    RoomManager.prototype.initGrid = function (rm) {
        console.log('mapping');
        var len = 0, offset = 0;
        len = (this._deck.length + 1);
        this._gridCoord.x = this._gridCoord.y = len;
        this._mapGrid = this.generateGrid(len * 2);

        this._mapGrid[len][len] = rm.id;
    };

    RoomManager.prototype.setUp = function () {
        console.log('Rooms: setup()');
        this.setStartingRoom();
        console.log('grid:', this._mapGrid.toString());
        this._deck = Utils.shuffle(Object.keys(this._rooms));

        var idx = this._deck.indexOf(this._startRoom.id);
        this._deck.splice(idx, 1);
        this.initGrid(this._startRoom);

        this._map.addRoom(this._startRoom, null, null);

        this._activeRoom = this._startRoom;
        this._activeRoom.render();
    };

    RoomManager.prototype.t = function () {
    };

    RoomManager.prototype.generateGrid = function (size) {
        console.log('start');
        var arr = new Array(size);
        for (var x = 0; x < size; x++) {
            arr[x] = new Array(size);
        }
        console.log('done');
        return arr;
    };

    RoomManager.prototype.getPolar = function (dir) {
        var polar = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };
        return polar[dir];
    };

    RoomManager.prototype.onDirectionSelected = function (dot) {
        if (this._activeRoom.exits.indexOf(dot) === -1) {
            $event.emit('nojoy', "You can't go that way.");
            return;
        }
        var rm;

        if (this._activeRoom.links[dot]) {
            this._activeRoom.links[dot].render();
        } else {
            if (!this._deck.length) {
                $event.emit('nojoy', 'That exit is sealed by some unknown force.');
            }
            rm = this.selectNewRoom(dot);
            if (!rm) {
                $event.emit('error', 'Failed to load new room!');
            }

            this._activeRoom.links[dot] = rm;

            rm.links[this.getPolar(dot)] = this._activeRoom;

            switch (dot) {
                case 'north':
                    this._gridCoord.y--;
                    break;
                case 'south':
                    this._gridCoord.y++;
                    break;
                case 'east':
                    this._gridCoord.x++;
                    break;
                case 'west':
                    this._gridCoord.x--;
                    break;
            }

            console.log('this._gridCoord.x: ', this._gridCoord.x);
            console.log('this._gridCoord.y: ', this._gridCoord.y);

            this._mapGrid[this._gridCoord.y][this._gridCoord.x] = rm.id;
            if (this.checkForConnections(rm, dot)) {
                this._map.addRoom(rm, dot, this._activeRoom.id);
                this._activeRoom = rm;
                this._activeRoom.render();
            } else {
                console.log('failed to check connections');
            }
        }
    };

    RoomManager.prototype.checkForConnections = function (rm, dot) {
        var dirs = ['north', 'south', 'east', 'west'];
        for (var i = 0; i < dirs.length; i++) {
            var testDirection = dirs[i];
            var testPolar = this.getPolar(testDirection);
            var tRoom = 'xxx';
            if (testDirection == this.getPolar(dot)) {
                continue;
            }
            switch (testDirection) {
                case 'north':
                    tRoom = this._mapGrid[this._gridCoord.y - 1][this._gridCoord.x];
                    break;
                case 'south':
                    tRoom = this._mapGrid[this._gridCoord.y + 1][this._gridCoord.x];
                    break;
                case 'east':
                    tRoom = this._mapGrid[this._gridCoord.y][this._gridCoord.x - 1];
                    break;
                case 'west':
                    tRoom = this._mapGrid[this._gridCoord.y][this._gridCoord.x + 1];
                    break;
            }
            var iRoom = this._rooms[tRoom];
            console.log('iRoom: ', tRoom);
            if (iRoom) {
                console.log('testing if ' + tRoom + ' has an exit to the ' + testDirection);
                if (iRoom.hasExit(testDirection)) {
                    console.log('has cooresponding exit');

                    if (rm.hasExit(testPolar)) {
                        console.log('excellent!');

                        rm.links[testPolar] = iRoom;
                        iRoom.links[testDirection] = rm;
                        return true;
                    } else {
                        console.log('we have no exit');

                        rm.exits.push(testPolar);
                        rm.links[testPolar] = iRoom;
                        iRoom.links[testDirection] = rm;
                        return true;
                    }
                } else {
                    for (var x = 0; x < iRoom.exits.length; x++) {
                        var ex = iRoom.exits[x];
                        if (!iRoom.links[ex]) {
                            iRoom.exits.splice(x, 1);
                            iRoom.exits.push(testPolar);
                            rm.links[testDirection] = iRoom;
                            iRoom.links[testPolar] = rm;
                        }
                        return true;
                    }

                    var idx = rm.exits.indexOf(testDirection);
                    rm.exits.splice(idx, 1);
                    return true;
                }
            }
        }
        return true;
    };

    RoomManager.prototype.selectNewRoom = function (e) {
        if (!this._deck.length) {
            $event.emit('error', 'no more rooms');
        }
        var r = this._deck.shift();
        var rm = this._rooms[r];

        if (rm.hasExit(e)) {
            return rm;
        }

        var that = this;
        var cnt = 0;

        function memoizer(rm) {
            var recur = function (d) {
                rm.rotateExits();
                if (!rm.hasExit(that.getPolar(d))) {
                    rm = recur(d);
                }
                return rm;
            };
            return recur;
        }

        var test = memoizer(rm);
        return test(e);
    };

    RoomManager.prototype.init = function () {
    };

    RoomManager.prototype.registerEvents = function () {
        $event.bind('gotoRoom', this._gotoRoom);
        $event.bind('dump', this._onDataDump);
    };

    RoomManager.prototype.getStartRoom = function () {
        return this._startRoom;
    };
    return RoomManager;
})();
var Player = (function () {
    function Player() {
        var _this = this;
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
