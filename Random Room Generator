// Just for fun
class RoomMaker {

	public init(cnt: number) {
		for(var x = 0; x < cnt; x++) {
			console.log('room: ', this.generateRoom());
		}
	}

  // Move this to the utils
	private generateUUID() {
		return 'xxxxxx_xxxxxx4xxxyx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16); });
	}
	private generateRoom() {
		var room = {
			numExits : 0,
			uuid : '',
			desc: '',
			hasTreasure: false,
			hasMonster: false,
			defaultExits : []
		};

		room.hasTreasure = (Math.round(Math.random())) ? true : false;
		room.hasMonster = (Math.round(Math.random())) ? true : false;
		var numExits: number = parseInt((Math.random() * 4) + 1, 10);
		var exits = ['north','south','east','west'].sort(function() {return 0.5 - Math.random(); });

		for(var x = 0; x < numExits; x++) {
			room.defaultExits.push(exits.shift());
		}

		room.uuid = this.generateUUID();
		room.numExits = numExits;

		return room;
	}
}
/*
var rm = new RoomMaker();
rm.init(5);
*/
