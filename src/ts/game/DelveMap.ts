declare var $;
declare var $event;


/*
map.addRoom(rm);

 */
class DMap {
	private _map: HTMLElement;
	private _level: number = 0;

	get level () {
		return this._level;
	}

	private registerEvents() {
		$event.emit('log', 'registering map events');
		var toggle = function() {
			$('#map').toggle();
			$(this).html($('#map').is(':visible') ? 'Close Map' : 'Open Map')
		};

		$event.bind('togglemap', toggle);
		//$event.bind('gotoLevel', this._onGotoLevel);
		$('#BTN_MAP_TOGGLE').on('click', toggle);
	}

	private addExits(yPos, xPos, rm) {
		var txt;
        for(var x = 0; x < rm.exits.length; x++) {
        	var top = yPos, left = xPos;
			var marker = $('<span />').addClass(rm.exits[x]).attr('type','directional');
			if(rm.exits[x] === 'north') { top = yPos - 20; txt = '|'; }
			if(rm.exits[x] === 'south') { top = yPos + 20; txt = '|'; }
			marker.css('top', top);
			if(rm.exits[x] === 'west') { left = xPos - 59; txt = '&mdash;'; }
			if(rm.exits[x] === 'east') { left = xPos + 61; txt = '&mdash;'; }
			marker.css('left', left);
			if(rm.exits[x] === 'down') { top = yPos + 20; left = xPos - 59; txt = '/'; }
			if(rm.exits[x] === 'up') { top = yPos - 20; left = xPos + 61; txt = '/'; }
			marker.css('left', left);
			marker.css('top', top);
			marker.html(txt);
			$(this._map).append(marker);
        }

        // Attempt to keep the current location centered in the map
        this.centerMap(yPos, xPos);
    }

    private centerMap(yPos, xPos) {
        $(this._map).css('top',-(yPos - 200));
        $(this._map).css('left',-(xPos - 200));
	}

	private shorten(name) {
		var arr = name.split(' ');
		var ret = arr[0][0] + '.' + arr[1];
		return ret;
	}


	/*
	Level management:
	1. rooms manager calls for changing levels (this.changeLevel(n))
		- if n is > than _level, shift everything down and to the left by 40px
		- if n < than _level, shift everything up and to the right 40px

		$('.wrapper').each(function() { 
console.log('found'); 
var lvl = parseInt($(this).attr('level'),10);
//console.log('n: ', lvl);
var op = 0.1;
if(lvl === n) op = 1;
$(this).animate({top:"-+40",left:"+=40",opacity:op},500, function(){});
});
	 */

	private goUp() {}
	private goDown() {}

	private createLevel() {
		var lvl = this._level;
		console.log('lvl: ', lvl);
		var g = $('#map article[level="'+ lvl+'"] div');
		if(g.length == 0) {
			// lvl = this._level++
			var map = $('#map');
			var art = $('<article />').attr('class','wrapper').attr('level',lvl).data('type','level');
			var cont = $('<div />');
			art.append(cont);
			$(map).append(art);
			g = $('#map article[level="'+ lvl+'"] div');
		}
		this._map = g;

		//this._level
	}

	public gotoLevel(dir: string) {
		var g = $('#map article[level="'+ this._level +'"]');
		var params = {top:'', left: '', opacity: 0.1};
		if(dir === 'up') { 
			this._level++; 
			params.top = "+=40";
			params.left = "-=40";
		} else if(dir === 'down') { 
			this._level--; 
			params.top = "-=40";
			params.left = "+=40";
		}
		//$(g).css('opacity','0.1');
		//$(g).animate(params, 500, function(){});
		
		this.createLevel();
		$('.wrapper').each(function() { 
			//console.log('found'); 
			var lvl = parseInt($(this).attr('level'),10);
			//console.log('n: ', lvl);
			//var op = 0.1;
			if(lvl === this._level) params.opacity = 1;
			$(this).animate(params,500, function(){});
		});
	}
	public gotoLevel2(d: string) {
		var lvl = this._level;
		var params = {top:'', left: '', opacity: 0.1};
		if(d === 'up') {
			this._level++;
			this.goUp();
		}
		if(d === 'down') {
			this.goDown();
		}

		this.createLevel();


	}
	public newLevel(dir) {
		var g = $('#map article[level="'+ this._level +'"]');
		var params = {top:'', left: '', opacity: 0.1};
		if(dir === 'up') { 
			this._level++; 
			params.top = "+=40";
			params.left = "-=40";
		} else if(dir === 'down') { 
			this._level--; 
			params.top = "-=40";
			params.left = "+=40";
		}
		//$(g).css('opacity','0.1');
		$(g).animate(params, 500, function(){});
		this.createLevel();
	}

	public shiftView(direction: string, id: string) {
		var xPos = parseInt($('#' + id).css('left'), 10);
		var yPos = parseInt($('#' + id).css('top'), 10);
        switch(direction) {
            case 'north':
                yPos -= 40;
                break;
            case 'east':
                xPos += 120;
                break;
            case 'south':
                yPos += 40;
                break;
            case 'west':
                xPos -= 120;
                break;
          default:
          		break;
        }
        this.centerMap(yPos, xPos);
	}

	public addRoom(rm: any, direction: any, target) {
		console.log('mapping ', rm.id);
		var t, xPos, yPos;
		var txt;
		if(target === null) { // This is the starting room
			xPos = 1080;
			yPos = 1500;
		} else {
			t = $('#' + target);
			xPos = parseInt($(t).css('left'), 10);
			yPos = parseInt($(t).css('top'), 10);
		}
        switch(direction) {
            case 'north':
                yPos -= 40;
                break;
            case 'east':
                xPos += 120;
                break;
            case 'south':
                yPos += 40;
                break;
            case 'west':
                xPos -= 120;
                break;
          default:
          		break;
        }
        var name = (rm.name.length > 8) ? this.shorten(rm.name) : rm.name;
        var sp = $('<span />').attr('id', rm.id).attr('type','room').html(name).css('top', yPos + 'px').css('left', xPos + 'px');
        console.log('sp: ', this._map);
       	$(this._map).append(sp);		

        // Add in the direction markers
        this.addExits(yPos, xPos, rm);
	}

	constructor(lvl: number) {
		this._level = lvl;
		this.createLevel();
		//this._map = $('#map article[level="1"] div');
		this.registerEvents();
	}	
}