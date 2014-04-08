// declare var $;
// declare var rooms;

// module $delve {
// 	export function shuffle(o){
// 		 for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
//             ;
//         return o;
// 	}
// }
class Utils {
	static shuffle(o) {
		 for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
        return o;
	}
	static loadFile(fn, callback) {

	}
	static resetForm($form) {
	    $form.find('input:text, input:password, input:file, select, textarea').val('');
	    $form.find('input:radio, input:checkbox')
	         .removeAttr('checked').removeAttr('selected');
	}

}