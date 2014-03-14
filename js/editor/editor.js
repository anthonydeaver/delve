var Editor = (function () {
    function Editor() {
        var _this = this;
        this._onFileChange = function (e) {
            _this.onFileChange(e);
        };
        this._submitRoomConfig = function (e) {
            _this.onSubmitRoomConfig(e);
        };
    }
    Editor.prototype.parseRooms = function (data) {
        data = decodeURIComponent(data);
        $('#selector').hide();

        var rooms = JSON.parse(data).rooms;

        for (var i = rooms.length - 1; i >= 0; i--) {
            $('#roomList div').append($('<li />').attr('id', i).text(rooms[i].name));
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

    Editor.prototype.registerEvents = function () {
        $('files').on('change', this._onFileChange);
        $('#roomMaker').on('submit', this._submitRoomConfig);
    };

    // Event Handlers
    Editor.prototype.onFileChange = function (evt) {
        console.log('selected');
        var files = evt.target.files;
        var contents;
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            reader.onload = function (e) {
                contents = e.target.result;
            };
            reader.onloadend = function () {
                this.parseRooms(contents);
            };
            reader.readAsText(f);
        }
    };

    Editor.prototype.onSubmitRoomConfig = function (e) {
        e.preventDefault();

        // e.stopPropagation();
        // console.log('e: ', e);
        var str = $(this).serialize();
        var t = this.queryToObj(str);
        t.id = t.name.replace(/\W/g, '_');
        t.name = t.name.replace(/\+/g, ' ');
        var rooms = { "rooms": [t] };

        var o = JSON.stringify(rooms);
        var b = new Blob([o], { type: 'text/json' });
        saveAs(b, "rooms.json");
    };

    Editor.prototype.init = function () {
        this.registerEvents();
    };
    return Editor;
})();
