/// <reference path="libs/qunit.d.ts" />

// QUnit.test('room', function() {
// 	window.$event = new Events(); 
// 	var rm = new Rooms('haunted_mansion');
// 	var res = rm.getStartingRoom();
// 	ok( 1 == "1", "Passed!" );
// });

QUnit.module('Delve Events', {
	setup: function() {
		var result = this.result = [];
		this.createHandler = function(id) {
        return function() {
          result.push([id].concat([].slice.call(arguments, 1)));
        };
      };
	}
});

QUnit.test('handler order', function() {
	window.$event = new Events(); 
	$event.bind('order', this.createHandler('order1'));
	$event.bind('order', this.createHandler('order2'));
	$event.emit('order');
	deepEqual(this.result,[
		['order1'],
		['order2']
		], "event handlers are fired in the other they were created");
});

QUnit.test('arguments', function() {
	window.$event = new Events(); 
    $event.bind('arguments', this.createHandler('arguments1'));
    $event.bind('arguments', this.createHandler('arguments2'));
    $event.bind('arguments', this.createHandler('arguments3'));
    $event.emit('arguments', 'gone');
    deepEqual(this.result, [
      ['arguments1', 'gone'],
      ['arguments2', 'gone'],
      ['arguments3', 'gone']
    ], 'handlers should receive all passed arguments.');
  });