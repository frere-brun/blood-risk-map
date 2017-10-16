    function Quantity(numOfPcs) {
        var qty = numOfPcs;
        var percent = numOfPcs / 100;

        this.__defineGetter__("qty", function () {
            return qty;
        });

        this.__defineSetter__("qty", function (val) {        
            val = parseInt(val);
            qty = val;
            percent = val / 100;
        });

        this.__defineGetter__("percent", function () {
            return percent;
        });

        this.__defineSetter__("percent", function (val) {
            percent = val;
            qty = val * 100;
        });
    }