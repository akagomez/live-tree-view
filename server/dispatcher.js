const WebSocket = require('ws');

const {
  FactoryNode
} = require('./models')

const DISPATCH_POOL = []

module.exports = (wss) => {

  wss.on('connection', (ws) => {

    console.log('New WS connection...' )

    ws.on('message', async (data) => {
      var message = JSON.parse(data);

      console.log('Message:', message)

      switch(message.type) {
        case 'REQUEST_SUBSCRIPTION':

          var result = await FactoryNode.findOne({
            _updated: { $gt: message.meta.lastUpdated }
          }).sort()

          if (result === null) {

            console.log('Before:', DISPATCH_POOL.length)

            DISPATCH_POOL.push(ws)

            console.log('After:', DISPATCH_POOL.length)

            ws.send(JSON.stringify({
              type: 'SUBSCRIPTION_CONFIRMED'
            }))
          } else {
            ws.send(JSON.stringify({
              type: 'RECOMMEND_REFETCH'
            }))
          }
          break;
      }
    });

    ws.on('close', () => {
      console.log('Disconnected: Removing client from dispatch pool')

      console.log('Before:', DISPATCH_POOL.length)

      for (let i = 0; i < DISPATCH_POOL.length; i++) {
        if (DISPATCH_POOL[i] === ws) {
          DISPATCH_POOL.splice(i, 1)
          break;
        }
      }

      console.log('After:', DISPATCH_POOL.length)
    })
  });

  return {
    send: (message) => {

      console.log('Broadcasting message to dispatch pool:', message)

      DISPATCH_POOL.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message))
        }
      })
    }
  }
}