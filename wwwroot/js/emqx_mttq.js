const socket = io();
socket.on('mqttdata', message => {
  console.log('From server: ', message)
})