var Engine = (function () {
    function Engine(o) {
        var _this = this;
        this._mappings = {
            '0001': 'haunted_mansion'
        };
        this._onShowHelp = function (e) { return _this.onShowHelp(e); };
        this._world = o.world;
        new Parser();
        // this.registerEvents();
        this.loadThemeConfig(this._mappings[o.world]);
    }
    Object.defineProperty(Engine.prototype, "version", {
        // private _log = (m) => this.onLog(m);
        // Properties
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    // Private Methods
    /**
     * Register events
     */
    Engine.prototype.registerEvents = function () {
        //  var that = this;
        $event.bind('error', this.throwError);
        //  $event.bind('log', this._log);
        $event.bind('displayHelp', this._onShowHelp);
        //  $('#command input').on('focus', function() {
        //    $(this).val('');
        //  });
        //  $('#temp').on('click', this._onShowHelp);
        //  $('#nav header').on('click', function() {
        //    var $nav = $(this).parent();
        //    $nav.animate({
        //      right: parseInt($nav.css('right'), 10) === 0 ? -325 : 0
        //    })
        //  });
    };
    // private onLog(msg) {
    //  console.log('msg:: ', msg);
    //  var val = $('feedback').val();
    //  console.log('val: ', val);
    //  val = val + '\r' + msg;
    //  // $('#feedback').val(val);
    //  // $('#feedback').scrollTop($('#feedback')[0].scrollHeight);
    // }
    Engine.prototype.onShowHelp = function (e) {
        console.log('showing help');
        new Modal({ title: 'Delve Help', msg: ""
                + "It's simple really, you just enter commands into the command bar (the black bar at the bottom of the screen) and things happen."
                + "Currently there are # supported commands:<br />"
                + "<ul>"
                + "<li><i>GO</i> {direction} - where direction is any of the exits listed for the current room (north, south, etc...)</li>"
                + "<li><i>HELP</i> (obviously)</li>"
                + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>"
                + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>"
                + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>"
                + "<li><i>LOOK</i> - Lets you look at various objects in the room. Might be a good way to.... 'find' things. </li>"
                + "</ul>"
        });
    };
    Engine.prototype.loadFile = function (url) {
        // Return a new promise.
        return new Promise(function (resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function () {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };
            // Handle network errors
            req.onerror = function () {
                reject(Error("Network Error"));
            };
            // Make the request
            req.send();
        });
    };
    Engine.prototype.loadThemeConfig = function (theme) {
        var cfg = this.loadFile('environs/' + theme + '/config.json');
        var that = this;
        cfg.then(function (response) {
            var json = JSON.parse(response);
            new RoomManager(json);
            that.injectUI(theme);
        }, function (error) {
            that.throwError('Failed to load theme config: ' + theme);
        });
    };
    Engine.prototype.onDataDump = function () {
    };
    /**
     * Handler for errors that bubble up from the rest of the system
     * @param {String} msg
     */
    Engine.prototype.throwError = function (msg) {
        throw new Error(msg);
    };
    /**
     * Plugs in the CSS link for the proper theme
     */
    Engine.prototype.injectUI = function (theme) {
        var head = document.getElementsByTagName("head")[0];
        var linkNode = document.createElement("link");
        var that = this;
        linkNode.setAttribute('rel', 'stylesheet');
        linkNode.type = "text/css";
        linkNode.href = '/environs/' + theme + '/assets/theme.css';
        head.insertBefore(linkNode, head.firstChild);
        var title = $('title').html();
        console.log('title: ', title);
        // var theme = this._mappings['0001'];
        // theme = theme.split('_');
        // console.log('theme: ', theme);
        // for (var k = 0; k < theme.length; k++) {
        //   theme[k] = theme[k][0].toUpperCase();
        // }
        // console.log('theme: ', theme.join(' '));
    };
    return Engine;
})();
