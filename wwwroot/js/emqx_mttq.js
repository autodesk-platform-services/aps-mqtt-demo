const socket = io();
socket.on('chat', message => {
  console.log('From server: ', message)
})