(function() {
	var Module = Engine.Module = function Module () {
		this.view = new Engine.View();
	}

	Engine.extend(Module.prototype, Engine.Events, {
		trace: function () { console.log('Party time!'); }
	});
})();