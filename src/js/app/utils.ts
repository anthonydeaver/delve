// declare var $;
// declare var rooms;

class Utils {
	that = 'that';
	private test = 'test';
	public test2 = 'test2';
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

	static proURIDecoder(val) {
	  val=val.replace(/\+/g, '%20');
	  var str=val.split("%");
	  var cval=str[0];
	  for (var i=1;i<str.length;i++)
	  {
	    cval+=String.fromCharCode(parseInt(str[i].substring(0,2),16))+str[i].substring(2);
	  }

	  return cval;
	}

}