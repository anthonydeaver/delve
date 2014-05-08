declare var $;
class RoomManager {

  private _deck: any = [];
  private _rooms: any = {};
  private _map: any;
  private _currentRoom: Room = null;
  private _startRoom: Room = null;
  private _gridCoord = {x:0, y:0, z:0};
  private _mapGrid: any = [];
  private _shuffle: boolean = true;


  private _gotoRoom = (e) => { this.onDirectionSelected(e); }
  private _onDataDump = (e) => { this.onDataDump(); }

  private onDataDump() {
      var len = this._mapGrid.length;
      console.log('+++++++++++++++++++++++++++++++++');
      console.log('Map Grid:');
      for(var i = 0; i < len; i++) {
          console.log('arr['+i+']: ', this._mapGrid[i].toString());
      }
      console.log('current grid coords: ', this._gridCoord);
      console.log('active room: ', this._currentRoom.id);
      console.log('>>> Deck:', this._deck.toString());
      console.log('>>> Rooms:', this._rooms);
      console.log('+++++++++++++++++++++++++++++++++');
  }

  private resetGame() {
      this._currentRoom = null;
      this._deck = [];
      this._mapGrid = null;
      for(var i in this._rooms) {
          this._deck.push(i);
      }
  }

  private setStartingRoom() {
      for(var i in this._rooms) {
          if(this._rooms[i].start) {
              this._startRoom = this._rooms[i];
          }
      }
      if(this._startRoom === null) { $event.emit('error','Failed to set start room'); }
  }

  /*
      The grid is twice as wide as the number of rooms simply to account for the (remote)
      possibility that all the rooms lay out in a completely horizontal pattern.
       The chances of it happening are close to nil, but....
  */
  private initGrid(rm) {
      var len = 0, offset = 0;
      len = (this._deck.length + 1);
      this._gridCoord.x = this._gridCoord.y = len;
      this._mapGrid = this.generateGrid(len * 2);
      this._mapGrid[len][len] = rm.id;
  }

  private setUp() {
      this.setStartingRoom();
      this._deck = Object.keys(this._rooms);
      if(this._shuffle) {
        this._deck = Utils.shuffle(this._deck);
      }
      // Remove the starting room from the '_deck' but not the _rooms
      var idx = this._deck.indexOf(this._startRoom.id);
      this._deck.splice(idx, 1);
      this.initGrid(this._startRoom);
      // insert into map
      this._map.addRoom(this._startRoom, null, null);

      // Starting spot is always 0,0,0 per Sheldon Cooper (RE: removed time index. For now ;) )
      this._currentRoom = this._startRoom;
      this._currentRoom.render();
  }

  private t() {}

  // creates an x by x grid for the map where 'x' is the number of rooms/cards in the deck
  private generateGrid(size: number) {
      var arr = new Array(size);
      for(var x = 0; x < size; x++) {
          arr[x] = new Array(size);
      }
      console.log('done');
      return arr;
  }

  private getPolar(dir):string {
      var polar = {
          'north':'south',
          'south':'north',
          'east' :'west',
          'west' :'east'
      };
      return polar[dir];
  }
  /**
   * Executed when a valid direction to travel is selected
   * THis thing is way too large and unwieldy. Need to break it up.
   * @param {string} dot Direction selected by the user (i.e. 'north')
   */
  private onDirectionSelected(dot: string) {

      // Make sure the active room has that exit available
      console.log('>>>: ', this._currentRoom.exits.indexOf(dot));
      if(this._currentRoom.exits.indexOf(dot) === -1) {
          $event.emit('nojoy', "You can't go that way.");
          return;
      }
      var rm;
          // set map coordinates
          switch(dot) {
              case 'north' :
                  this._gridCoord.y--;
                  break;
              case 'south' :
                  this._gridCoord.y++;
                  break;
              case 'east' :
                  this._gridCoord.x++;
                  break;
              case 'west' :
                  this._gridCoord.x--;
                  break;
          }
      //First, check the current room for active connections for the selected direction
      if(this._currentRoom.links[dot]) {
          // already have a connection
          rm = this._currentRoom.links[dot];
          this._map.shiftView(dot, this._currentRoom.id);
          this._currentRoom = rm;
          this._currentRoom.render();

          return;
      } else {
          if(!this._deck.length) {
              $event.emit('nojoy', 'That exit is sealed by some unknown force.');
          }
          rm = this.selectNewRoom(dot);
          if(!rm) { $event.emit('error','Failed to load new room!'); }

          // Set up the links from the exiting room to the entering room and visa-versa
          this._currentRoom.links[dot] = rm;
          rm.links[this.getPolar(dot)] = this._currentRoom;

          this._mapGrid[this._gridCoord.y][this._gridCoord.x] = rm.id;
          if(this.scanGrid(rm, dot)) {
            /* draw on the map */
            this._map.addRoom(rm, dot, this._currentRoom.id);
            this._currentRoom = rm;
            this._currentRoom.render();
          } else {
            console.log('failed to check connections')
          }
      }
  }

