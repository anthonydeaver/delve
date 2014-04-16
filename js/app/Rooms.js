/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />
/// <reference path="DelveMap.ts" />
var Rooms = (function () {
    function Rooms(locale) {
        var _this = this;
        this._rooms = [];
        this._currentGridSet = [0, 0];
        this._gotoRoom = function (e) {
            console.log('caught');
            _this.onDirectionSelected(e);
        };
        this._map = new DelveMap();
        var that = this;
        var data1;
        $.getJSON(locale + '/rooms.json', function (data) {
            that._deck = data.rooms;

            // Find the starting point of the delve
            that.getStart();

            that.registerEvents();
        });
    }
    Rooms.prototype.getStart = function () {
        for (var i in this._deck) {
            // this._deck[i].connections = {};
            // this._deck[i].name = this._deck[i].name.replace(/\+/g, ' ');
            // this._deck[i].desc = this._deck[i].desc.replace(/\+/g, ' ');
            // this._deck[i].gridCoord = [];
            if (this._deck[i].start) {
                this._activeRoom = this._deck[i];
                //delete this._deck[i];
            } else {
                this._rooms.push(i);
            }
        }

        this._rooms = Utils.shuffle(this._rooms);

        // insert into map
        this._map.setStartPoint(this._activeRoom);

        // Starting spot is always 0,0,0 per Sheldon Cooper (RE: removed time index. For now ;) )
        this._activeRoom.gridCoord = this._currentGridSet;
        this.renderRoom(this._activeRoom);
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
            $event.emit('error', "[r] You can't go that way.");
            return;
        }
        var rm;

        /*
        activeRoom
        - user clicks on direction
        - system checks activeRoom for an existing connection associated with that direction
        - no connection
        - system grabs and configures next room
        - system sets up a connection between activeRoom's exit direction(ex: north) and the new rooms entrance direction (ex: south)
        - system renders room
        -system updates activeRoom to new room
        */
        //First, check the current room for active connections for the selected direction
        if (this._activeRoom.connections[dot]) {
            // already have a connection
            this.renderRoom(this._activeRoom.connections[dot]);
        } else {
            rm = this.drawRoom(dot);
            if (!rm) {
                $event.emit('error', 'Failed to load new room!');
            }
            this._activeRoom.connections[dot] = rm;
            rm.connections[this.getPolar(dot)] = this._activeRoom;

            /* draw on the map */
            this._map.addRoom(rm, dot, this._activeRoom.id);

            switch (dot) {
                case 'north':
                    this._currentGridSet[1]++;
                    break;
                case 'south':
                    this._currentGridSet[1]--;
                    break;
                case 'east':
                    this._currentGridSet[0]++;
                    break;
                case 'west':
                    this._currentGridSet[0]--;
                    break;
            }

            rm.gridCoord = this._currentGridSet;

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
        console.log('r: ', r);
        var rm = this._deck[r];
        console.log('rm: ', rm);

        if (this.checkExits(rm, e)) {
            return rm;
        }
        var that = this;
        var cnt = 0;
        var recur = function (rm) {
            cnt++;
            if (cnt >= 4) {
                // We failed, give up
                $event.emit('error', 'failed to fix room: ' + rm.name);
                return;
            }
            rm = that.rotateRoomExits(rm);
            console.log('rm-recur: ', cnt);
            if (that.checkExits(rm, e)) {
                return rm;
            } else {
                recur(rm);
            }
        };
        return recur(rm);
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
    };
    return Rooms;
})();
