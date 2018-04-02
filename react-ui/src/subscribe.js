const protocol = parseInt(process.env.REACT_APP_USE_SECURE_WEBSOCKETS, 10) ?
    'wss' : 'ws';

export default (lastUpdated, waitDuration, onUpdate, onRefresh) => {

  const socket = new WebSocket(`${protocol}://${window.location.host}/ws`)

  let errorTimeout;
  let handleRefresh;
  let refreshHandled = false;

  errorTimeout = setTimeout(() => {
    handleRefresh({
      message: `No confirmation recieved prior to ${waitDuration}`
    })
  }, waitDuration)

  handleRefresh = (message) => {
    // Prevent stampeding refreshes
    if (refreshHandled) return;
    refreshHandled = true;

    // Manage expectations
    console.error('Refreshing WebSocket connection due to:', message)

    // Disregard this connection
    socket.close()

    // Cancel the timeout
    clearTimeout(errorTimeout)

    // Have another go at it...
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