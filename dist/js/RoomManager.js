(function (){
	var rm = new Engine.Room({
    "name":"Library",
    "id":"library",
    "desc":"Lots and lots of books. Perhaps there is something here that will help. Or, perhaps not.",
    "exits":[
       "north",
       "south",
       "east"
    ],
    "links":{

    },
    "position":[

    ],
    "hasMonster":false,
    "hasTreasure":true
	});
console.log('nw room: ', rm.hasExit('west'));
console.log('nw room: ', rm.hasExit('north'));
})();