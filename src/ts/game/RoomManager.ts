declare var $;
class RoomManager {

    private _deck: any = [];
    private _rooms: any = {};
    private _map: any;
    private _activeRoom: Room = null;
    private _startRoom: Room = null;
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
        this._activeRoom = null;
        this._deck = [];
        this._mapGrid = null;
        for(var i in this._rooms) {
            this._deck.push(i);
        }
    }

    private setStartingRoom() {
        for(var i in this._rooms) {
            if(this._rooms[i].start) {
                this._startRoom = this._rooms[i];
                delete this._rooms[i];
            }
        }
        if(this._startRoom === null) { $event.emit('error','Failed to set start room'); }
    }

    /*
        The grid is twice as wide as the number of rooms simply to account for the (remote)
        possibility that all the rooms lay out in a completely horizontal pattern.
         The chances of it happening are close to nil, but....
    */
    private mapToGrid(rm) {
        var len = 0, offset = 0;
        len = (this._deck.length + 1) * 2;
        offset = Math.floor(len / 2);
        this._mapGrid = this.generateGrid(len);
        this._mapGrid[offset][offset] = rm.id;
    }

    private setUp() {
        console.log('Rooms: setup()');
        this.setStartingRoom();

        this._deck = Utils.shuffle(Object.keys(this._rooms));
        // insert into map
        this._map.addRoom(this._startRoom, null, null);

        // Starting spot is always 0,0,0 per Sheldon Cooper (RE: removed time index. For now ;) )
        this._activeRoom = this._startRoom;
        this._activeRoom.render();
    }

    private t() {}

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
            // this.renderRoom(this._activeRoom.links[dot]);
            this._activeRoom.links[dot].render();
        } else {
            if(!this._deck.length) {
                $event.emit('nojoy', 'That exit is sealed by some unknown force.');
            }
            rm = this.selectNewRoom(dot);
            console.log('new room: ', rm);
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
                - look at room in all 4 adjacent locations
                - if adjacent room doesn't have a link, remove this rooms cooresponding exit. Or,
                - if adjacent room doesn't have a link, shift this rooms cooresponding exit to another available direction.

                - if adjacent room has an exit but this room doesn't, add one to this room. Or,
                - if adjacent room has an exit, attempt to relocate one this rooms exits from another, unlinked, direction.

            */
            var dirs = ['north', 'south','east','west'];
            for( var i = 0; i < dirs.length; i++) {
                var testDirection = dirs[i];
                var testPolar =this.getPolar(testDirection);
                var tRoom = 'xxx';
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
                var iRoom: Room = this._rooms[tRoom];
                if(iRoom) {
                    // If test room has an exit in our direction
                    if(iRoom.hasExit(testPolar)) {
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
            this._activeRoom = rm;
            this._activeRoom.render();
        }
    }

    /**
     * Selects a new froom from the _rooms.
     * @param {string} e [description]
     */
    private selectNewRoom(e: string) {
        if(!this._deck.length) {
            $event.emit('error', 'no more rooms');
        }
        var r = this._deck.shift();
        var rm = this._rooms[r];

        if(rm.hasExit(e)) { 
            return rm; //Good as is
        }
        var that = this;
        var cnt = 0;

        function memoizer(rm) {
            var recur = function(d) {
                rm.rotateExits();
                if(!rm.hasExit(that.getPolar(d))) {
                    rm = recur(d);
                }
                return rm
            };
            return recur;
        }

        var test = memoizer(rm);
        return test(e);
    }

    private init() {

    }

    private registerEvents() {
        $event.bind('gotoRoom', this._gotoRoom);
        $event.bind('dump', this._onDataDump);
    }

    // Public Methods
    public getStartRoom() {
        return this._startRoom;
    }

    constructor(filename, handler?: any) {
        // The handler callback is strictly for unit testing
        this._map = new DMap();
        var that = this;
        $.getJSON(filename, function(data) {
            var rooms = data.rooms;
            for(var idx in rooms) {
                that._rooms[idx] = new Room(rooms[idx]);
            }
            that.setUp();

            that.registerEvents();
        }).done(function() {
            if(handler) handler();
        }).fail(function() {
            console.log('failed'); 
            if(handler) handler();
        });
    }
}