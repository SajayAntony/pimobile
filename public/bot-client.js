(function (D, windows) {

    // This function creates a closure and puts a mousedown handler on the element specified in the "button" parameter.
    function makeIntoPushButton(button, action) {
        var initialDelay = 500;
        var multiplier = 0.7;
        var holdTimer, changeValue, timerIsRunning = false, delay = initialDelay;
        changeValue = function (e) {
            //webSocketConnection.send(action);
            holdTimer = setTimeout(changeValue, delay);
            if (delay > 20) delay = delay * multiplier;
            if (!timerIsRunning) {
                console.log("Sending" + action);
                button.style.background = "red";
                webSocketConnection.send(action);
                // When the function is first called, it puts an onmouseup handler on the whole document 
                // that stops the process when the mouse is released. This is important if the user moves
                // the cursor off of the button.
                var endFunc = function () {
                    console.log("stop");
                    button.style.background = "";
                    clearTimeout(holdTimer);
                    document.onmouseup = null;
                    timerIsRunning = false;
                    delay = initialDelay;
                    webSocketConnection.send("stop");
                }

                document.onmouseup = endFunc;
                document.ontouchend = endFunc;
                timerIsRunning = true;
            }          
        }

        button.ontouchstart = changeValue;
        button.onmousedown = changeValue;
    }

    makeIntoPushButton(document.getElementById('btnForward'), "forward");
    makeIntoPushButton(document.getElementById('btnBackward'), 'back');
   makeIntoPushButton(document.getElementById('btnRight'), 'right');
    makeIntoPushButton(document.getElementById('btnLeft'), 'left');

    var status = D.getElementById('status');
    var webSocketConnection = Object.create({
        init: function () {
            var self = this;
            this.connection = new WebSocket(window.location.href.replace('http', 'ws'));

            this.connection.onopen = function () {
                status.innerText = 'WebSocket: connected';
            };

            this.connection.onerror = function (error) {
                console.log(error);
                self.connection.close();
            };

            this.connection.onclose = function () {
                status.innerText = 'WebSocket: disconnected';
                setTimeout(self.init, 1000);
            };

            this.connection.onmessage = function (message) {
            };
        },
        send: function (data) {
            this.connection.send(data);
        },
        close: function () {
            this.connection.close();
        }
    });
    webSocketConnection.init();

})(document, window)