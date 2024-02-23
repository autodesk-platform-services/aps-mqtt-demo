const express = require('express');
const {MQTT_URL,MQTT_CLIENT,MQTT_USERNAME,MQTT_PASSWORD, PORT } = require('./config.js');
const { getSensors, getChannels, getSamples } = require('./services/iot.mocked.js');
let app = express();
const server = require('http').createServer(app);
const mqtt = require("mqtt");
const io = require('socket.io')(server);
app.use(express.static('wwwroot'));
app.use(require('./routes/auth.js'));


app.get('/auth/token', async function (req, res, next) {
    try {
        res.json(await getPublicToken());
    } catch (err) {
        next(err);
    }
});

app.get('/iot/sensors', async function (req, res, next) {
    try {
        res.json(await getSensors());
    } catch (err) {
        next(err);
    }
});

app.get('/iot/channels', async function (req, res, next) {
    try {
        res.json(await getChannels());
    } catch (err) {
        next(err);
    }
});

app.get('/iot/samples', async function (req, res, next) {
    try {
        res.json(await getSamples({ start: new Date(req.query.start), end: new Date(req.query.end) }, req.query.resolution));
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

server.listen(PORT, function () { console.log(`Server listening on port ${PORT}...`); });


// connection option
const options = {
    clean: true, // retain session
connectTimeout: 4000, // Timeout period
// Authentication information
clientId: MQTT_CLIENT+Date.now(),
username: MQTT_USERNAME,
password: MQTT_PASSWORD,
}

const connectUrl = MQTT_URL
const client = mqtt.connect(connectUrl, options)

client.on('reconnect', (error) => {
console.log('reconnecting:', error)
})

client.on('connect', (e) => {
    console.clear()
    console.log('connect:')
    console.log(e)
})

client.on('error', (error) => {
console.log('Connection failed:', error)
})

client.subscribe(["data"], [0], function(qosList) {
    console.log(qosList)
});

let data = {timestamps:[],temperature:[],flowrate:[],pressure:[]};
client.on('message', (topic, message) => {
    // const ta = new Uint8Array(message);
    // console.log('ta',ta)
    let i = JSON.parse(arrayBufferToString(message))
    
    data.pressure.push(i.pressure[0]);
    if(data.pressure.length>200)data.pressure.shift();
    
    data.flowrate.push(i.flowrate[0]);
    if(data.flowrate.length>200)data.flowrate.shift();
    
    data.temperature.push(i.temperature[0]);
    data.timestamps.push(i.timestamps[0]);
    if(data.temperature.length>200)data.temperature.shift();
    if(data.timestamps.length>200)data.timestamps.shift();
    
    // data.push({'topic':topic,'value':ta[0],'time':new Date});
    // if(data.length>90)data.shift();
})

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('mqttdata', () => {
        io.emit('mqttdata', data)
    })
    setInterval(()=>{sendData()},1000)
    
  })

function sendData() {
    io.emit('mqttdata', data);
    // data = [];
}

function arrayBufferToString(buffer) {
    let str = '';
    const array = new Uint8Array(buffer);
    for (let i = 0; i < array.length; i++) {
      str += String.fromCharCode(array[i]);
    }
    return str;
  }
