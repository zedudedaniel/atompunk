var main = {
  wsSocket: undefined,
  init: function() {
    main.connectToWS();
  },
  connectToWS: function() {
    main.wsSocket = new WebSocket('ws://localhost:8080');
    main.wsSocket.addEventListener('open', function (event) {
      console.log(`Connected to server`);
    });
    // Listen for messages
    this.wsSocket.addEventListener('message', function (message) {
      //console.log('Message from server: ', message.data);
      _.forEach(main.plugins, function(v,k) {
        if(globalThis[v].processMessage) {
          globalThis[v].processMessage(message);
        }
      });
    });
  }
}