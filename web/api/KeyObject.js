function KeyObject(keyCode, previousKey) {

    // Identificador a tecla (ASCII)
    this.keyCode = keyCode;

    // Momento em que a tecla foi pressionada
    this.keyDownTime = -1;
    // Momento em que a tecla deixou de ser pressionada
    this.keyUpTime = -1;

    // Tecla que foi pressionada antes da tecla atual
    this.previousKey = previousKey;
    // Tecla que foi pressionada após a tecla atual
    this.nextKey = null;




    this.onKeyDown = function() {
        var now = new Date();
        this.keyDownTime = now.getTime();
    };

    this.onKeyUp = function() {
        var now = new Date();
        this.keyUpTime = now.getTime();
    };

    this.getJSONData = function() {
        var jsonData = {};
        jsonData.keyCode = this.getKeyCode();
        jsonData.keyDownTime = this.getDownTime();
        jsonData.keyUpTime = this.getUpTime();
        jsonData.holdTime = this.getHoldTime();
        jsonData.flightTime = this.getFlightTime();
        jsonData.latency = this.getLatency();
        jsonData.releaseLatency = this.getReleaseLatency();
        return jsonData;
    };

    this.setNext = function(nextKey) {
        this.nextKey = nextKey;
    };

    this.getKeyCode = function() {
        return this.keyCode;
    };

    this.getDownTime = function() {
        return this.keyDownTime;
    };

    this.getUpTime = function() {
        return this.keyUpTime;
    };


    // Quanto tempo a tecla ficou pressionada
    this.getHoldTime = function() {
        if ((this.keyDownTime != -1) && (this.keyUpTime != -1)) {
            return (this.keyUpTime - this.keyDownTime);
        }
        return 0;
    };

    // Intervalo entre o release (up) da tecla atual
    // até o próximo keyDown
    this.getFlightTime = function() {
        if (this.nextKey != null) {
            return (this.nextKey.getDownTime() - this.getUpTime());
        }
        return 0;
    };

    // Intervalo entre o keyDown atual e keyDown seguinte
    this.getLatency = function() {
        if (this.nextKey != null) {
            return (this.nextKey.getDownTime() - this.getDownTime());
        }
        return 0;
    };

    // Intervalo entre o release (up) da tecla atual
    // até o próximo release
    this.getReleaseLatency = function() {
        if (this.nextKey != null) {
            return (this.nextKey.getUpTime() - this.getUpTime());
        }
        return 0;
    };

}
;

