class Eventer {
	private _callbacks = {};
	public addListener(name, callback) {
	    if (!this._callbacks[name]) {
	      this._callbacks[name] = [];
	    }
	    this._callbacks[name].push(callback);
	}

	public removeListener(name,callback) {
		for (var i = 0; i < this._callbacks[name]; i++) {
			if(this._callbacks[name][i] == callback) {
				this._callbacks[name].splice(i,1);
				return;
			}
		}
	}

	public triggerEvent(name, args?: any) {
		if(this._callbacks[name]) {
			for (var i = 0; i < this._callbacks[name].length; i++) {
				this._callbacks[name][i](args);
			}
		}
	}
}