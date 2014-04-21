declare var $;
declare var $event;

class DelveMap {
	private _map: HTMLElement;
	private _level: number = 1;

	private _onGotoLevel = (e) => { this.onGotoLevel(this._level + 1); }

	private registerEvents() {
		$event.emit('log', 'registering map events');
		var toggle = function() {
			$('#map').toggle();
			$(this).html($('#map').is(':visible') ? 'Close Map' : 'Open Map')
		};

		$event.bind('togglemap', toggle);
		$event.bind('gotoLevel', this._onGotoLevel);
		$('#BTN_MAP_TOGGLE').on('click', toggle);
	}

	private onGotoLevel(lvl: number) {
		//this._level++;
		var g = $('#map article[level="'+ lvl+'"] div');
		//console.log
		if(g.length == 0) {
			// lvl = this._level++
			var map = $('#map');
			var art = $('<article />').attr('id','wrapper').attr('level',lvl);
			var cont = $('<div />');
			art.append(cont);
			$(map).append(art);
			g = $('#map article[level="'+ lvl+'"] div');
		}
		this._map = g;//$('#map article[level="'+ lvl+'"] div');
		console.log('this._map: ', this._map);

	}
	private init() {
		this.onGotoLevel(this._level);
		this._map = $('#map article[level="1"] div');
	}

	public addRoom(rm: any, direction: any, target) {
		var t, xPos, yPos;
		var txt;
		if(target === null) {
			xPos = 1080;
			yPos = 1500;
		} else {
			t = $('#' + target);
			xPos = parseInt($(t).css('left'), 10);
			yPos = parseInt($(t).css('top'), 10);
		}
		//console.log('target: ', yPos);
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
       	$(this._map).append(sp);		
        // Add in the direction markers
        this.addExits(yPos, xPos, rm);

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
        $(this._map).css('top',-(yPos - 200));
        $(this._map).css('left',-(xPos - 200));
	}

	private changeLevels(o: number, n: number) {
		$('#map article[level="' + o + '"]').fadeTo("slow", 0.1);
		$('#map article[level="' + n + '"]').fadeIn("slow");
	}

	private shorten(name) {
		var arr = name.split(' ');
		var ret = arr[0][0] + '.' + arr[1];
		return ret;
	}

	constructor() {
		//this._map = $('#map article[level="'+ this._level + '"] div');
		this.init();
		console.log('map: ', this._map);
		this.registerEvents();
	}	
}