declare var $;
class DelveMap {
	private _xPos = 200;
	private _yPos = 460;
	public setStartPoint(rm) {
        var sp = $('<span />').attr('id', rm.short_code).html(rm.name).css('top', this._yPos + 'px').css('left', this._xPos + 'px');
        $('#map').append(sp);		
	}
	public addRoom(rm: any, direction: any, target) {
		var t = $('#' + target);
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
		console.log('target: ', yPos);
        var sp = $('<span />').attr('id', rm.short_code).html(rm.name).css('top', yPos + 'px').css('left', xPos + 'px');
        $('#map').append(sp);		

	}
	
}