var Delve = (function () {
    function Delve() {
        this._version = '0.0.1';
        // Temp
        this._d = ['north'];
        this._player = new Player();
        this._player.dumpStats();

        // $.getJSON("rooms.json", function(json) {
        //     console.log(json); // this will show the info it in firebug console
        // });
        // temp
        var data = { "rooms": [{ "name": "Wide+Room", "short_code": "wide_room", "desc": "This+is+a+wide+room", "exits": ["north", "east"], "hasMonster": false, "hasTreasure": true, "start": false }, { "name": "Kitchen", "short_code": "kitchen", "desc": "I+wouldn'r+eat+anything+here", "exits": ["south", "east", "west"], "hasMonster": true, "hasTreasure": false, "start": false }, { "name": "Bedroom", "short_code": "bedroom", "desc": "Where+monsters+sleep.", "exits": [], "hasMonster": true, "hasTreasure": false, "start": false }, { "name": "Shower", "short_code": "shower", "desc": "Because+you've+probably+wet+yourself", "exits": [], "hasMonster": false, "hasTreasure": true, "start": false }, { "name": "Dining+Room", "short_code": "dining_room", "desc": "Monsters+have+to+eat+somewhere", "exits": [], "hasMonster": true, "hasTreasure": false, "start": false }, { "name": "Foyer", "short_code": "foyer", "desc": "This+is+where+it+all+goes+downhill.", "exits": [], "hasMonster": false, "hasTreasure": false, "start": true }] };

        //data = decodeURIComponent(data);
        this._rooms = data.rooms;

        //this._rooms = Utils.shuffle(this._rooms);
        this.getStart();
        console.log('active: ', this._activeRoom);
    }
    // Private Methods
    Delve.prototype.getRoomByIndex = function (id) {
        return this._rooms[id];
    };

    Delve.prototype.getRoomById = function (id) {
        for (var i = 0; i < this._rooms.length; i++) {
            if (this._rooms[i].short_code === id) {
                return this._rooms[i];
            }
        }
        return null;
    };

    Delve.prototype.throwError = function (msg) {
        throw ('>>> Error');
    };

    // Public Methods
    Delve.prototype.getRoomCount = function () {
        return this._rooms.length;
    };

    Delve.prototype.getRoom = function () {
        var polar = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };
        var d = this._d[Math.floor(Math.random() * this._d.length)];

        /*
        - shuffle rooms
        - loop through arry
        - compare room exits with the (opposite) direction of travel
        - match: return room
        - no match: Error.
        */
        console.log('dir: ', d);
        console.log('dir (o): ', polar[d]);
        var rms = Utils.shuffle(this._rooms);
        for (var i = 0; i < rms.length; i++) {
            var rm = this._rooms[i];
            for (var x = 0; x < rm.exits.length; x++) {
                console.log('exit: ', rm.exits[x]);
                if (rm.exits[x] === polar[d]) {
                    this._d = rm.exits;
                    return this._rooms.splice(i, 1)[0];
                    // return rm;
                }
            }
        }
        this.throwError('Failed to find room');
    };
    Delve.prototype.getRoom2 = function () {
        var n = Math.round(Math.random() * (this._rooms.length - 1));
        var polar = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        };
        var d = 'north';
        var newRm = this._rooms[n];
        console.log('new room: ', newRm);
        console.log('dir: ', polar[d]);
        console.log('idx: ', n);
        console.log('len: ', this._rooms.length);
        var validExit = false;
        for (var i = 0; i < newRm.exits.length; i++) {
            if (newRm.exits[i] === polar[d]) {
                return newRm;
            }
        }
        this.getRoom();
    };
    Delve.prototype.getStart = function () {
        for (var i = 0; i < this._rooms.length; i++) {
            if (this._rooms[i].start) {
                this._activeRoom = this._rooms[i].short_code;
                this._rooms.splice(i, 1);
            }
        }
    };
    return Delve;
})();
