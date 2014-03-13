/// <reference path="jquery.d.ts" />

interface User {
	stats: {
		hp: number 
	};
	// stats.hp: number;
}

interface Room {
	start: string;
	// id: string;
	// name:  string;
	// desc:  string;
}

var room: Room;

var r = {start: "new"};

room = r;

// var r: new() => Room;

// r.start = "new";


function setStat(user: User, stat: string, value: any) {
	user[stat] = value;
}

var u = { stats: { hp: 0 } };
setStat(u, "hp", 10)

// User.stats.hp = 0;

module Engine {
	function parseConfig() {}
	export function log(str: string) {}
	export function start() {}
}

var e = Engine;

e.start();

module M { 
 export interface P { x: number; y: number; } 
 export var a = 1; 
} 

var m = M;

// var iEngine {
class Engine2 {
	'use strict';
	DEBUG = true;

	_modalPanel = $('<div>').attr('id', 'modal').addClass('eventPanel').css('opacity', '0');
	constructor(public start) {

	}
	createButton(config: Object) {
		// var func: ();
		return this._modalPanel;
	}
}

// class User extends Engine {}




class Student {
    fullname : string;
    constructor(public firstname, public middleinitial, public lastname) {
        this.fullname = firstname + " " + middleinitial + " " + lastname;
    }
}

interface Person {
    firstname: string;
    lastname: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstname + " " + person.lastname;
}

var user = new Student("Jane", "M.", "User");

