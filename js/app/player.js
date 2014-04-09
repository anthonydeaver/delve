var Player = (function () {
    function Player() {
        // Stats
        this._hp = 0;
        this._gold = 0;
        this._skills = [];
        this._treasure = [];
        this._hp = 20;
        this._gold = 5;
        this._skills = [];
        this._treasure = [];
    }
    Player.prototype.getDirection = function () {
        return this._direction;
    };
    Player.prototype.dumpStats = function () {
        console.log('>>>>>>>');
        console.log('Player stats:');
        console.log('HP      : ', this._hp);
        console.log('GOLD    : ', this._gold);
        console.log('SKILLS  : ', this._skills);
        console.log('TREASURE: ', this._treasure);
        console.log('>>>>>>>');
    };

    Player.prototype.move = function (d) {
        this._direction = d;
    };
    return Player;
})();
