const protocol = parseInt(process.env.REACT_APP_USE_SECURE_WEBSOCKETS, 10) ?
    'wss' : 'ws';

export default (lastUpdated, waitDuration, onUpdate, onRefresh) => {

  const socket = new WebSocket(`${protocol}://${window.location.host}/ws`)

  let errorTimeout;
  let handleRefresh;

  errorTimeout = setTimeout(() => {
    handleRefresh({
      message: `No confirmation recieved prior to ${waitDuration}`
    })
  }, waitDuration)

  handleRefresh = (message) => {
    console.error('Refreshing WebSocket connection due to:', message)
    socket.close()
    clearTimeout(errorTimeout)
    onRefresh && onRefresh()
  }

  socket.onerror = handleRefresh
  socket.onclose = handleRefresh

  socket.onopen = () => {
    console.log('Sending WebSocket subscription request...')
    socket.send(JSON.stringify({
      type: 'REQUEST_SUBSCRIPTION',
      meta: {
        lastUpdated
      }
    }))
  }

  socket.onmessage = (event) => {
    let message = JSON.parse(event.data)

    console.log('Recieved WebSocket message:', message)

    switch(message.type) {
      case 'RECOMMEND_REFETCH':
        handleRefresh({
          message: 'Local state is out-of-sync'
        })
        break;

      case 'SUBSCRIPTION_CONFIRMED':
        clearTimeout(errorTimeout)
        break;

      default:
        onUpdate(message)
        break;
    }
  };
}