/// <reference path="libs/qunit.d.ts" />

// QUnit.test('room', function() {
// 	window.$event = new Events(); 
// 	var rm = new Rooms('haunted_mansion');
// 	var res = rm.getStartingRoom();
// 	ok( 1 == "1", "Passed!" );
// });

// QUnit.module('Delve Engine', {
// 	setup: function() {
// 		var result = this.result = [];
// 		this.createHandler = function(id) {
//         return function() {
//           result.push([id].concat([].slice.call(arguments, 1)));
//         };
//       };
// 	}
// });

QUnit.test('Delve Engine', function() {
	var delve = new Engine();
	equal('0.0.1', delve.version);

	raises(function() {
		delve.throwError('fail to succeed');
		}, Error, 'Must fail to succeed');
});