  /**
   * Go through possible exits and look for existing rooms on the grid in that
   * direction and make the necessary links.
   * If the adjoining room doesn't have an exit to match, remove the new rooms 
   * corresponding exit. Might cause some rooms to only have a single entrance/exit
   * @param {object} rm Room to scan
   */
  private scanGrid(rm: any, dot: string) {
    // console.log('scanning around ', rm.id);
    /*
        - look at room in all 4 adjacent locations
        - if adjacent room doesn't have a link, remove this rooms cooresponding exit. Or,
        - if adjacent room doesn't have a link, shift this rooms cooresponding exit to another available direction.

        - if adjacent room has an exit but this room doesn't, add one to this room. Or,
        - if adjacent room has an exit, attempt to relocate one this rooms exits from another, unlinked, direction.

    */
    var dirs = ['north', 'south','east','west'];
    for( var i = 0; i < dirs.length; i++) {
        var testDir = dirs[i];
        var testPolar =this.getPolar(testDir);
        var tRoom = 'xxx';
        // console.log('testing: ', testDir);
        if(testDir == dot) { continue; } // skip the incoming exit, we know about that one.
        switch(testDir) {
            case 'north':
                tRoom = this._mapGrid[this._gridCoord.y - 1][this._gridCoord.x];
                break;
            case 'south':
                tRoom = this._mapGrid[this._gridCoord.y + 1][this._gridCoord.x];
                break;
            case 'east':
                tRoom = this._mapGrid[this._gridCoord.y ][this._gridCoord.x + 1];
                break;
            case 'west':
                tRoom = this._mapGrid[this._gridCoord.y ][this._gridCoord.x - 1];
                break;
            default:
                break;
        }
        var iRoom: Room = this._rooms[tRoom];
        console.log('iRoom: ', tRoom);


        if(iRoom) {
            // Test if rm has an exit in the opposite of the testing direction
            // console.log('testing if ' + iRoom.id + ' has an entrance to the '+ testPolar);
            if(iRoom.hasExit(testPolar)) {
                // console.log('it does.');
                if(!rm.hasExit(testDir)) {
                    // console.log('Room has no matching exit, adding one.');
                    rm.exits.push(testPolar);
                }
                rm.links[testDir] = iRoom;
                iRoom.links[testPolar] = rm;
            } else {
                // console.log('it does not. Removing exit from this room.');
                var idx = rm.exits.indexOf(testDir);
                rm.exits.splice(idx, 1);
            }
        }
    }            
    return true;
  }

  /**
   * Selects a new froom from the _rooms.
   * @param {string} e [description]
   */
  private selectNewRoom(e: string) {
    console.log('exit: ', e);
      if(!this._deck.length) {
          $event.emit('error', 'no more rooms');
      }
      var r = this._deck.shift();
      var rm = this._rooms[r];

      if(rm.hasExit(this.getPolar(e))) { 
          return rm; //Good as is
      }

      // This executes in the event that the new room doesn't have an 
      // entrance that matches to the current rooms exit.
      // For example the user is going north, but the new room doesn't have a south exit.
      var that = this;
      var cnt = 0;

      function memoizer(rm) {
          var recur = function(d) {
              rm.rotateExits();
              if(!rm.hasExit(that.getPolar(d))) {
                  rm = recur(d);
              }
              return rm
          };
          return recur;
      }

      var test = memoizer(rm);
      return test(e);
  }

  private init() {

  }

  private registerEvents() {
      $event.bind('gotoRoom', this._gotoRoom);
      $event.bind('dump', this._onDataDump);
  }

  // Public Methods
  public getStartRoom() {
      return this._startRoom;
  }

  // constructor(filename, handler?: any) {
  //     // The handler callback is strictly for unit testing
  //     this._map = new DMap();
  //     var that = this;
  //     $.getJSON(filename, function(data) {
  //         var rooms = data.rooms;
  //         var cnt = 0;
  //         for(var idx in rooms) {
  //             that._rooms[idx] = new Room(rooms[idx]);
  //             cnt++;
  //         }
  //         //that._mapGrid = that.generateGrid(cnt * 2);
  //         that.setUp();

  //         that.registerEvents();
  //     }).done(function() {
  //         if(handler) handler();
  //     }).fail(function() {
  //         console.log('failed'); 
  //         if(handler) handler();
  //     });
  // }
  constructor(config, handler?: any) {
      // The handler callback is strictly for unit testing
      this._map = new DMap();
      // Settings
      if(config.shuffle) { this._shuffle = config.shuffle; }
      var rooms = config.rooms;
      for(var idx in rooms) {
          this._rooms[idx] = new Room(rooms[idx]);
      }
      this.setUp();

      this.registerEvents();

  }
}