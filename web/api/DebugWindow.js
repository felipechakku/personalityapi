

var DebugWindow = {};


DebugWindow.user = null;
DebugWindow.speedElement = null;
DebugWindow.latencyElement = null;
DebugWindow.errorRateElement = null;

DebugWindow.updateInterval = null;

DebugWindow.show = function(user) {
    DebugWindow.user = user;
    DebugWindow.createElements();
    DebugWindow.updateInterval = setInterval(DebugWindow.update, 100);
};

DebugWindow.hide = function() {
    if (DebugWindow.updateInterval != null) {
        clearTimeout(DebugWindow.updateInterval);
        DebugWindow.updateInterval = null;
    }
};

DebugWindow.createElements = function() {
    var content = document.createElement("div");
    content.id = "debugWindow";
    var style = content.style;
    style.width = "280px";
    style.height = "150px";
    style.position = "fixed";
    style.top = "50px";
    style.right = "150px";
    style.backgroundColor = "#F3EDED";
    style.borderRadius = "3px";
    style.fontFamily = "Tahoma";
    style.padding = "10px";

    speedElement = document.createElement("p");
    speedElement.id = "debugWindowSpeed";
    content.appendChild(speedElement);

    latencyElement = document.createElement("p");
    latencyElement.id = "debugWindowLatency";
    content.appendChild(latencyElement);

    errorRateElement = document.createElement("p");
    errorRateElement.id = "debugWindowErrorRate";
    content.appendChild(errorRateElement);


    document.body.appendChild(content);
};

DebugWindow.update = function() {
    var user = DebugWindow.user;
    var keySet = user.getKeySet();
    speedElement.innerHTML = ("Velocidade: " + keySet.getSpeed().toFixed(2) + " letras por segundo");
    if (keySet.getFirstKey() != null) {
        latencyElement.innerHTML = ("Latência: " + keySet.getHoldTimeStandardDeviation().toFixed(2));
    }
    errorRateElement.innerHTML = ("Error: " + keySet.getErrorRate().toFixed(2) + "%");
};