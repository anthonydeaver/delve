var DelveMap = (function () {
    function DelveMap() {
        this.registerEvents();
    }
    DelveMap.prototype.registerEvents = function () {
        $event.emit('log', 'registering map events');
        $event.bind('togglemap', function () {
            $('#map').toggle();
            $(this).html($('#map').is(':visible') ? 'Close Map' : 'Open Map');
        });
        $('#BTN_MAP_TOGGLE').on('click', function () {
            $('#map').toggle();
            $(this).html($('#map').is(':visible') ? 'Close Map' : 'Open Map');
        });
    };
    DelveMap.prototype.setStartPoint = function (rm) {
        var xPos = 200;
        var yPos = 460;
        var sp = $('<span />').attr('id', rm.id).html(rm.name).css('top', yPos + 'px').css('left', xPos + 'px');
        $('#map').append(sp);
        this.addExits(yPos, xPos, rm);
    };
    DelveMap.prototype.addRoom = function (rm, direction, target) {
        var t = $('#' + target);
        var txt;
        var xPos = parseInt($(t).css('left'), 10);
        var yPos = parseInt($(t).css('top'), 10);
        console.log('target: ', yPos);
        switch (direction) {
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
        var sp = $('<span />').attr('id', rm.id).html(rm.name).css('top', yPos + 'px').css('left', xPos + 'px');
        $('#map').append(sp);

        // Add in the direction markers
        //
        this.addExits(yPos, xPos, rm);
    };

    DelveMap.prototype.addExits = function (yPos, xPos, rm) {
        var txt;
        for (var x = 0; x < rm.exits.length; x++) {
            var top = yPos, left = xPos;
            var marker = $('<span />').addClass('direction ' + rm.exits[x]).css('border', 'none');
            if (rm.exits[x] === 'north') {
                top = yPos - 20;
                txt = '|';
            }
            if (rm.exits[x] === 'south') {
                top = yPos + 20;
                txt = '|';
            }
            marker.css('top', top);
            if (rm.exits[x] === 'west') {
                left = xPos - 59;
                txt = '&mdash;';
            }
            if (rm.exits[x] === 'east') {
                left = xPos + 61;
                txt = '&mdash;';
            }
            marker.css('left', left);
            marker.html(txt);
            $('#map').append(marker);
        }
    };
    return DelveMap;
})();
