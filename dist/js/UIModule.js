(function() {
	var RoomDisplay = Engine.UI.extend({
		el: '#display',
		template: {},
		initialize: function () {
			template = Handlebars.compile(this.el.innerHTML);
			console.log('UIModule initialize')
			Engine.Events.on('room::change', this.render, this)
		},
		render: function (data) { 
			this.el.innerHTML = template(data);
		}
	})

	new RoomDisplay();
})();

(function () {
	var FeedbackDisplay = Engine.UI.extend({
		el: '#feedback',
		initialize: function () {
			Engine.Events.on('new::feedback', this.render, this)
		},
		render: function (d) {
			console.log('this.el: ', this.el);
			// temp
			var txt = document.createElement('span');
			txt.innerHTML = "I have no idea what you are talking about."; 
			this.el.appendChild(txt);
			this.el.appendChild(document.createElement('br'));
		}
	});

	new FeedbackDisplay();
})();

(function () {
	var CommandDisplay = Engine.UI.extend({
		el: '#command',
		initialize: function () {
			
		},
		events: {
			'keypress .input ' : 'processCommand'
		},
		processCommand: function (i,e) {
			console.log('e: ', e);
     if(e.which === 13) {
				var val = i.value;
				console.log('enter: ', val);
			}
		},
	});

	new CommandDisplay();
})();

