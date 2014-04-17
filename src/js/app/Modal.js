var Modal = (function () {
    function Modal(obj) {
        this._modalPanel = $('<div>').attr('id', 'modal').addClass('eventPanel').css('opacity', '0');
        this.container = $('<div />').addClass('modal');
        this.title = $('<h3 />');
        this.msg = $('<div />');
        this.close = $('<button />').html('Close');
        this.closeModal = function () {
            console.log('closing');

            // _modalPanel = _modalPanel;
            this._modalPanel.animate({ opacity: 0 }, 200, 'linear');
            this._modalPanel.remove();
            // _modalPanel = null;
        };
        this.button = function (button) {
            var func = function () {
                console.log("click");
            };

            if (typeof (button.click) != 'undefined') {
                func = button.click;
            }

            var btn = $('<div>').attr('id', typeof (button.id) != 'undefined' ? button.id : "BTN_1234").addClass('button').text(typeof (button.label) != 'undefined' ? button.label : "button").click(function () {
                $(this).data("handler")($(this));
            }).data("handler", func);

            if (button.options) {
                var ops = button.options;
                for (var id in ops) {
                    btn.data(id, ops[id]);
                }
            }
            return btn;
        };
        var that = this;

        $('<div>').addClass('title').appendTo(this._modalPanel);
        $('<div>').attr('id', 'message').appendTo(this._modalPanel);
        $('<div>').attr('id', 'buttons').appendTo(this._modalPanel);

        var title = $('.title', this._modalPanel), desc = $('#message', this._modalPanel), btns = $('#buttons', this._modalPanel), buttons, i;

        console.log('title: ', title);

        $('<h2>').text(obj.title).appendTo(title);
        $('<p>').attr('id', 'banner').html(obj.msg).appendTo(desc);

        this._modalPanel.animate({ opacity: 1 }, 200, 'linear');

        if (obj.buttons) {
            buttons = obj.buttons;
            for (i in buttons) {
                if (buttons.hasOwnProperty(i)) {
                    this.button(buttons[i]).appendTo(btns);
                }
            }
        } else {
            this.button({ label: 'OK', click: function () {
                    console.log('close');
                    that.closeModal();
                } }).appendTo(btns);
        }

        // $(this.title).html(obj.title);
        // $(this.msg).html(obj.msg);
        // $(this.container).append(this.title).append(this.msg).append(this.close);
        $('body').append(this._modalPanel);

        this.registerEvents();
        /*
        <div id="help" class="modal" style="
        width: 300px;
        height: auto;
        border:  1px solid black;
        position: absolute;
        top: 100px;
        left: 269px;
        background-color: white;
        padding: 10px;
        ">
        Commands:<br>
        <ul>
        <li>Go [direction]</li>
        <li>help</li>
        </ul>
        </div>
        */
    }
    Modal.prototype.registerEvents = function () {
        var modal = $('.modal');
        $('.modal button').on('click', function () {
            $(modal).remove();
        });
    };
    return Modal;
})();
