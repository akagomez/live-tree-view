const WebSocket = require('ws');

const {
  FactoryNode
} = require('./models')

const DISPATCH_POOL = []

module.exports = (wss) => {

  wss.on('connection', (ws) => {

    console.log('New WS connection...' )

    // Listen for requests from the client to subscribe
    // to updates
    ws.on('message', async (data) => {
      var message = JSON.parse(data);

      console.log('Message:', message)

      switch(message.type) {

        case 'REQUEST_SUBSCRIPTION':

          // Get all the models that have been updated
          // after the client's most recently updated
          // client-side model
          var result = await FactoryNode.findOne({
            _updated: { $gt: message.meta.lastUpdated }
          })

          // If there are NOT more recently updated models in
          // the DB than the client, it's safe to start
          // sending updates
          if (result === null) {

            console.log('Adding client to dispatch pool...')
            DISPATCH_POOL.push(ws)
            console.log('Client count:', DISPATCH_POOL.length)

            ws.send(JSON.stringify({
              type: 'SUBSCRIPTION_CONFIRMED'
            }))

          // If there ARE more recently updated models in
          // the DB than the client, updates we send
          // will bring the client out-of-sync; Request
          // the client to get a complete update
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

      // Search the dispatch pool for the connection being
      // closed and remove it so no future messages are
      // sent
      for (let i = 0; i < DISPATCH_POOL.length; i++) {
        if (DISPATCH_POOL[i] === ws) {
          DISPATCH_POOL.splice(i, 1)
          break;
        }
      }

      console.log('Client count:', DISPATCH_POOL.length)
    })
  });

  return {

    // Send messages to all of the clients that have
    // validated their local models are up-to-date
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