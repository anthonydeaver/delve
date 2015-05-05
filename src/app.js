/*
	load config
	load monsters
	load items / treasure
	create user
	start game
*/
var Engine = (function () {
	function Engine() {
		var _this = this;

	}

	Engine.prototype = {
		setTheme: function (theme) {
			this.user = new User();
			this.parser = new Parser();
			this.locus = 'environs/' + theme + '/';
			this.loadRooms();
			this.loadMonsters();
			this.loadItems();
		}
	}
})