var $delve;
(function ($delve) {
    function getroom() {
        var rm = rooms.pop();
        return rm;
    }
    $delve.getroom = getroom;
})($delve || ($delve = {}));
