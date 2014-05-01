/// <reference path="libs/qunit.d.ts" />
QUnit.test('Delve Engine', function () {
    var delve = new Engine({'world': '0001'});
    equal('0.0.0.1', delve.version);

    raises(function () {
        delve.throwError('fail to succeed');
    }, Error, 'Must fail to succeed');
});

QUnit.test('Parser: declareNoJoy', function() {
    var parser = new Parser();
    parser.declareNoJoy();
    var feedback = document.getElementById('feedback');
    ok(feedback.innerHTML, 'non empty string result');
    // console.log('feedback: ', feedback.innerHTML);
});

QUnit.test('Parser: declareCantDo(go)', function() {
    var parser = new Parser();
    parser.declareCantDo('go','Taco');
    var feedback = document.getElementById('feedback');
    ok(feedback.innerHTML, 'non empty string result');
});

// QUnit.test('Parser: declareCantDo()', function() {
//     var parser = new Parser();
//     throws(parser.declareCantDo(), "'undefined' is not an object",'Failed');
// });



QUnit.test('Parser: declareCantDo(look)', function() {
    var parser = new Parser();
    parser.declareCantDo('look','Taco');
    var feedback = document.getElementById('feedback');
    ok(feedback.innerHTML, 'non empty string result');
});

QUnit.test('Parser: updateConsole', function() {
    var parser = new Parser();
    parser.updateConsole('This is a simple message');
    var feedback = document.getElementById('feedback');
    equal(feedback.innerHTML, '<br><span>This is a simple message</span>');
});


QUnit.test('Room: ', function() {
	var room = {
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
         "hasTreasure":true,
         "start":false
      };
    var rm = new Room(room);
    equal(rm.name,'Library');
    equal(rm.id,'library');
    equal(rm.start,false);

    //rm.start = true;

    equal(rm.hasExit('west'),false);
    equal(rm.hasExit('east'),true);

    equal(rm.exits[0],'north');
    rm.rotateExits();
    equal(rm.exits[0],'east');

    rm.position = {x:1, y:2, z:3};
    equal(rm.position.x, 1);
});

QUnit.test('RoomManager', function(e) {
	stop();
	// Verify the data loads
	var rm = new RoomManager('../dist/environs/haunted_mansion/rooms.json', function() {
		var r = rm.getStartRoom();
		equal(r.id, 'foyer');
		start();
	});
});