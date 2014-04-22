/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />
/// <reference path="DelveMap.ts" />
declare var $;
class Rooms {

    private _rooms: any = [];
    private _deck: any;
    private _map: DelveMap;
    private _activeRoom: any = null;
    private _startRoom: any = null;
    private _gridCoord = {x:0, y:0, z:0};
    private _mapGrid: any = [];


    private _gotoRoom = (e) => { this.onDirectionSelected(e); }
    private _onDataDump = (e) => { this.onDataDump(); }

    private onDataDump() {
        var len = this._mapGrid.length;
        console.log('+++++++++++++++++++++++++++++++++');
        console.log('Map Grid:');
        for(var i = 0; i < len; i++) {
            console.log('arr['+i+']: ', this._mapGrid[i].toString());
        }
        console.log('current grid coords: ', this._gridCoord);
        console.log('+++++++++++++++++++++++++++++++++');
    }

    private resetGame() {
        this._activeRoom = '';
        this._rooms = [];
        this._mapGrid = null;
        for(var i in this._deck) {
            this._rooms.push(i);
        }
        // this._rooms = Utils.shuffle(this._rooms);
        // this._mapGrid = this.generateGrid(len);
        // this._mapGrid[offset][offset] = this._startRoom.id;
    }

    private setUp() {
        var len = 0, offset = 0;
        for(var i in this._deck) {
            if(this._deck[i].start) {
                this._startRoom = this._deck[i];
                // Remove the starting point from the room so 
                // we never encounter it again.
                delete this._deck[i];
            } else {
                this._rooms.push(i);
            }
        }

        // In case I forgot to set an starting room.
        if(this._startRoom === null) {
            var t = this._rooms.pop();
            this._startRoom = this._deck[t];
            delete this._deck[t];

        }
        /*
            The grid is twice as wide as the number of rooms simply to account for the (remote)
            possibility that all the rooms lay out in a completely horizontal pattern.
             The chances of it happening are close to nil, but....
        */
        // add 1 to the length to accoount for the starting room.
        len = (this._rooms.length + 1) * 2;
        offset = Math.floor(len / 2);
        this._gridCoord.x = this._gridCoord.y = offset;
        this._mapGrid = this.generateGrid(len);
        this._mapGrid[offset][offset] = this._startRoom.id;

        this._rooms = Utils.shuffle(this._rooms);
        // insert into map
        // this._map.setStartPoint(this._startRoom);
        this._map.addRoom(this._startRoom, null, null);

        // Starting spot is always 0,0,0 per Sheldon Cooper (RE: removed time index. For now ;) )
        this._startRoom.position = this._gridCoord;
        this.renderRoom(this._startRoom);
    }

    // creates an x by x grid for the map where 'x' is the number of rooms/cards in the deck
    private generateGrid(size: number) {
        var arr = new Array(size);
        for(var x = 0; x < size; x++) {
            arr[x] = new Array(size);
        }

        return arr;
    }

    private getPolar(dir):string {
        var polar = {
            'north':'south',
            'south': 'north',
            'east':'west',
            'west':'east'
        };
        return polar[dir];
    }

