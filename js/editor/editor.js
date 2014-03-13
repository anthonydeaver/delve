/// <reference path="jquery.d.ts" />

var r;

function setStat(user, stat, value) {
    user[stat] = value;
}

var u = { stats: { hp: 0 } };
setStat(u, "hp", 10);

// User.stats.hp = 0;
var Engine;
(function (Engine) {
    function parseConfig() {
    }
    function log(str) {
    }
    Engine.log = log;
    function start() {
    }
    Engine.start = start;
})(Engine || (Engine = {}));

var e = Engine;

e.start();

var M;
(function (M) {
    M.a = 1;
})(M || (M = {}));

// var iEngine {
var Engine2 = (function () {
    function Engine2(start) {
        this.start = start;
        this.DEBUG = true;
        this._modalPanel = $('<div>').attr('id', 'modal').addClass('eventPanel').css('opacity', '0');
    }
    Engine2.prototype.createButton = function (config) {
        // var func: ();
        return this._modalPanel;
    };
    return Engine2;
})();

// class User extends Engine {}
var Student = (function () {
    function Student(firstname, middleinitial, lastname) {
        this.firstname = firstname;
        this.middleinitial = middleinitial;
        this.lastname = lastname;
        this.fullname = firstname + " " + middleinitial + " " + lastname;
    }
    return Student;
})();

function greeter(person) {
    return "Hello, " + person.firstname + " " + person.lastname;
}

var user = new Student("Jane", "M.", "User");
