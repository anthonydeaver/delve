var Engine = (function () {
    function Engine(o) {
        this._mappings = {
            '0001': 'haunted_mansion'
        };
        this._version = '0.0.0.1';
        var world = this._mappings[o.world || '0001'];

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
var Room = (function () {
    function Room(config) {
        this._exits = [];
        this._links = {};
        this._start = false;
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

    Room.prototype.hasExit = function (exit) {
        for (var i = 0; i < this._exits.length; i++) {
            if (this._exits[i] === exit) {
                return true;
            }
        }
        return false;
    };

    Room.prototype.render = function (rm) {
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

        console.log('id: ', this._id);
        $('#map span[type="room"]#' + this._id).addClass('current');
    };

    Room.prototype.rotateExits = function (rm) {
        console.log('rotating');
        for (var i = 0; i < this._exits.length; i++) {
            console.log('loop: ', this._exits[i]);
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
var RoomManager = (function () {
    function RoomManager(locale) {
        var _this = this;
        this._rooms = [];
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
        var that = this;
        var data1;
        console.log('getting: ');
        console.log('environs/' + locale + '/rooms.json');

        $.getJSON('environs/' + locale + '/rooms.json', function (data) {
            that._deck = data.rooms;

            that.setUp();

            that.registerEvents();
        }).done(function () {
            console.log('success');
        }).fail(function (e) {
            console.log('error: ', e);
        }).always(function () {
            console.log("complete");
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
        console.log('+++++++++++++++++++++++++++++++++');
    };

    RoomManager.prototype.resetGame = function () {
        this._activeRoom = '';
        this._rooms = [];
        this._mapGrid = null;
        for (var i in this._deck) {
            this._rooms.push(i);
        }
    };

    RoomManager.prototype.setUp = function () {
        console.log('Rooms: setup()');
        var len = 0, offset = 0;
        for (var i in this._deck) {
            if (this._deck[i].start) {
                this._startRoom = this._deck[i];

                delete this._deck[i];
            } else {
                this._rooms.push(i);
            }
        }

        if (this._startRoom === null) {
            var t = this._rooms.pop();
            this._startRoom = this._deck[t];
            delete this._deck[t];
        }

        len = (this._rooms.length + 1) * 2;
        offset = Math.floor(len / 2);
        this._gridCoord.x = this._gridCoord.y = offset;
        this._mapGrid = this.generateGrid(len);
        this._mapGrid[offset][offset] = this._startRoom.id;

        this._rooms = Utils.shuffle(this._rooms);

        this._map.addRoom(this._startRoom, null, null);

        this._startRoom.position = this._gridCoord;
        this.renderRoom(this._startRoom);
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

            this._mapGrid[this._gridCoord.y][this._gridCoord.x] = rm.id;

            var dirs = ['north', 'south', 'east', 'west'];
            for (var i = 0; i < dirs.length; i++) {
                var testDirection = dirs[i];
                var testPolar = this.getPolar(testDirection);
                var tRoom = '';
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
                console.log('test room: ', tRoom);
                tRoom = this._deck[tRoom];
                if (tRoom) {
                    if (this.roomHasExit(tRoom, testPolar)) {
                        if (Math.round(Math.random())) {
                            console.log('add an exit');
                        } else {
                            console.log('attempt to shift');
                        }
                    } else {
                        if (Math.round(Math.random())) {
                            console.log('remove our exit');
                        } else {
                            console.log('attempt to shift');
                        }
                    }
                }
            }

            this._map.addRoom(rm, dot, this._activeRoom.id);
            this.renderRoom(rm);
        }
    };

    RoomManager.prototype.roomHasExit = function (rm, exit) {
        for (var i = 0; i < rm.exits.length; i++) {
            if (rm.exits[i] === exit) {
                return true;
            }
        }
        return false;
    };

    RoomManager.prototype.renderRoom = function (rm) {
        $('#map span[type="room"]').removeClass('current');
        $('#exits ul').html('');
        $('[data-dir]').each(function () {
            $(this).removeClass();
            $(this).addClass('disabled');
        });
        $('#display header').html(rm.name);
        $('#display #desc').html(rm.desc);

        for (var x = 0; x < rm.exits.length; x++) {
            var name = rm.exits[x];
            if (rm.links[name]) {
                name += " <span>(" + rm.links[name].name + ")</span>";
            }
            $('#exits ul').append($('<li />').html(name));
        }

        this._activeRoom = rm;
        console.log('id: ', rm.id);
        $('#map span[type="room"]#' + rm.id).addClass('current');
    };

    RoomManager.prototype.checkExits = function (rm, e) {
        var entrance = this.getPolar(e);
        for (var x = 0; x < rm.exits.length; x++) {
            if (rm.exits[x] === entrance) {
                return true;
            }
        }
        return false;
    };

    RoomManager.prototype.rotateRoomExits = function (rm) {
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

    RoomManager.prototype.drawRoom = function (e) {
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

    RoomManager.prototype.registerEvents = function () {
        $event.bind('gotoRoom', this._gotoRoom);
        $event.bind('dump', this._onDataDump);
    };

    RoomManager.prototype.getStartingRoom = function () {
        console.log('get room');
        return this._startRoom;
    };
    return RoomManager;
})();
