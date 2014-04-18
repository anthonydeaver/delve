/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />
/// <reference path="DelveMap.ts" />
declare var $;
class Rooms {

    private _rooms: any = [];
    private _deck: any;
    private _map: DelveMap;
    private _activeRoom: any = null;
    private _currentpositionSet = [0,0];
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
        console.log('+++++++++++++++++++++++++++++++++');
    }

    private getStart() {
        var len = 0, offset = 0;
        for(var i in this._deck) {
            if(this._deck[i].start) {
                this._activeRoom = this._deck[i];
                // Remove the starting point from the room so 
                // we never encounter it again.
                delete this._deck[i];
            } else {
                this._rooms.push(i);
            }
        }

        // In case I forgot to set an starting room.
        if(this._activeRoom === null) {
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
        console.log('direction: ', dot);
        console.log('active room: ', this._activeRoom[dot]);
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
            this._activeRoom.links[dot] = rm;
            console.log('links: ', rm);
            rm.links[this.getPolar(dot)] = this._activeRoom;
            /* draw on the map */
            this._map.addRoom(rm, dot, this._activeRoom.id);

            // set map coordinates
            switch(dot) {
                case 'north' :
                    this._currentpositionSet[1]++;
                    break;
                case 'south' :
                    this._currentpositionSet[1]--;
                    break;
                case 'east' :
                    this._currentpositionSet[0]++;
                    break;
                case 'west' :
                    this._currentpositionSet[0]--;
                    break;
            }

            rm.position = this._currentpositionSet;
            
            this.renderRoom(rm);
        }
    }
    /*
        TODO:
        - update active room to have connections to the new room, vice-versa for new room.
        - trigger map update
            - possible fire a new room event and let the engine handle this?
     */ 
    private renderRoom(rm) {
        $('#exits ul').html('');
        $('[data-dir]').each(function(){
            $(this).removeClass();
            $(this).addClass('disabled');
        });
        $('#display header').html(rm.name);
        $('#display #desc').html(rm.desc);

        for (var x = 0; x < rm.exits.length; x++ ) {
            // $('[data-dir="' + rm.exits[x] + '"]').removeClass('disabled');
            $('#exits ul').append($('<li />').html(rm.exits[x]));
        }

        this._activeRoom = rm;
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
    }

    constructor(locale) {
        this._map = new DelveMap();
        var that = this;
        var data1;
        $.getJSON('/environs/' + locale + '/rooms.json', function(data) {
            that._deck = data.rooms;

            // Find the starting point of the delve
            that.getStart();

            that.registerEvents();
        });
    }
}