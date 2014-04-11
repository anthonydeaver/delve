var Eventer = (function () {
    function Eventer() {
        this._callbacks = {};
    }
    Eventer.prototype.addListener = function (name, callback) {
        if (!this._callbacks[name]) {
            this._callbacks[name] = [];
        }
        this._callbacks[name].push(callback);
    };

    Eventer.prototype.removeListener = function (name, callback) {
        for (var i = 0; i < this._callbacks[name]; i++) {
            if (this._callbacks[name][i] == callback) {
                this._callbacks[name].splice(i, 1);
                return;
            }
        }
    };

    Eventer.prototype.triggerEvent = function (name, args) {
        if (this._callbacks[name]) {
            for (var i = 0; i < this._callbacks[name].length; i++) {
                this._callbacks[name][i](args);
            }
        }
    };
    return Eventer;
})();
