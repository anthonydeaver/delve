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
        this._rooms = {};
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

        for (var i in this._rooms) {
            var rm = this._rooms[i];
            console.log('rm: ', rm);
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
        var valid = true;

        for (var x = 0; x < required.length; x++) {
            console.log(required[x] + ": " + t[required[x]].length);
            if (t[required[x]].length < 1) {
                this.alert('Missing Required field: ' + required[x]);
                valid = false;
            }
        }
        if (!valid)
            return;

        r.name = t.name;
        r.short_code = t.name.replace(/\W/g, '_').toLowerCase();
        r.desc = t.desc;

        //r.short_code = r.name.toLowerCase()://replace(/\+/g,' ');
        r.exits = [];
        r.connections = {};

        var exits = $("input[name='exits']:checked");
        for (var e = 0; e < exits.length; e++) {
            r.exits.push(exits[e].value);
        }

        if (r.exits.length === 0) {
            this.alert('Rooms require exits');
            return;
        }

        // Set Defaults
        r.hasMonster = (t.hasMonster === "on");
        r.hasTreasure = (t.hasTreasure === "on");

        r.start = (t.start === "on");
        if (r.start) {
            for (var i = 0; i < this._rooms.length; i++) {
                this._rooms[i].start = false;
            }
        }

        this._rooms[r.short_code] = r;

        Utils.resetForm($('#roomMaker'));
        this.listRooms();
    };

    Editor.prototype.saveRoomsFile = function () {
        var o = JSON.stringify({ "rooms": this._rooms });
        var b = new Blob([o], { type: 'text/json' });
        saveAs(b, "rooms.json");
        this.tell('Rooms saved');
    };
    Editor.prototype.alert = function (msg) {
        var alt = $('<div />').addClass('alert').html(msg);
        $('#console').append(alt);
        $('.alert').fadeOut(5000);
    };
    Editor.prototype.tell = function (msg) {
        var alt = $('<div />').addClass('notice').html(msg);
        $('#console').append(alt);
        $('.notice').fadeOut(5000);
    };

    Editor.prototype.registerEvents = function () {
        console.log('registering events');
        $('#files').on('change', this._onFileChange);
        $('#roomMaker #create').on('click', this._createRoom);
        $('#save').on('click', this._saveRooms);
    };
    return Editor;
})();
