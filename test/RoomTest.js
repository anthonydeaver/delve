	var RMConfig = {
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
	};
QUnit.test( "hasExit() Test", function( assert ) {
	var rm = new Engine.Room(RMConfig);
	assert.equal(false, rm.hasExit('west'), "Test for incorrect exit.");
	assert.equal(true, rm.hasExit('north'), "Test for correct exit.");
});

QUnit.test( "get() Test", function( assert ) {
	var rm = new Engine.Room(RMConfig);
	assert.equal('Library', rm.get('name'), "Test for 'get' method.")
});

QUnit.test( "set() Test", function( assert ) {
	var rm = new Engine.Room(RMConfig);
	assert.equal('Library', rm.get('name'), "Test that name is currently 'Library'.")
	rm.set('name', 'Drawing Room');
	assert.equal('Drawing Room', rm.get('name'), "Test that name is now currently 'Drawing Room'.")
});

QUnit.test( "rotateExits() Test", function( assert ) {
	var rm = new Engine.Room(RMConfig);
	assert.equal('north', rm.get('exits')[0], "Test the first exit is 'north'.")
	rm.rotateExits();
	assert.equal('east', rm.get('exits')[0], "Test the first exit is now 'east'.")
});

/*
QUnit.test( "hasExit Test", function( assert ) {
	var rm = new Engine.Room(RMConfig);
});
*/