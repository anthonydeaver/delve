function queryToObj(str) {
	var arr = str.split('&'),
		len = arr.length,
		obj = {},
		val = [],
		i;

	for(i= 0; i < len; i++) {
		val = arr[i].split('=');
		obj[val[0]] = val[1];
	}

	return obj;
}