var Editor = (function () {
    function Editor() {
        var _this = this;
        this._onFileChange = function (e) {
            _this.onFileChange(e);
        };
        this._createRoom = function (e) {
            _this.onCreateRoom(e);
        };
        this._saveRooms = function (e) {
            _this.saveRoomsFile();
        };
        this._form = document.getElementById('roomMaker');
        this._rooms = [];
        this.registerEvents();
    }
    Editor.prototype.handleExistingRooms = function (data) {
        data = decodeURIComponent(data);
        $('#selector').hide();

        // $('#roomList').show();
        // $('#editor').show();
        this._rooms = JSON.parse(data).rooms;
        this.listRooms();
    };

    Editor.prototype.listRooms = function () {
        $('#roomList div').html('');
        for (var i = this._rooms.length - 1; i >= 0; i--) {
            $('#roomList div').append($('<li />').attr('id', i).text(this._rooms[i].name));
        }
    };

    Editor.prototype.queryToObj = function (str) {
        var arr = str.split('&'), len = arr.length, obj = {}, val = [], i;

        for (i = 0; i < len; i++) {
            val = arr[i].split('=');
            obj[val[0]] = val[1];
        }

        return obj;
    };

    // Event Handlers
    Editor.prototype.onFileChange = function (evt) {
        console.log('selected');
        var that = this;
        var files = evt.target.files;
        var contents;
        console.log('parsing...');
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            reader.onload = function (e) {
                contents = e.target.result;
            };
            reader.onloadend = function () {
                that.handleExistingRooms(contents);
            };
            reader.readAsText(f);
        }
    };

    Editor.prototype.onCreateRoom = function (e) {
        e.preventDefault();
        var required = ['name', 'desc'];
        var str = $('#roomMaker').serialize();
        var t = this.queryToObj(str);
        var r = {};

        for (var x = 0; x < required.length; x++) {
            if (t[required[x]].length < 1) {
                this.alert('Missing Required field');
                // return;
            }
        }

        r.name = t.name;
        r.short_code = t.name.replace(/\W/g, '_').toLowerCase();
        r.desc = t.desc;

        //r.short_code = r.name.toLowerCase()://replace(/\+/g,' ');
        r.exits = [];

        var exits = $("input[name='exits[]']:checked");
        for (var e = 0; e < exits.length; e++) {
            r.exits.push(exits[e].value);
        }

        if (r.exits.length === 0) {
            this.alert('Rooms required exits');
        }

        // Set Defaults
        r.hasMonster = t.hasMonster || false;
        r.hasTreasure = t.hasTreasure || false;

        this._rooms.push(r);

        console.log('rooms: ', this._rooms);
        this.listRooms();
        // var o = JSON.stringify({ "rooms" : this._rooms });
        // var b = new Blob([o],{type : 'text/json'});
        // saveAs(b, "rooms.json");
    };

    Editor.prototype.saveRoomsFile = function () {
        var o = JSON.stringify({ "rooms": this._rooms });
        var b = new Blob([o], { type: 'text/json' });
        saveAs(b, "rooms.json");
    };
    Editor.prototype.alert = function (msg) {
        console.log(msg);
        $("#results").append($('<span />').html(msg));
    };

    Editor.prototype.registerEvents = function () {
        console.log('registering events');
        $('#files').on('change', this._onFileChange);
        $('#roomMaker #create').on('click', this._createRoom);
        $('#save').on('click', this._saveRooms);
    };
    return Editor;
})();
