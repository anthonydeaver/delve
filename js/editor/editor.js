var Editor = (function () {
    function Editor() {
        var _this = this;
        this._onFileChange = function (e) {
            _this.onFileChange(e);
        };
        this._submitRoomConfig = function (e) {
            _this.onSubmitRoomConfig(e);
        };
        this._form = document.getElementById('roomMaker');
        this._rooms = [];
        this.registerEvents();
    }
    Editor.prototype.parseRooms = function (data) {
        data = decodeURIComponent(data);
        $('#selector').hide();
        $('#roomList').show();
        $('#editor').show();

        this._rooms = JSON.parse(data).rooms;
        console.log('rooms: ', this._rooms);
        for (var i = this._rooms.length - 1; i >= 0; i--) {
            $('#roomList div').append($('<li />').attr('id', i).text(this._rooms[i].name));
        }
        $("#results").text(data);
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
                that.parseRooms(contents);
            };
            reader.readAsText(f);
        }
    };

    Editor.prototype.onSubmitRoomConfig = function (e) {
        console.log('submitting room');
        e.preventDefault();

        // e.stopPropagation();
        var str = $('#roomMaker').serialize();
        var t = this.queryToObj(str);
        console.log('this: ', this);
        t.name = t.name.replace(/\W/g, '_');
        t['name'] = t['name'].replace(/\+/g, ' ');

        // Set Defaults
        t['hasMonster'] = t['hasMonster'] || false;
        t['hasTreasure'] = t['hasTreasure'] || false;

        this._rooms.push(t);

        var o = JSON.stringify({ "rooms": this._rooms });
        var b = new Blob([o], { type: 'text/json' });
        saveAs(b, "rooms.json");
    };

    Editor.prototype.registerEvents = function () {
        console.log('registering events');
        $('#files').on('change', this._onFileChange);
        $('#roomMaker #save').on('click', this._submitRoomConfig);
    };
    return Editor;
})();
