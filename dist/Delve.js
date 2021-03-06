var DMap = (function () {
    function DMap(lvl) {
        this._level = 0;
        this._level = lvl;
        this.createLevel();

        this.registerEvents();
    }
    Object.defineProperty(DMap.prototype, "level", {
        get: function () {
            return this._level;
        },
        enumerable: true,
        configurable: true
    });

    DMap.prototype.registerEvents = function () {
        $event.emit('log', 'registering map events');
        var toggle = function () {
            $('#map').toggle();
            $(this).html($('#map').is(':visible') ? 'Close Map' : 'Open Map');
        };

        $event.bind('togglemap', toggle);

        $('#BTN_MAP_TOGGLE').on('click', toggle);
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

        this.centerMap(yPos, xPos);
    };

    DMap.prototype.centerMap = function (yPos, xPos) {
        $(this._map).css('top', -(yPos - 200));
        $(this._map).css('left', -(xPos - 200));
    };

    DMap.prototype.shorten = function (name) {
        var arr = name.split(' ');
        var ret = arr[0][0] + '.' + arr[1];
        return ret;
    };

    DMap.prototype.goUp = function () {
    };
    DMap.prototype.goDown = function () {
    };

    DMap.prototype.createLevel = function () {
        var lvl = this._level;
        console.log('lvl: ', lvl);
        var g = $('#map article[level="' + lvl + '"] div');
        if (g.length == 0) {
            var map = $('#map');
            var art = $('<article />').attr('class', 'wrapper').attr('level', lvl).data('type', 'level');
            var cont = $('<div />');
            art.append(cont);
            $(map).append(art);
            g = $('#map article[level="' + lvl + '"] div');
        }
        this._map = g;
    };

    DMap.prototype.gotoLevel = function (dir) {
        var g = $('#map article[level="' + this._level + '"]');
        var params = { top: '', left: '', opacity: 0.1 };
        if (dir === 'up') {
            this._level++;
            params.top = "+=40";
            params.left = "-=40";
        } else if (dir === 'down') {
            this._level--;
            params.top = "-=40";
            params.left = "+=40";
        }

        this.createLevel();
        $('.wrapper').each(function () {
            var lvl = parseInt($(this).attr('level'), 10);

            if (lvl === this._level)
                params.opacity = 1;
            $(this).animate(params, 500, function () {
            });
        });
    };
    DMap.prototype.gotoLevel2 = function (d) {
        var lvl = this._level;
        var params = { top: '', left: '', opacity: 0.1 };
        if (d === 'up') {
            this._level++;
            this.goUp();
        }
        if (d === 'down') {
            this.goDown();
        }

        this.createLevel();
    };
    DMap.prototype.newLevel = function (dir) {
        var g = $('#map article[level="' + this._level + '"]');
        var params = { top: '', left: '', opacity: 0.1 };
        if (dir === 'up') {
            this._level++;
            params.top = "+=40";
            params.left = "-=40";
        } else if (dir === 'down') {
            this._level--;
            params.top = "-=40";
            params.left = "+=40";
        }

        $(g).animate(params, 500, function () {
        });
        this.createLevel();
    };

    DMap.prototype.shiftView = function (direction, id) {
        var xPos = parseInt($('#' + id).css('left'), 10);
        var yPos = parseInt($('#' + id).css('top'), 10);
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
        this.centerMap(yPos, xPos);
    };

    DMap.prototype.addRoom = function (rm, direction, target) {
        console.log('mapping ', rm.id);
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
        console.log('sp: ', this._map);
        $(this._map).append(sp);

        this.addExits(yPos, xPos, rm);
    };
    return DMap;
})();
var Engine = (function () {
    function Engine(o) {
        var _this = this;
        this._mappings = {
            '0001': 'haunted_mansion'
        };
        this._onShowHelp = function (e) {
            return _this.onShowHelp(e);
        };
        this._world = o.world;
        new Parser();

        this.loadThemeConfig(this._mappings[o.world]);
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

    Engine.prototype.loadFile = function (url) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function () {
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            };

            req.onerror = function () {
                reject(Error("Network Error"));
            };

            req.send();
        });
    };
    Engine.prototype.loadThemeConfig = function (theme) {
        var cfg = this.loadFile('environs/' + theme + '/config.json');
        var that = this;

        cfg.then(function (response) {
            var json = JSON.parse(response);
            new RoomManager(json);
            that.injectUI(theme);
        }, function (error) {
            that.throwError('Failed to load theme config: ' + theme);
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

        var title = $('title').html();
        console.log('title: ', title);
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
        console[0].scrollTop = console[0].scrollHeight;
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
    function RoomManager(config, handler) {
        var _this = this;
        this._deck = [];
        this._rooms = {};
        this._rooms2 = [];
        this._currentRoom = null;
        this._startRoom = null;
        this._gridCoord = { x: 0, y: 0, z: 0 };
        this._mapGrid = [];
        this._shuffle = true;
        this._gotoRoom = function (e) {
            _this.onDirectionSelected(e);
        };
        this._onDataDump = function (e) {
            _this.onDataDump();
        };
        this.parseConfig(config);
        this.registerEvents();
    }
    RoomManager.prototype.registerEvents = function () {
        $event.bind('gotoRoom', this._gotoRoom);
        $event.bind('dump', this._onDataDump);
    };

    RoomManager.prototype.onDataDump = function () {
        var len = this._mapGrid.length;

        for (var i = 0; i < len; i++) {
        }
    };

    RoomManager.prototype.resetGame = function () {
        this._currentRoom = null;
        this._deck = [];
        this._mapGrid = null;
        for (var i in this._rooms) {
            this._deck.push(i);
        }
    };

    RoomManager.prototype.initGrid = function (rm) {
        var len = 0, offset = 0;
        len = (this._deck.length + 1);
        this._gridCoord.x = this._gridCoord.y = len;
        this._mapGrid = this.generateGrid(len * 2);
        this._mapGrid[len][len] = rm.id;
    };

    RoomManager.prototype.createDeck = function (l) {
        var arr = [];
        arr = Object.keys(this._rooms2[l]);

        if (this._shuffle) {
            arr = Utils.shuffle(arr);
        }
        return arr;
    };

    RoomManager.prototype.removeFromDeck = function (id) {
        var idx = this._deck.indexOf(id);
        this._deck.splice(idx, 1);
    };

    RoomManager.prototype.parseConfig = function (cfg) {
        if (cfg.shuffle !== undefined) {
            this._shuffle = cfg.shuffle;
        }

        for (var x = 0; x < cfg.levels.length; x++) {
            this._rooms2[x] = {};
            var lvl = cfg.levels[x];
            for (var rm in lvl) {
                this._rooms2[x][rm] = new Room(lvl[rm]);
            }
        }

        this._map = new DMap(cfg.start_level);

        this._startRoom = this._rooms2[cfg.start_level][cfg.start_room];
        this._deck = this.createDeck(cfg.start_level);

        this.removeFromDeck(cfg.start_room);

        this.initGrid(this._startRoom);

        this._map.addRoom(this._startRoom, null, null);

        this._currentRoom = this._startRoom;
        this._currentRoom.render();
    };

    RoomManager.prototype.generateGrid = function (size) {
        var arr = new Array(size);
        for (var x = 0; x < size; x++) {
            arr[x] = new Array(size);
        }
        return arr;
    };

    RoomManager.prototype.getPolar = function (dir) {
        var polar = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east',
            'up': 'down',
            'down': 'up'
        };
        return polar[dir];
    };

    RoomManager.prototype.searchForRoom = function (list, key, val) {
        for (var entry in list) {
            if (!list.hasOwnProperty(entry)) {
                continue;
            }
            var rm = list[entry];

            for (var attr in rm) {
                if (attr === key) {
                    if (typeof (rm[attr]) === 'string') {
                        if (rm[attr] === val) {
                            return rm;
                        }
                    } else {
                        var node = rm[attr];
                        for (var item in node) {
                            if (node[item] === val) {
                                return rm;
                            }
                        }
                    }
                }
            }
        }
        return null;
    };

    RoomManager.prototype.onDirectionSelected = function (dot) {
        var target;
        var deck = this._deck;

        if (this._currentRoom.exits.indexOf(dot) === -1) {
            $event.emit('nojoy', "You can't go that way.");
            return;
        }
        var rm;

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

        if (this._currentRoom.links[dot]) {
            rm = this._currentRoom.links[dot];
            this._map.shiftView(dot, this._currentRoom.id);
            this._currentRoom = rm;
            this._currentRoom.render();

            return;
        } else {
            if (!this._deck.length) {
                $event.emit('nojoy', 'That exit had been boarded up and is sealed by some unknown force.');
            }
            if (dot === 'up' || dot === 'down') {
                this._map.gotoLevel(dot);
                var lvl = this._map.level;
                this._deck = this.createDeck(lvl);
                rm = this.searchForRoom(this._rooms2[lvl], 'exits', this.getPolar(dot));
                this.removeFromDeck(rm.id);
                target = null;
            } else {
                target = this._currentRoom.id;
                rm = this.selectNewRoom(dot);
            }
            if (!rm) {
                $event.emit('error', 'Failed to load new room!');
            }

            this._currentRoom.links[dot] = rm;
            rm.links[this.getPolar(dot)] = this._currentRoom;

            this._mapGrid[this._gridCoord.y][this._gridCoord.x] = rm.id;
            if (this.scanGrid(rm, dot)) {
                this._map.addRoom(rm, dot, target);
                this._currentRoom = rm;
                this._currentRoom.render();
            } else {
            }
        }
    };

    RoomManager.prototype.scanGrid = function (rm, dot) {
        var dirs = ['north', 'south', 'east', 'west'];
        for (var i = 0; i < dirs.length; i++) {
            var testDir = dirs[i];
            var testPolar = this.getPolar(testDir);
            var tRoom = 'xxx';

            if (testDir == dot) {
                continue;
            }
            switch (testDir) {
                case 'north':
                    tRoom = this._mapGrid[this._gridCoord.y - 1][this._gridCoord.x];
                    break;
                case 'south':
                    tRoom = this._mapGrid[this._gridCoord.y + 1][this._gridCoord.x];
                    break;
                case 'east':
                    tRoom = this._mapGrid[this._gridCoord.y][this._gridCoord.x + 1];
                    break;
                case 'west':
                    tRoom = this._mapGrid[this._gridCoord.y][this._gridCoord.x - 1];
                    break;
                default:
                    break;
            }
            var iRoom = this._rooms[tRoom];

            if (iRoom) {
                if (iRoom.hasExit(testPolar)) {
                    if (!rm.hasExit(testDir)) {
                        rm.exits.push(testDir);
                    }
                    rm.links[testDir] = iRoom;
                    iRoom.links[testPolar] = rm;
                } else {
                    var idx = rm.exits.indexOf(testDir);
                    rm.exits.splice(idx, 1);
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
        var lvl = this._map.level;
        var rm = this._rooms2[lvl][r];

        if (rm.hasExit(this.getPolar(e))) {
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

    Utils.searchFor = function (arr, key, val) {
        for (var i = o; i < arr.length; i++) {
            var o = arr[i];
            for (var k in o) {
                if (k === key && o[k] === val) {
                    return arr[i];
                }
            }
        }

        return null;
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