    private onDirectionSelected(dot: string) {
        // if(dot === 'up') {}
        // if(dot === 'down') {}

        // Make sure the active room has that exit available
        if(this._activeRoom.exits.indexOf(dot) === -1) {
            $event.emit('nojoy', "You can't go that way.");
            return;
        }
        var rm;
        //First, check the current room for active connections for the selected direction
        if(this._activeRoom.links[dot]) {
            // already have a connection
            this.renderRoom(this._activeRoom.links[dot]);
        } else {
            if(!this._rooms.length) {
                $event.emit('nojoy', 'That exit is sealed by some unknown force.');
            }
            rm = this.drawRoom(dot);
            if(!rm) { $event.emit('error','Failed to load new room!'); }

            // Set up the links from the exiting room to the entering room and visa-versa
            this._activeRoom.links[dot] = rm;
            // console.log('links: ', rm);
            rm.links[this.getPolar(dot)] = this._activeRoom;

            // set map coordinates
            switch(dot) {
                case 'north' :
                    this._gridCoord.y--;
                    break;
                case 'south' :
                    this._gridCoord.y++;
                    break;
                case 'east' :
                    this._gridCoord.x++;
                    break;
                case 'west' :
                    this._gridCoord.x--;
                    break;
            }

            this._mapGrid[this._gridCoord.y][this._gridCoord.x] = rm.id;

            /*
             Go through remaining exits and look for existing rooms on the grid in that
             direction and make the necessary links.
             If the adjoining room doesn't have an exit to match, remove the new rooms 
             corresponding exit. Might cause some rooms to only have a single entrance/exit
            */

            /*
                - look at room in all 4 adjenctnt locations
                - if adjacent room doesn't have a link, remove this rooms cooresponding exit. Or,
                - if adjacent room doesn't have a link, shift this rooms cooresponding exit to another available direction.

                - if adjacent room has an exit but this room doesn't, add one to this room. Or,
                - if adjacent room has an exit, attempt to relocate one this rooms exits from another, unlinked, direction.

            */
            var dirs = ['north', 'south','east','west'];
            for( var i = 0; i < dirs.length; i++) {
                var testDirection = dirs[i];
                var testPolar =this.getPolar(testDirection);
                var tRoom = '';
                if(testDirection == this.getPolar(dot)) { continue; } // skip the incoming exit, we know about that one.
                switch(testDirection) {
                    case 'north':
                        tRoom = this._mapGrid[this._gridCoord.y - 1][this._gridCoord.x];
                        break;
                    case 'south':
                        tRoom = this._mapGrid[this._gridCoord.y + 1][this._gridCoord.x];
                        break;
                    case 'east':
                        tRoom = this._mapGrid[this._gridCoord.y ][this._gridCoord.x - 1];
                        break;
                    case 'west':
                        tRoom = this._mapGrid[this._gridCoord.y ][this._gridCoord.x + 1];
                        break;
                }
                console.log('test room: ', tRoom);
                tRoom = this._deck[tRoom];
                if(tRoom) {
                    // If test room has an exit in our direction
                    if(this.roomHasExit(tRoom, testPolar)) {
                        // Adjacent room has an exit in our direction, what to do...
                        if(Math.round(Math.random())) { console.log('add an exit')}
                        else { console.log('attempt to shift'); }
                    } else {
                        // Adjacent room do not have an exit in our direction, what to do...
                        if(Math.round(Math.random())) { console.log('remove our exit')}
                        else { console.log('attempt to shift'); }
                    }

                }
                //console.log(e + ": ", or);
            }            
                
            /* draw on the map */
            this._map.addRoom(rm, dot, this._activeRoom.id);
            this.renderRoom(rm);
        }
    }

    private roomHasExit(rm, exit) {
        for ( var i = 0; i < rm.exits.length; i++) {
            if(rm.exits[i] === exit) { return true;}
        }
        return false;
    }
    /*
        TODO:
        - update active room to have connections to the new room, vice-versa for new room.
        - trigger map update
            - possible fire a new room event and let the engine handle this?
     */ 
    private renderRoom(rm) {
        $('#map span[type="room"]').removeClass('current');
        $('#exits ul').html('');
        $('[data-dir]').each(function(){
            $(this).removeClass();
            $(this).addClass('disabled');
        });
        $('#display header').html(rm.name);
        $('#display #desc').html(rm.desc);

        for (var x = 0; x < rm.exits.length; x++ ) {
            // $('[data-dir="' + rm.exits[x] + '"]').removeClass('disabled');
            var name = rm.exits[x];
            if(rm.links[name]) {
                name += " <span>(" + rm.links[name].name + ")</span>";
            }
            $('#exits ul').append($('<li />').html(name));
        }

        this._activeRoom = rm;
        console.log('id: ', rm.id);
        $('#map span[type="room"]#' + rm.id).addClass('current');
    }

    private checkExits(rm, e) {
        var entrance = this.getPolar(e);
        for (var x = 0; x < rm.exits.length; x++ ) {
            if(rm.exits[x] === entrance) {
                return true;
            }
        }
        return false;
    }

    /*
        This rotates the rooms exits clockwise. North becomes East, East becomes South, etc...
     */
    private rotateRoomExits(rm) {
        console.log('rotating');
        for (var i = 0; i < rm.exits.length; i++ ) {
            console.log('loop: ', rm.exits[i]);
            switch(rm.exits[i]) {
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
    }

    // Public Methods
    /*
    'draw' as in draw from a deck...
     
    - get room from top of 'deck'
    - if no matching entrance / exit, rotate 
    - no match: Error. !! Should never happen !!
     */
    private drawRoom(e: string) {
        if(!this._rooms.length) {
            $event.emit('error', 'no more rooms');
        }
        var r = this._rooms.pop();
        var rm = this._deck[r];

        if(this.checkExits(rm, e)) { 
            return rm; //Good as is
        }
        var that = this;
        var cnt = 0;

        function memoizer(rm) {
            var recur = function(d) {
                rm = that.rotateRoomExits(rm);
                // var result = that.checkExits(rm, d);
                if(!that.checkExits(rm, d)) {
                    rm = recur(d);
                }
                return rm
            };
            return recur;
        }

        var test = memoizer(rm);
        return test(e);
    }

    private registerEvents() {
        $event.bind('gotoRoom', this._gotoRoom);
        $event.bind('dump', this._onDataDump);
    }

    constructor(locale) {
        this._map = new DelveMap();
        var that = this;
        var data1;
        $.getJSON('/environs/' + locale + '/rooms.json', function(data) {
            that._deck = data.rooms;

            // Find the starting point of the delve
            that.setUp();

            that.registerEvents();
        });
    }
}