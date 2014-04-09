/// <reference path="Utils.ts" />
/// <reference path="delve.ts" />
declare var $;
class Rooms {

    private _engine: Engine;
    private _rooms: any = [];
    private _deck: any;
    private _activeRoom: any;

    private getStart() {
        for(var i in this._deck) {
            if(this._deck[i].start) {
                this._activeRoom = this._deck[i];
                this._activeRoom.connections = {};
                delete this._deck[i];
            }
        }
        for(var k in this._deck) {
            // Little housekeeping
            // this._deck[k].connections = {'east':'', 'north':'','west':'', 'south':''};
            this._deck[k].connections = {};
            this._rooms.push(k);
        }
        this._rooms = Utils.shuffle(this._rooms);
        this.renderRoom(this._activeRoom);
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
        if(this._activeRoom.connections[dot]) {
            // already have a connection
            this.renderRoom(this._activeRoom.connections[dot]);
        } else {
            rm = this.getRoom(dot);
            this._activeRoom.connections[dot] = rm;
            rm.connections[this.getPolar(dot)] = this._activeRoom;
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
        $('[data-dir]').each(function(){
            $(this).removeClass();
            $(this).addClass('disabled');
        });
        $('#display header').html(rm.name);
        $('#display article').html(rm.desc);

        for (var x = 0; x < rm.exits.length; x++ ) {
            $('[data-dir="' + rm.exits[x] + '"]').removeClass('disabled');
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
        for (var i = 0; i < rm.exits.length; i++ ) {
            if(rm.exits[i] === 'north') { rm.exits[i] == 'east'; }
            if(rm.exits[i] === 'east') { rm.exits[i] == 'south'; }
            if(rm.exits[i] === 'south') { rm.exits[i] == 'west'; }
            if(rm.exits[i] === 'west') { rm.exits[i] == 'north'; }
        }
        return rm;
    }

    // Public Methods
    /*
    - get room from top of 'deck'
    - if no matching entrance / exit, rotate 
    - no match: Error. !! Should never happen !!
     */
    public getRoom(e: string) {
        var r = this._rooms.pop();
        var rm = this._deck[r];
        console.log('before: ', rm);
        if(this.checkExits(rm, e)) { 
            return rm; //Good as is
        }

        var recur = function(rm) {
            rm = this.rotateRoomExits(rm);
            if(this.checkExits(rm, e)) {
                return rm;
            } else {
                recur(rm);       
            }
        }
        // Need to loop this...
        // rm = this.rotateRoomExits(rm);
        // console.log('after: ', rm);

        // if(this.checkExits(rm, e)) { 
        //     return rm; //Good as is
        // }

        // return rm;
        return recur(rm);
    }

    private registerEvents() {
        var that = this;
        $('#nav button').on('click', function(evt) {
            if($(this).hasClass('disabled')) {
                return;
            }
            var dot = $(this).data('dir'); // dot = 'direction of travel'
            that.onDirectionSelected(dot);
        });
    }

    constructor(engine, locale) {
        this._engine = engine;
        // var data1 = engine.getFile(locale + '/rooms.json');
        var data1 = '{"rooms":{"hallway":{"name":"Hallway","short_code":"hallway","desc":"Standard+hallway.","exits":["north","south","east"],"hasMonster":false,"hasTreasure":false,"start":false},"foyer":{"name":"Foyer","short_code":"foyer","desc":"This+is+where+it+starts.","exits":["north","east","west"],"hasMonster":false,"hasTreasure":false,"start":true},"study":{"name":"Study","short_code":"study","desc":"No+Ms.+Scarlet!","exits":["south","east"],"hasMonster":true,"hasTreasure":true,"start":false},"library":{"name":"Library","short_code":"library","desc":"Books+galore,+no+candlesticks.","exits":["south","east","west"],"hasMonster":false,"hasTreasure":true,"start":false},"office":{"name":"Office","short_code":"office","desc":"Taking+care+of+business.","exits":["north","east"],"hasMonster":true,"hasTreasure":false,"start":false},"empty_room":{"name":"Empty+Room","short_code":"empty_room","desc":"Nothing+here.+Seriously%2C+there+is+nothing.+Oh%2C+except+that...","exits":["north","south","west"],"hasMonster":true,"hasTreasure":false,"start":false}}}';
        data1 = Utils.proURIDecoder(data1);
        var data = JSON.parse(data1);
        this._deck = data.rooms;

        // Find the starting point of the delve
        this.getStart();

        this.registerEvents();
    }
}