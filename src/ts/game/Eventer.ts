class Events {
	private _callbacks = {};
	public bind(name, callback, context?) {
	    if (!this._callbacks[name]) {
	      this._callbacks[name] = [];
	    }
	    // this._callbacks[name].push({'cb':callback, context:context});
	    this._callbacks[name].push(callback);
	}

	public unbind(name,callback) {
		for (var i = 0; i < this._callbacks[name]; i++) {
			if(this._callbacks[name][i] == callback) {
				this._callbacks[name].splice(i,1);
				return;
			}
		}
	}

	public emit(name, args?: any) {
		if(this._callbacks[name]) {
			for (var i = 0; i < this._callbacks[name].length; i++) {
				this._callbacks[name][i](args);
			}
		}
	}
}