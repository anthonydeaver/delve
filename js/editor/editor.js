var Editor = (function () {
    function Editor() {
        var _this = this;
        this._onFileChange = function (e) {
            _this.onFileChange(e);
        };
        this._createRoom = function (e) {
            _this.onSaveRoom(e);
        };
        this._updateRoom = function (e) {
            _this.onUpdateRoom(e);
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
        var that = this;
        $('#roomList div').html('');
        for (var i in this._rooms) {
            var rm = this._rooms[i];
            var li = $('<li />').attr('id', i).text(this._rooms[i].name);
            li.append($('<a />').attr('href', '/').attr('id', this._rooms[i].id).html('[edit]'));
            $('#roomList div').append(li);
            $('#roomList a').on('click', function (e) {
                e.preventDefault();
                that.onEditRoom($(this).attr('id'));
            });
        }
    };

    Editor.prototype.onEditRoom = function (id) {
        var rm = this._rooms[id];
        for (var k in rm) {
            var f = $('#roomMaker [name="' + k + '"]');
            f.val(rm[k]);
            if (k == 'hasMonster' && rm[k] === true) {
                $('#roomMaker [name="hasMonster"]').attr('checked', 'checked');
            } else {
                $('#roomMaker [name="hasMonster"]').removeAttr('checked');
            }
            if (k == 'hasTreasure' && rm[k] === true) {
                $('#roomMaker [name="hasTreasure"]').attr('checked', 'checked');
            } else {
                $('#roomMaker [name="hasTreasure"]').removeAttr('checked');
            }
        }
        $('#roomMaker #create').hide();
        $('#roomMaker #update').show();
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

    Editor.prototype.onUpdateRoom = function (e) {
    };

    Editor.prototype.onSaveRoom = function (e) {
        e.preventDefault();
        var required = ['name', 'desc'];
        var str = $('#roomMaker').serialize();
        var t = this.queryToObj(str);
        var URID = t.name.replace(/\W/g, '_').toLowerCase();
        var r = this._rooms[URID] || {};
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

        r.name = t.name.replace(/\+/g, ' ');
        r.id = URID;
        r.desc = t.desc.replace(/\+/g, ' ');
        r.exits = [];
        r.connections = {};
        r.gridCoord = [];

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

        this._rooms[r.id] = r;

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
        $('#roomMaker #save').on('click', this._createRoom);
        $('#roomMaker #clear').on('click', function (e) {
            e.preventDefault();
            Utils.resetForm($('#roomMaker'));
        });
        $('#export').on('click', this._saveRooms);
    };
    return Editor;
})();
