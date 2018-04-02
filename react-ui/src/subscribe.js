const protocol = parseInt(process.env.REACT_APP_USE_SECURE_WEBSOCKETS, 10) ?
    'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`)

const sendObject = (obj) => {
  socket.send(JSON.stringify(obj))
}

export default (lastUpdated, waitDuration, onUpdate, onError) => {
  let isSubscribed = false;
  let hasErrored = false;

  if (socket.readyState !== 1) {
    setTimeout(() => {
      onError && onError()
    }, waitDuration)
    return;
  }

  sendObject({
    type: 'REQUEST_SUBSCRIPTION',
    meta: {
      lastUpdated
    }
  })

  socket.onmessage = (event) => {

    let message = JSON.parse(event.data)

    console.log('Recieved WS Message:', message)

    switch(message.type) {
      case 'RECOMMEND_REFETCH':
        onError && onError({
          message: ''
        })
        hasErrored = true; // Don't run the timeout onError
        break;

      case 'SUBSCRIPTION_CONFIRMED':
        isSubscribed = true;
        break;

      default:
        if (isSubscribed) {
          onUpdate(message)
        }
        break;
    }
  };

  if (waitDuration && hasErrored) {
    setTimeout(() => {
      if (!isSubscribed) {
        onError && onError({
          message: `No confirmation recieved prior to ${waitDuration}`
        })
      }
    }, waitDuration)
  }
}