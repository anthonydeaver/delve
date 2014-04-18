declare var $;
declare var $event;

class DelveMap {
	private _map: HTMLElement;
	private _level: number = 0;

	private _onAddLevel = (e) => { this.addLevel(); }

	private registerEvents() {
		$event.emit('log', 'registering map events');
		var toggle = function() {
			$('#map').toggle();
			$(this).html($('#map').is(':visible') ? 'Close Map' : 'Open Map')
		};

		$event.bind('togglemap', toggle);
		$('#BTN_MAP_TOGGLE').on('click', toggle);
		$('#BTN_MAP_LEVEL').on('click', this._onAddLevel);
	}

	private addLevel() {
		this._level++;
		var map = $('#map');
		var lvl = $('<article />').attr('id','wrapper').attr('level',this._level);
		var cont = $('<div />');
		lvl.append(cont);
		$(map).append(lvl);
		//this._map = $(cont);

	}
	private init() {
		this.addLevel();
		this._map = $('#map article[level="1"] div');

	}
	public setStartPoint(rm) {
		var xPos = 1080;
		var yPos = 1500;
        var sp = $('<span />').attr('id', rm.id).html(rm.name).css('top', yPos + 'px').css('left', xPos + 'px');
        $(this._map).append(sp);
        this.addExits(yPos, xPos, rm);		
	}
	public addRoom(rm: any, direction: any, target) {
		var t = $('#' + target);
		var txt;
		var xPos = parseInt($(t).css('left'), 10);
		var yPos = parseInt($(t).css('top'), 10);
		console.log('target: ', yPos);
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
        }
        var name = (rm.name.length > 8) ? this.shorten(rm.name) : rm.name;
        var sp = $('<span />').attr('id', rm.id).html(name).css('top', yPos + 'px').css('left', xPos + 'px');
       	$(this._map).append(sp);		
        // Add in the direction markers
        this.addExits(yPos, xPos, rm);

	}

	private addExits(yPos, xPos, rm) {
		var txt;
        for(var x = 0; x < rm.exits.length; x++) {
        	var top = yPos, left = xPos;
			var marker = $('<span />').addClass('direction ' + rm.exits[x]).css('border','none');
			if(rm.exits[x] === 'north') { top = yPos - 20; txt = '|'; }
			if(rm.exits[x] === 'south') { top = yPos + 20; txt = '|'; }
			marker.css('top', top);
			if(rm.exits[x] === 'west') { left = xPos - 59; txt = '&mdash;'; }
			if(rm.exits[x] === 'east') { left = xPos + 61; txt = '&mdash;'; }
			marker.css('left', left);
			marker.html(txt);
			$(this._map).append(marker);
        }

        // Atempt to keep the current location centered in the map
        // $(this._map)[0].scrollTop = $(this._map)[0].scrollheight;
        // New center point of 
        // top: -1310
        // left: -880
        // var w = $('#map article').width();
        // var h = $('#map article').height();
        // console.log('scrollLeft: ', (xPos - 50) - (w / 2));
        // console.log('scrollTop: ', (yPos) - (h / 2));
        // $('#map article')[0].scrollLeft = (xPos + 50) - (w / 2);
        // $('#map article')[0].scrollTop = (yPos) - (h / 2);
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