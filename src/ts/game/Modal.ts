declare var $;

class Modal {
	private _modalPanel = $('<div>').attr('id', 'modal').addClass('eventPanel').css('opacity', '0');
	private container = $('<div />').attr('id', 'content');
	private title = $('<h3 />');
	private msg = $('<div />');
	private close = $('<button />').html('Close');

	private registerEvents() {
		var modal = $('.modal');
		$('.modal button').on('click', function() {
			$(modal).remove();
			})
	}

	private closeModal = function() {
        console.log('closing');
        // _modalPanel = _modalPanel;
        this._modalPanel.animate({opacity: 0}, 200, 'linear');
        this._modalPanel.remove();
        // _modalPanel = null;
    };

    private button = function(button) {
        var func = function() { console.log("click"); };

        if (typeof(button.click) != 'undefined') {
            func = button.click;
        }

        var btn = $('<div>')
            .attr('id', typeof(button.id) != 'undefined' ? button.id : "BTN_1234")
            .addClass('button')
            .text(typeof(button.label) != 'undefined' ? button.label : "button")
            .click(function() { 
                $(this).data("handler")($(this));
            })
            .data("handler",  func );

        if(button.options) {
            var ops = button.options;
            for (var id in ops) {
                btn.data(id, ops[id]);
            } 
        }
        return btn;
    }

	constructor(obj) {

		var that = this;

		$('<div>').addClass('title').appendTo(this.container);
        $('<div>').attr('id', 'message').appendTo(this.container);
        $('<div>').attr('id', 'buttons').appendTo(this.container);


		var title = $('.title', this.container),
            desc = $('#message', this.container),
            btns = $('#buttons', this.container),
            buttons,
            i;

            console.log('title: ', title);

        $('<h2>').text(obj.title).appendTo(title);
        $('<p>').attr('id','banner').html(obj.msg).appendTo(desc);

        this. _modalPanel.animate({opacity: 1}, 200, 'linear');

        if (obj.buttons) {
            buttons = obj.buttons;
            for (i in buttons) {
                if (buttons.hasOwnProperty(i)) {
                    this.button(buttons[i]).appendTo(btns);
                }
            }
        } else {
            this.button({ label: 'OK', click: function() {  console.log('close');that.closeModal(); } }).appendTo(btns);
        }
		// $(this.title).html(obj.title);
		// $(this.msg).html(obj.msg);
		// $(this.container).append(this.title).append(this.msg).append(this.close);
     this._modalPanel.append(this.container);   // 
		$('body').append(this._modalPanel);

		this.registerEvents();
	}
}