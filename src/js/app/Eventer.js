var Events = (function () {
    function Events() {
        this._callbacks = {};
    }
    Events.prototype.bind = function (name, callback, context) {
        if (!this._callbacks[name]) {
            this._callbacks[name] = [];
        }

        // this._callbacks[name].push({'cb':callback, context:context});
        this._callbacks[name].push(callback);
    };

    Events.prototype.unbind = function (name, callback) {
        for (var i = 0; i < this._callbacks[name]; i++) {
            if (this._callbacks[name][i] == callback) {
                this._callbacks[name].splice(i, 1);
                return;
            }
        }
    };

    Events.prototype.emit = function (name, args) {
        if (this._callbacks[name]) {
            for (var i = 0; i < this._callbacks[name].length; i++) {
                this._callbacks[name][i](args);
            }
        }
    };
    return Events;
})();
