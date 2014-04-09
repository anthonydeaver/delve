// declare var $;
// declare var rooms;
// module $delve {
// 	export function shuffle(o){
// 		 for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
//             ;
//         return o;
// 	}
// }
var Utils = (function () {
    function Utils() {
        this.that = 'that';
        this.test = 'test';
        this.test2 = 'test2';
    }
    Utils.shuffle = function (o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
        return o;
    };
    Utils.loadFile = function (fn, callback) {
    };
    Utils.resetForm = function ($form) {
        $form.find('input:text, input:password, input:file, select, textarea').val('');
        $form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    };

    Utils.proURIDecoder = function (val) {
        val = val.replace(/\+/g, '%20');
        var str = val.split("%");
        var cval = str[0];
        for (var i = 1; i < str.length; i++) {
            cval += String.fromCharCode(parseInt(str[i].substring(0, 2), 16)) + str[i].substring(2);
        }

        return cval;
    };
    return Utils;
})();
