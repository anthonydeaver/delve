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
    return Utils;
})();
